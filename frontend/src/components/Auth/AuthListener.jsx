import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthListener = () => {
    const authTokens = useSelector((state) => state.auth.authTokens);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const publicRoutes = ['/login', '/register'];

        // Redirect to login only if user is not authenticated and not on a public route
        if (!authTokens && !publicRoutes.includes(location.pathname)) {
            navigate('/login');
        }
    }, [authTokens, navigate, location.pathname]);

    return null;
};

export default AuthListener;
