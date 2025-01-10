import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { decodeToken } from '../utils/decodeToken';
import api from '../services/api';

// Safeguard for localStorage
const getLocalStorageItem = (key) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

// AsyncThunk for logging in a user
export const loginUser = createAsyncThunk('auth/loginUser', async ({ username, password }, thunkAPI) => {
  try {
    const response = await api.post('/api/users/login/', { username, password });
    const { access, refresh } = response.data;

    // Save tokens to localStorage
    localStorage.setItem(ACCESS_TOKEN, access);
    localStorage.setItem(REFRESH_TOKEN, refresh);

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Invalid login');
  }
});

// AsyncThunk for fetching user details
export const fetchUserDetails = createAsyncThunk('auth/fetchUserDetails', async (_, thunkAPI) => {
  try {
    const response = await api.get('/api/users/profile/');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch user details');
  }
});

// Initial state
const initialState = {
  authTokens: getLocalStorageItem(ACCESS_TOKEN)
    ? {
        access: getLocalStorageItem(ACCESS_TOKEN),
        refresh: getLocalStorageItem(REFRESH_TOKEN),
      }
    : null,
  user: getLocalStorageItem('user') ? JSON.parse(getLocalStorageItem('user')) : null,
  loading: false,
  error: null,
};

// Slice definition
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthTokens: (state, action) => {
      state.authTokens = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.authTokens = null;
      state.user = null;
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authTokens = action.payload;
        state.user = decodeToken(action.payload.access) || null;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
        state.loading = false;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { logoutUser, setAuthTokens, setUser } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
