import React from 'react';
import Header from '../components/Header';
import Logo from '../components/Logo';

const Resources = () => {
    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-body">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex flex-col gap-16">
                    {/* Header Section */}
                    <div className="flex flex-col gap-6 text-center max-w-3xl mx-auto items-center">
                        <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest text-center">Security Advisory Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Technical Intelligence</h1>
                        <p className="text-lg text-text-secondary leading-relaxed font-medium capitalize">
                            Professional guidance on threat vectors, system hardening, and regulatory compliance.
                        </p>
                    </div>

                    {/* Threat Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Social Engineering', desc: 'Pretexting and baiting techniques designed to extract credentials from corporate nodes.', icon: 'psychology' },
                            { title: 'Advanced Persistent Threats', desc: 'Subtle, long-term intrusions focused on persistent data exfiltration and state-sponsored espionage.', icon: 'security_update_warning' },
                            { title: 'Business Email Compromise', desc: 'Sophisticated spoofing for unauthorized financial transfers and executive impersonation.', icon: 'mail_lock' },
                            { title: 'DDoS Vectors', desc: 'Systemic flooding of network bandwidth to disrupt critical services and infrastructure.', icon: 'speed' },
                            { title: 'Endpoint Vulnerability', desc: 'Direct exploitation of unpatched software and insecure zero-day entry points.', icon: 'terminal' }
                        ].map((threat, i) => (
                            <div key={i} className="glass-card p-10 rounded-2xl border-white/5 group hover:bg-white/[0.05] transition-all">
                                <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl font-bold">{threat.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 tracking-tight">{threat.title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed font-medium mb-8">
                                    {threat.desc}
                                </p>
                                <button className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-primary transition-colors flex items-center gap-2">
                                    Regulatory Context
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Defense Strategy Section */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center bg-white/[0.02] p-12 lg:p-16 rounded-3xl border border-white/5">
                        <div className="flex flex-col gap-8">
                            <h2 className="text-4xl font-extrabold tracking-tight italic">Corporate <br /><span className="text-primary not-italic">Hardening Protocols.</span></h2>
                            <p className="text-lg text-text-secondary leading-relaxed font-medium">
                                Proactive defense layers reduce breach success by 94%. Follow our CSIRT-validated protocols
                                to protect internal assets and client identity data.
                            </p>
                            <div className="flex items-center gap-6 p-6 glass-card rounded-2xl bg-primary/5 border-primary/20">
                                <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-symbols-outlined text-3xl">verified</span>
                                </div>
                                <p className="text-sm font-bold text-white tracking-wide uppercase italic">Cyber Infrastructure Compliance: Level 4 Active</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { item: 'Multi-Factor Handshake', sub: 'Mandatory hardware tokens for all administrator and root-level access points.' },
                                { item: 'End-to-End Encryption', sub: 'AES-256 standards for all data at rest and in transit across internal subnets.' },
                                { item: 'Segmented Architecture', sub: 'Network micro-segmentation to limit lateral movement and contain breach segments.' },
                                { item: 'Automated Audit Logs', sub: 'Real-time telemetry tracking and immutable log preservation for forensic integrity.' }
                            ].map((p, i) => (
                                <div key={i} className="flex gap-6 p-6 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                                    <div className="size-6 bg-primary/10 rounded border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                                        <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white tracking-tight">{p.item}</h4>
                                        <p className="text-xs text-text-muted mt-2 font-medium leading-relaxed">{p.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Resources;
