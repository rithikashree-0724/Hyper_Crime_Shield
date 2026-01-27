import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'citizen',
        phone: '',
        badgeId: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        const res = await register(formData);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col font-body selection:bg-primary/20 relative overflow-hidden">
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 size-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <header className="px-6 py-8 flex justify-center">
                <Link to="/">
                    <Logo />
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 pb-20">
                <div className="w-full max-w-[500px] glass-card p-8 rounded-3xl border-white/5 animate-fade-in shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2">New User Registration</h2>
                        <p className="text-text-secondary text-xs">Create your account to get started.</p>
                    </div>

                    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg mb-4 text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                placeholder="user@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Account Role</label>
                            <select
                                name="role"
                                className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="citizen">Citizen</option>
                                <option value="investigator">Investigator</option>
                            </select>
                        </div>

                        {formData.role === 'investigator' && (
                            <div className="flex flex-col gap-1 animate-fade-in">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Badge ID</label>
                                <input
                                    type="text"
                                    name="badgeId"
                                    className="w-full bg-surface-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                    placeholder="BADGE-12345"
                                    value={formData.badgeId}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary w-full h-12 text-sm font-bold uppercase tracking-widest shadow-lg mt-2"
                        >
                            Create Account
                        </button>

                        <div className="flex items-center justify-center mt-4">
                            <Link to="/login" className="text-xs text-text-muted hover:text-primary transition-colors">
                                Already have an account? Login
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Register;
