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
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        const res = await register(formData);
        if (res.success) {
            setSuccess('Registration successful! You can now login immediately without email verification.');
            setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'citizen' });
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col font-body selection:bg-primary/20 relative overflow-hidden">
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 size-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <header className="px-6 py-8 flex justify-center">
                <Link to="/">
                    <Logo />
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 pb-20">
                <div className="w-full max-w-[500px] glass-card p-8 rounded-3xl border-border animate-fade-in shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-extrabold tracking-tight mb-2">New User Registration</h2>
                        <p className="text-text-secondary text-xs">Create your account to get started.</p>
                    </div>

                    {error && (
                        <div className="mb-4 flex flex-col gap-2">
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg text-center">{error}</div>
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
                    {success && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs p-3 rounded-lg mb-4 text-center animate-pulse">{success}</div>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
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
                                    className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
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
                                    className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
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
                                    className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full h-14 text-sm font-bold uppercase tracking-widest shadow-xl mt-4"
                        >
                            Create Citizen Account
                        </button>

                        <div className="p-4 bg-accent-violet/5 rounded-2xl border border-accent-violet/10 text-center mt-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-accent-violet/80">Authority Accounts</p>
                            <p className="text-[11px] text-text-secondary mt-1">Admin or Investigator? Contact System Administrator for authorized credentials.</p>
                        </div>


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
