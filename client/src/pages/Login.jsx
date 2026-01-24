import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            navigate('/dashboard');
        } else {
            alert(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col font-body selection:bg-primary/20 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 size-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <header className="px-6 py-10 flex justify-center">
                <Link to="/">
                    <Logo />
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 pb-20">
                <div className="w-full max-w-[440px] glass-card p-10 md:p-12 rounded-3xl border-white/5 animate-fade-in shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="h-px w-6 bg-primary/30"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Identity_Link</span>
                            <div className="h-px w-6 bg-primary/30"></div>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Mainframe Access</h2>
                        <p className="text-text-secondary text-xs font-medium italic">Demo active. Secondary clearance is not required.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Archive ID (Email)</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    className="w-full bg-surface-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all font-bold placeholder:text-text-muted text-sm"
                                    placeholder="agent@hypershield.net"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-xl">alternate_email</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Encryption Hash (Password)</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    className="w-full bg-surface-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all font-bold placeholder:text-text-muted text-sm"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-xl">verified_user</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="btn-primary w-full h-14 text-sm font-bold uppercase tracking-widest shadow-xl shadow-primary/20"
                            >
                                Establishing Uplink
                            </button>
                            <div className="mt-8 flex items-center justify-between px-2">
                                <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors">Recover Seed</a>
                                <div className="size-1 bg-white/10 rounded-full"></div>
                                <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors">Bypass Mode</a>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Login;
