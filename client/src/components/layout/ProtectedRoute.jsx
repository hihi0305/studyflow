import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

export const ProtectedRoute = () => {
    const token = authService.getToken();
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};