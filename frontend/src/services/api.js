import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../features/constants";
import { logoutUser, setAuthTokens } from "../features/authSlice";
// import store from "../store/store";



const api = axios.create({
    baseURL: 'import.meta.env.VITE_API_URL'
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request Interceptor: Adds the access token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handles token refresh and retries failed requests
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            if (!refreshToken) {
                const { default: store } = await import("../store/store");
                store.dispatch(logoutUser());
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                const { data } = await api.post('api/users/token/refresh/', { refresh: refreshToken });
                const { default: store } = await import("../store/store");
                
                localStorage.setItem(ACCESS_TOKEN, data.access);
                store.dispatch(setAuthTokens({ access: data.access, refresh: refreshToken }));

                processQueue(null, data.access);

                originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
                return api(originalRequest);
            } catch (refreshError) {
                const { default: store } = await import("../store/store");
                processQueue(refreshError, null);
                store.dispatch(logoutUser());
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
