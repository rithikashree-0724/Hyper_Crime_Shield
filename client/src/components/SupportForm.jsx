import React from 'react';

const SupportForm = () => {
    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black font-display italic uppercase tracking-tighter">Secure Communication</h2>
                <p className="text-text-secondary text-sm font-medium">Submit system inquiries and non-critical data logs securely.</p>
            </div>

            <form className="glass-card p-10 rounded-[48px] border-white/5 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic ml-1">Officer Name</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-text-muted focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-bold" placeholder="Det. Vance" type="text" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic ml-1">Badge Hash</label>
                        <div className="relative">
                            <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-text-muted text-sm font-mono" readOnly type="text" value="0x772_HC_SYNC" />
                            <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-white/20">lock</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic ml-1">Archive Segment</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold appearance-none focus:ring-1 focus:ring-primary outline-none cursor-pointer text-sm">
                            <option className="bg-background-dark">System Anomaly</option>
                            <option className="bg-background-dark">Feature Request</option>
                            <option className="bg-background-dark">Hardware Decryption</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic ml-1">Urgency Scalar</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold appearance-none focus:ring-1 focus:ring-primary outline-none cursor-pointer text-sm">
                            <option className="bg-background-dark">Alpha - Low</option>
                            <option className="bg-background-dark">Beta - Standard</option>
                            <option className="bg-background-dark text-accent-red">Omega - Critical</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted italic ml-1">Inquiry Data</label>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white placeholder:text-text-muted focus:ring-1 focus:ring-primary outline-none transition-all text-sm min-h-[160px] font-medium resize-none" placeholder="Enter log details or inquiry..."></textarea>
                </div>

                <div className="pt-4">
                    <button className="btn-primary w-full h-16 group" type="button">
                        <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">send_and_archive</span>
                        Transmit Encrypted Log
                    </button>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 text-center mt-6">End-to-End Tunnel Encryption Active</p>
                </div>
            </form>
        </div>
    );
};

export default SupportForm;
