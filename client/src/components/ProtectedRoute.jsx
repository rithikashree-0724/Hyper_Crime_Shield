import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requireVerification = false }) => {
    const { user, loading } = useAuth(); // Assuming loading state exists

    if (loading) return <div>Loading...</div>; // Or a spinner

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireVerification && !user.isVerified) {
        alert('Please verify your account to access this feature.');
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
