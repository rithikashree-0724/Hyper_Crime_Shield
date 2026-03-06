import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import * as API from '../api';
import Logo from '../components/Logo';

const Verify = () => {
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying your email address...');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link. Missing token.');
                return;
            }

            try {
                const res = await API.verifyEmail(token);
                if (res.data.success) {
                    setStatus('success');
                    setMessage('Your email has been successfully verified! You can now log in to your account.');
                } else {
                    setStatus('error');
                    setMessage(res.data.message || 'Verification failed.');
                }
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'An error occurred during verification.');
            }
        };

        verifyToken();
    }, [location]);

    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col font-body selection:bg-primary/20 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 size-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <header className="px-6 py-10 flex justify-center relative z-10">
                <Link to="/">
                    <Logo />
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 pb-20 relative z-10">
                <div className="w-full max-w-[440px] glass-card p-10 md:p-12 rounded-3xl border-border animate-fade-in shadow-2xl relative overflow-hidden text-center">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50`}></div>

                    <div className="flex justify-center mb-8">
                        {status === 'verifying' && (
                            <div className="size-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                        )}
                        {status === 'success' && (
                            <div className="size-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center animate-bounce-short">
                                <span className="material-symbols-outlined text-4xl">verified</span>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="size-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl">error</span>
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-extrabold tracking-tight mb-4">
                        {status === 'verifying' ? 'Verifying...' : status === 'success' ? 'Verification Successful' : 'Verification Failed'}
                    </h2>

                    <p className="text-text-secondary text-sm font-medium leading-relaxed mb-10">
                        {message}
                    </p>

                    {status !== 'verifying' && (
                        <Link
                            to="/login"
                            className="btn-primary w-full h-14 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center justify-center"
                        >
                            Return to Login
                        </Link>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Verify;
