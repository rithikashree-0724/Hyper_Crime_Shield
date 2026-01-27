import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SupportForm = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        segment: 'System Anomaly',
        urgency: 'Alpha - Low',
        data: ''
    });

    const handleTransmit = (e) => {
        e.preventDefault();
        if (!formData.data) return;

        setLoading(true);
        // Simulate encryption and transmission delay
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setFormData({ ...formData, data: '' });
            setTimeout(() => setSuccess(false), 5000);
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black font-display italic uppercase tracking-tighter">Secure Communication</h2>
                <p className="text-text-secondary text-sm font-medium">Submit system inquiries and non-critical data logs securely.</p>
            </div>

            <form onSubmit={handleTransmit} className="glass-card p-10 rounded-[48px] border-white/5 flex flex-col gap-8 relative overflow-hidden">
                {success && (
                    <div className="absolute inset-0 bg-background-dark/90 backdrop-blur-sm z-10 flex items-center justify-center flex-col gap-4 animate-fade-in">
                        <div className="size-20 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-emerald-500">lock_check</span>
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-widest uppercase">Transmission Complete</h3>
                        <p className="text-emerald-400 font-mono text-xs">LOG_HASH: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                        <button type="button" onClick={() => setSuccess(false)} className="mt-4 text-xs font-bold text-text-muted hover:text-white uppercase tracking-widest">
                            Return to Console
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic ml-1">Officer Name</label>
                        <input
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-text-muted focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-bold opacity-50 cursor-not-allowed"
                            type="text"
                            value={user?.name || 'Unknown Agent'}
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic ml-1">Badge Hash</label>
                        <div className="relative">
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-text-muted text-sm font-mono opacity-50 cursor-not-allowed"
                                readOnly
                                type="text"
                                value={user?._id ? `0x${user._id.substring(0, 8).toUpperCase()}_${user.role.substring(0, 2).toUpperCase()}` : '0xVOID_AUTH'}
                            />
                            <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-white/20">lock</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic ml-1">Archive Segment</label>
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold appearance-none focus:ring-1 focus:ring-primary outline-none cursor-pointer text-sm"
                            value={formData.segment}
                            onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                        >
                            <option className="bg-background-dark">System Anomaly</option>
                            <option className="bg-background-dark">Feature Request</option>
                            <option className="bg-background-dark">Hardware Decryption</option>
                            <option className="bg-background-dark">Personnel Report</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic ml-1">Urgency Scalar</label>
                        <select
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold appearance-none focus:ring-1 focus:ring-primary outline-none cursor-pointer text-sm"
                            value={formData.urgency}
                            onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        >
                            <option className="bg-background-dark">Alpha - Low</option>
                            <option className="bg-background-dark">Beta - Standard</option>
                            <option className="bg-background-dark text-accent-red">Omega - Critical</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic ml-1">Inquiry Data</label>
                    <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white placeholder:text-text-muted focus:ring-1 focus:ring-primary outline-none transition-all text-sm min-h-[160px] font-medium resize-none"
                        placeholder="Enter log details, encryption keys, or system queries..."
                        value={formData.data}
                        onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                        required
                    ></textarea>
                </div>

                <div className="pt-4">
                    <button
                        className={`btn-primary w-full h-16 group relative overflow-hidden ${loading ? 'cursor-wait opacity-80' : ''}`}
                        type="submit"
                        disabled={loading}
                    >
                        <div className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">send_and_archive</span>
                            Transmit Encrypted Log
                        </div>

                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center gap-3 font-mono text-sm tracking-widest uppercase animate-pulse">
                                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                                Encrypting Protocol...
                            </div>
                        )}
                    </button>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 text-center mt-6">End-to-End Tunnel Encryption Active</p>
                </div>
            </form>
        </div>
    );
};

export default SupportForm;
