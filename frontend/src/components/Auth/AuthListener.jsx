import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthListener = () => {
    const authTokens = useSelector((state) => state.auth.authTokens);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const publicRoutes = ['/login', '/register','/','/book_list'];

        // Redirect to login only if user is not authenticated and not on a public route
        if (!authTokens && !publicRoutes.includes(location.pathname)) {
            toast.warning("Login for more personalized experiance")
            navigate('/login');
        }
    }, [authTokens, navigate, location.pathname]);

    return null;
};

export default AuthListener;
