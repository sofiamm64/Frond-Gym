import { useNavigate } from 'react-router-dom';

export const useHandleLogout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        navigate('/');
    };

    return handleLogout;
};