import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Logo from '../components/Logo';

const HowItWorks = () => {
    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-body pb-24">
            <Header />

            <main className="max-w-5xl mx-auto px-6 pt-20">
                {/* Hero section */}
                <div className="text-center mb-24 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-6">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">NIST Incident Response Framework</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-8">The Response Lifecycle</h1>
                    <p className="max-w-2xl mx-auto text-lg text-text-secondary leading-relaxed font-medium">
                        Our standardized workflow ensures forensic integrity and efficient threat mitigation
                        following international cyber-security best practices.
                    </p>
                </div>

                {/* Vertical Timeline */}
                <div className="relative space-y-16 lg:space-y-0">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden lg:block"></div>

                    {[
                        { step: '01', title: 'Incident Identification', desc: 'Secure intake of incident telemetry, system logs, and attacker signatures via TLS-encrypted nodes.', icon: 'search_check' },
                        { step: '02', title: 'Triage & Analysis', desc: 'CSIRT officers perform root-cause analysis and threat classification based on CVE and ATT&CK frameworks.', icon: 'analytics' },
                        { step: '03', title: 'Containment & Eradication', desc: 'Isolation of affected subnets and neutralization of malicious payloads to prevent lateral movement.', icon: 'shield_lock' },
                        { step: '04', title: 'Recovery & Post-Mortem', desc: 'Restoration of services from validated backups and final audit reporting for legal and insurance compliance.', icon: 'history' }
                    ].map((item, i) => (
                        <div key={i} className={`flex flex-col lg:flex-row items-center gap-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                            <div className="flex-1 w-full">
                                <div className={`glass-card p-10 rounded-3xl border-white/5 hover:border-primary/20 transition-all ${i % 2 === 1 ? 'lg:mr-auto text-left' : 'lg:ml-auto text-right'}`}>
                                    <div className={`flex items-center gap-4 mb-4 ${i % 2 === 1 ? 'justify-start' : 'justify-end'}`}>
                                        <span className="text-primary font-mono text-xl">{item.step}</span>
                                        <h3 className="text-2xl font-bold tracking-tight">{item.title}</h3>
                                    </div>
                                    <p className="text-text-secondary leading-relaxed text-sm font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 size-16 rounded-2xl bg-surface-dark border-2 border-primary/20 flex items-center justify-center shrink-0 shadow-lg shadow-primary/10">
                                <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
                            </div>

                            <div className="flex-1 hidden lg:block"></div>
                        </div>
                    ))}
                </div>

                {/* Final Callout */}
                <div className="mt-32 glass-card rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden flex flex-col items-center border-emerald-500/10 bg-emerald-500/[0.02]">
                    <div className="size-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-10">
                        <span className="material-symbols-outlined text-5xl">verified_user</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-6 text-white">Authorized Reporting Only</h2>
                    <p className="max-w-xl text-text-secondary mb-10 font-medium leading-relaxed italic">
                        All submissions are subject to legal verification. Provide accurate telemetry to ensure compliance with digital evidence regulations.
                    </p>
                    <Link to="/report-crime" className="btn-primary h-14 px-10 text-lg">
                        Submit Official Log
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default HowItWorks;
