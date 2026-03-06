import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setSuccess('');

        const res = await login(email, password);

        if (res.success) {

            setSuccess('Login Successful! Redirecting to your dashboard...');

            setTimeout(() => {
                if (res.user.role === 'admin') navigate('/admin-dashboard');
                else if (res.user.role === 'investigator') navigate('/investigator-dashboard');
                else navigate('/dashboard');
            }, 2000);
        } else {
            setError(res.message);
        }
    };


    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col font-body selection:bg-primary/20 relative overflow-hidden transition-colors duration-500">
            {/* Background Accent */}
            <div className={`absolute top-[20%] left-1/2 -translate-x-1/2 size-[500px] rounded-full blur-[120px] pointer-events-none opacity-20 bg-primary`}></div>

            <header className="px-6 py-10 flex justify-center relative z-10">
                <Link to="/">
                    <Logo />
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 pb-20 relative z-10">
                <div className="w-full max-w-[440px] glass-card p-10 md:p-12 rounded-3xl border-border animate-fade-in shadow-2xl relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50`}></div>

                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className={`h-px w-6 bg-primary opacity-50`}></div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest text-primary`}>Secure Login</span>
                            <div className={`h-px w-6 bg-primary opacity-50`}></div>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-text-secondary text-xs font-medium italic">Enter your authorized credentials to continue.</p>
                    </div>

                    {error && (
                        <div className="mb-6 flex flex-col gap-3">
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-shake">
                                <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                                <p className="text-xs font-bold text-red-500 uppercase tracking-wider leading-relaxed">{error}</p>
                            </div>
                            {error.toLowerCase().includes('verified') && (
                                <button
                                    onClick={async () => {
                                        try {
                                            const res = await API_SERVICE.resendVerification(email);
                                            alert(res.data.message || 'Verification email resent!');
                                        } catch (err) {
                                            const errMsg = err.response?.data?.error?.message || err.response?.data?.message || err.message;
                                            alert(`Failed to resend: ${errMsg}`);
                                        }
                                    }}
                                    className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest hover:underline text-center bg-emerald-500/5 py-2 rounded-lg border border-emerald-500/10 transition-colors"
                                >
                                    Resend Verification Email
                                </button>
                            )}
                            {error.toLowerCase().includes('network') && (
                                <button
                                    onClick={async () => {
                                        try {
                                            const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
                                            const res = await fetch(`${API_ROOT}/health`);
                                            if (res.ok) alert('Server is UP! Please check your local connection or proxy.');
                                            else alert('Server is reachable but returned an error. Check server logs.');
                                        } catch (e) {
                                            alert('Server is UNREACHABLE. Please ensure the backend is running on port 5001.');
                                        }
                                    }}
                                    className="text-[9px] font-bold text-primary uppercase tracking-widest hover:underline text-center bg-primary/5 py-2 rounded-lg border border-primary/10 transition-colors"
                                >
                                    Troubleshoot Connection
                                </button>
                            )}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 animate-fade-in shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                            <div className="size-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider leading-relaxed">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Email or Badge ID</label>
                            <input
                                type="text"
                                className={`w-full bg-primary/5 border border-border rounded-xl px-5 py-4 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all font-bold placeholder:text-text-muted text-sm`}
                                placeholder="name@example.com or BADGE123"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Password</label>
                            <input
                                type="password"
                                className={`w-full bg-primary/5 border border-border rounded-xl px-5 py-4 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all font-bold placeholder:text-text-muted text-sm`}
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="pt-4 flex flex-col gap-4">
                            <button
                                type="submit"
                                className={`w-full h-14 rounded-xl text-sm font-bold uppercase tracking-widest shadow-xl transition-all hover:brightness-110 active:scale-95 text-white bg-primary shadow-primary/20`}
                            >
                                Sign In
                            </button>

                            <div className="flex items-center justify-between px-2">
                                <button
                                    type="button"
                                    onClick={() => setIsForgotModalOpen(true)}
                                    className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
                                >
                                    Forgot Password?
                                </button>
                                <div className="size-1 bg-border rounded-full"></div>
                                <Link to="/register" className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors">Create Account</Link>
                            </div>
                        </div>

                    </form>
                </div>

                <ForgotPasswordModal
                    isOpen={isForgotModalOpen}
                    onClose={() => setIsForgotModalOpen(false)}
                />
            </main>
        </div>
    );
};

export default Login;
