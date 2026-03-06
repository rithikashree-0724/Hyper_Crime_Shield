import React, { useState } from 'react';
import * as API from '../api';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await API.forgotPassword(email);
            setMessage(data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await API.verifyResetOtp(email, otp);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setError('');
        setLoading(true);
        try {
            await API.resetPassword({ email, otp, newPassword });
            setMessage('Password reset successful! You can now login.');
            setTimeout(() => {
                onClose();
                setStep(1);
                setEmail('');
                setOtp('');
                setNewPassword('');
                setConfirmPassword('');
                setMessage('');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-[400px] glass-card p-8 rounded-3xl border-border shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full hover:bg-primary/10 text-text-muted transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>

                <div className="text-center mb-8 pt-2">
                    <h3 className="text-xl font-extrabold tracking-tight">
                        {step === 1 && 'Reset Password'}
                        {step === 2 && 'Verify OTP'}
                        {step === 3 && 'New Password'}
                    </h3>
                    <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mt-2">
                        {step === 1 && 'Enter your registered email'}
                        {step === 2 && 'Check your inbox for the code'}
                        {step === 3 && 'Choose a strong new password'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-shake">
                        <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{error}</p>
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
                        <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{message}</p>
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            disabled={loading}
                            className="w-full h-12 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                        <input
                            type="text"
                            required
                            placeholder="Enter 6-digit OTP"
                            className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-sm text-center tracking-[10px] focus:outline-none focus:ring-1 focus:ring-primary/40 font-black"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            disabled={loading}
                            className="w-full h-12 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-[9px] font-bold text-text-muted hover:text-text-primary uppercase tracking-widest text-center"
                        >
                            Back to Email
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                        <input
                            type="password"
                            required
                            placeholder="New Password"
                            className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 font-medium"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            required
                            placeholder="Confirm New Password"
                            className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 font-medium"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            disabled={loading}
                            className="w-full h-12 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Resetting...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
