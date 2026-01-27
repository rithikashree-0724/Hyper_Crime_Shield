import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Login = () => {
    const [selectedRole, setSelectedRole] = useState('citizen');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const getTheme = (role) => {
        switch (role) {
            case 'investigator': return {
                accent: 'amber-500',
                bg: 'bg-amber-500',
                text: 'text-amber-500',
                shadow: 'shadow-amber-500/20',
                ring: 'focus:ring-amber-500/40',
                gradient: 'from-amber-500/40',
                softBg: 'bg-amber-500/10',
                border: 'border-amber-500/20'
            };
            case 'admin': return {
                accent: 'red-500',
                bg: 'bg-red-500',
                text: 'text-red-500',
                shadow: 'shadow-red-500/20',
                ring: 'focus:ring-red-500/40',
                gradient: 'from-red-500/40',
                softBg: 'bg-red-500/10',
                border: 'border-red-500/20'
            };
            default: return {
                accent: 'primary',
                bg: 'bg-primary',
                text: 'text-primary',
                shadow: 'shadow-primary/20',
                ring: 'focus:ring-primary/40',
                gradient: 'from-primary/40',
                softBg: 'bg-primary/10',
                border: 'border-primary/20'
            };
        }
    };

    const theme = getTheme(selectedRole);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.success) {
            if (res.user.role !== selectedRole) {
                setError(`Access denied. You are not a registered ${selectedRole}.`);
                await logout();
                return;
            }

            if (res.user.role === 'admin') navigate('/admin-dashboard');
            else if (res.user.role === 'investigator') navigate('/investigator-dashboard');
            else navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col font-body selection:bg-primary/20 relative overflow-hidden transition-colors duration-500">
            {/* Background Accent */}
            <div className={`absolute top-[20%] left-1/2 -translate-x-1/2 size-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-500 opacity-20 ${theme.bg}`}></div>

            <header className="px-6 py-10 flex justify-center relative z-10">
                <Link to="/">
                    <Logo />
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 pb-20 relative z-10">
                <div className="w-full max-w-[440px] glass-card p-10 md:p-12 rounded-3xl border-white/5 animate-fade-in shadow-2xl relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent ${theme.text} opacity-50`}></div>

                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className={`h-px w-6 ${theme.bg} opacity-50`}></div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.text} transition-colorsDuration-300`}>Login Portal</span>
                            <div className={`h-px w-6 ${theme.bg} opacity-50`}></div>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Welcome Back</h2>
                        <p className="text-text-secondary text-xs font-medium italic">Select your role to access the system.</p>
                    </div>

                    {/* Role Tabs */}
                    <div className="flex bg-surface-dark border border-white/5 rounded-xl p-1 mb-8">
                        {['citizen', 'investigator', 'admin'].map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setSelectedRole(role)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selectedRole === role ? `${theme.bg} text-white shadow-lg` : 'text-text-muted hover:text-white'}`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-shake">
                            <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                            <p className="text-xs font-bold text-red-500 uppercase tracking-wider">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    className={`w-full bg-surface-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 ${theme.ring} transition-all font-bold placeholder:text-text-muted text-sm`}
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <span className={`material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:${theme.text} transition-colors text-xl`}>alternate_email</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Password</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    className={`w-full bg-surface-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 ${theme.ring} transition-all font-bold placeholder:text-text-muted text-sm`}
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className={`material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:${theme.text} transition-colors text-xl`}>verified_user</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className={`w-full h-14 rounded-xl text-sm font-bold uppercase tracking-widest shadow-xl transition-all hover:brightness-110 active:scale-95 text-white ${theme.bg} ${theme.shadow}`}
                            >
                                Sign In
                            </button>
                            <div className="mt-8 flex items-center justify-between px-2">
                                <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors">Forgot Password?</a>
                                <div className="size-1 bg-white/10 rounded-full"></div>
                                <Link to="/register" className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors">Create Account</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Login;
