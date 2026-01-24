import React, { useContext } from 'react';
import Header from '../components/Header';
import SupportForm from '../components/SupportForm';
import SystemStatus from '../components/SystemStatus';
import { AuthContext } from '../context/AuthContext';

const Support = () => {
    const { toggleLockdown } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-body pb-24">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex flex-col gap-12">
                    {/* Emergency Protocol Section */}
                    <div className="glass-card rounded-2xl overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent relative group">
                        <div className="p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-10">
                            <div className="flex flex-col gap-5 flex-1 max-w-2xl text-center lg:text-left items-center lg:items-start">
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded border border-amber-500/20 tracking-[0.2em]">Priority-1 Incident Triage</span>
                                <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight">Rapid Response Node</h2>
                                <p className="text-text-secondary leading-relaxed font-medium">
                                    In the event of an active intrusion, data exfiltration, or systemic denial of service,
                                    initialize an immediate segment lockdown to contain the threat and preserve forensic logs.
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 w-full md:w-auto">
                                <button
                                    onClick={toggleLockdown}
                                    className="h-16 px-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-widest flex items-center justify-center gap-4 shadow-xl shadow-amber-900/40 transition-all hover:scale-[1.02]"
                                >
                                    <span className="material-symbols-outlined text-2xl">security_update_warning</span>
                                    INITIATE LOCKDOWN
                                </button>
                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center gap-4">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">CSIRT HOTLINE</span>
                                    <span className="text-lg font-bold text-white tracking-widest font-mono">1-800-CERT-911</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Division Cards */}
                    <div className="grid md:grid-cols-3 gap-8 mb-4">
                        {[
                            { title: 'Digital Forensics Unit', sub: 'ID: DFU-72', desc: 'Detailed packet-level analysis and immutable log verification for legal compliance.', icon: 'fingerprint' },
                            { title: 'Response & Containment', sub: 'ID: RCU-04', desc: 'Localized network isolation and malicious payload neutralization protocols.', icon: 'shield' },
                            { title: 'Compliance & Legal', sub: 'ID: CLU-11', desc: 'Assistance with GDPR notifications, insurance filings, and regulatory reporting.', icon: 'gavel' }
                        ].map((u, i) => (
                            <div key={i} className="glass-card p-10 rounded-2xl border-white/5 hover:bg-white/[0.05] transition-all group">
                                <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl font-bold">{u.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold tracking-tight mb-1">{u.title}</h3>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 italic">{u.sub}</p>
                                <p className="text-sm text-text-secondary leading-relaxed font-medium">{u.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Interactive Forms */}
                    <div className="grid lg:grid-cols-3 gap-12 mt-4 animate-fade-in">
                        <div className="lg:col-span-2">
                            <SupportForm />
                        </div>
                        <div className="lg:col-span-1">
                            <SystemStatus />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Support;
