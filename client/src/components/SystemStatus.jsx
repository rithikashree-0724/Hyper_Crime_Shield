import React from 'react';

const SystemStatus = () => {
    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="glass-card border-white/5 rounded-[32px] p-8">
                <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">dns</span> Satellite Uplink
                </h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-text-secondary uppercase tracking-widest">Core Database</span>
                        <span className="flex items-center gap-2 text-emerald-400">
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span> SYNCED
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-text-secondary uppercase tracking-widest">Predictive AI</span>
                        <span className="flex items-center gap-2 text-amber-500">
                            <span className="size-1.5 rounded-full bg-amber-500"></span> RETRAINING
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-text-secondary uppercase tracking-widest">Network Node</span>
                        <span className="flex items-center gap-2 text-emerald-400">
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ACTIVE
                        </span>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-1">
                    <div className="text-[10px] text-text-muted font-black uppercase tracking-widest">Est. Response Lag</div>
                    <div className="text-white font-mono text-xl font-black italic tracking-tighter">0.4ms <span className="text-[10px] text-text-secondary not-italic font-bold">RTT</span></div>
                </div>
            </div>

            <div className="glass-card border-white/5 rounded-[32px] p-8 flex-1 flex flex-col">
                <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2 italic">
                    <span className="material-symbols-outlined text-primary text-sm">terminal</span> Tech_Docs
                </h3>
                <div className="flex flex-col gap-4 flex-1">
                    {[
                        { q: 'Encryption Key Reset?', a: 'Navigate to Security Settings and initiate a token handshake with your primary node.' },
                        { q: 'Identify False Positive?', a: 'Flag the case in your Tactical Dashboard and tag with "ANOMALY_LOG".' }
                    ].map((item, idx) => (
                        <details key={idx} className="group">
                            <summary className="flex cursor-pointer items-center justify-between rounded-xl bg-white/5 p-4 text-xs font-bold text-white hover:bg-white/10 transition-colors list-none">
                                <span>{item.q}</span>
                                <span className="material-symbols-outlined transition group-open:rotate-180 text-sm">expand_more</span>
                            </summary>
                            <div className="px-4 py-4 text-xs text-text-secondary leading-relaxed font-medium">
                                {item.a}
                            </div>
                        </details>
                    ))}
                </div>
                <div className="mt-8">
                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] mb-4">Uplink Materials</h4>
                    <div className="space-y-4">
                        <a className="flex items-center gap-3 text-xs font-bold text-primary hover:text-white transition-colors group" href="#">
                            <span className="material-symbols-outlined text-sm group-hover:scale-110">description</span>
                            Operation_Manual_v4.2.pdf
                        </a>
                        <a className="flex items-center gap-3 text-xs font-bold text-primary hover:text-white transition-colors group" href="#">
                            <span className="material-symbols-outlined text-sm group-hover:scale-110">gavel</span>
                            Privacy_Compliance_01.hash
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemStatus;
