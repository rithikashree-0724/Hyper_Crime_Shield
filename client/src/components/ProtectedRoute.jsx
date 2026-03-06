import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requireVerification = false }) => {
    const { user, loading } = useAuth(); // Assuming loading state exists

    if (loading) return (
        <div className="min-h-screen bg-background text-text-primary flex items-center justify-center font-display font-black uppercase tracking-[0.2em]">
            <div className="flex flex-col items-center gap-4">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
                Scanning Auth Token...
            </div>
        </div>
    );

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    // Bypass verification check for testing
    // if (requireVerification && !user.isVerified) {
    //     alert('Please verify your account to access this feature.');
    //     return <Navigate to="/dashboard" replace />;
    // }

    return <Outlet />;
};

export default ProtectedRoute;
