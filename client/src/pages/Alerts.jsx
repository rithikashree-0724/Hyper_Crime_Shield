import React, { useState } from 'react';
import Header from '../components/Header';

const Alerts = () => {
    const [selectedAlert, setSelectedAlert] = useState(null);

    const activeAlerts = [
        {
            id: 1,
            title: 'Critical Phishing Campaign: Banking Lockdown',
            severity: 'Critical',
            date: 'March 06, 2026',
            description: 'Massive wave of emails posing as major banks. Do not click links regarding "Unusual Login" or "Account Verification".',
            icon: 'gpp_maybe',
            fullBriefing: {
                summary: 'Hyper-targeted spear phishing targeting active users of commercial banking apps.',
                technicalDetails: 'Attackers are using Punycode-based look-alike domains and compromised high-reputation SMTP servers to bypass spam filters.',
                actions: [
                    'Do not use links from emails to login.',
                    'Check for HTTPS and official domain spelling.',
                    'Enable Hardware-based 2FA if available.'
                ]
            }
        },
        {
            id: 2,
            title: 'Unauthorized API Access Detected',
            severity: 'High',
            date: 'March 05, 2026',
            description: 'Several popular social media platforms report token leaks. Update your 2FA settings immediately.',
            icon: 'database_off',
            fullBriefing: {
                summary: 'Leak of OAuth legacy tokens exposing user profiles and private data.',
                technicalDetails: 'Vulnerability found in older API endpoints allowed for token harvesting without valid session keys.',
                actions: [
                    'Revoke third-party permissions on social accounts.',
                    'Change passwords and reset active sessions.',
                    'Review privacy settings.'
                ]
            }
        },
        {
            id: 3,
            title: 'New Ransomware Variant: "SilverEcho"',
            severity: 'High',
            date: 'March 04, 2026',
            description: 'Targeting small businesses through RDP exploits. Ensure offline backups are up to date.',
            icon: 'lock_open',
            fullBriefing: {
                summary: 'A new strain of ransomware that encrypts backups first before targeting live files.',
                technicalDetails: 'SilverEcho uses a proprietary AES-4096 implementation and disables shadow copies using a zero-day elevation of privilege.',
                actions: [
                    'Ensure offline/disconnected backups exist.',
                    'Disable RDP if not required.',
                    'Patch Windows Server immediately.'
                ]
            }
        }
    ];

    const safetyAdvisories = [
        { title: 'Mandatory Software Updates', detail: 'Update all browser extensions to patch the latest Zero-Day exploit.' },
        { title: 'Social Engineering Warning', detail: 'Official agents will never ask for your OTP or password over the phone.' },
        { title: 'Encrypted Communications', detail: 'Always use VPN when accessing the dashboard from public Wi-Fi networks.' }
    ];

    return (
        <div className="min-h-screen bg-background text-text-primary font-body pb-24">
            <Header />

            <main className="max-w-7xl mx-auto px-6 pt-[160px]">
                <div className="flex flex-col gap-12">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="size-2 rounded-full bg-red-500 animate-ping"></div>
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Live Threat Monitor</span>
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Cyber Shield Alerts</h1>
                            <p className="text-text-secondary mt-2 font-medium">Real-time monitoring of global cyber threats and local safety advisories.</p>
                        </div>
                        <div className="glass-card px-6 py-4 rounded-xl flex items-center gap-4">
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Risk Level</span>
                                <span className="text-xl font-black text-amber-500 uppercase italic">Elevated</span>
                            </div>
                            <div className="size-12 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
                                <span className="material-symbols-outlined text-amber-500 font-bold">warning</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12 mt-4 animate-fade-in">
                        {/* Active Threats List */}
                        <div className="lg:col-span-2 space-y-6">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">sensors</span>
                                Active Direct Threats
                            </h3>
                            {activeAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    onClick={() => setSelectedAlert(alert)}
                                    className="glass-card p-6 rounded-2xl border-l-4 border-l-red-500 hover:translate-x-1 transition-transform cursor-pointer group-card"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                                <span className="material-symbols-outlined text-red-500">{alert.icon}</span>
                                            </div>
                                            <h4 className="font-bold text-lg">{alert.title}</h4>
                                        </div>
                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${alert.severity === 'Critical' ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500'}`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-secondary leading-relaxed mb-4">{alert.description}</p>
                                    <div className="flex items-center justify-between text-[10px] font-bold text-text-muted uppercase tracking-tighter">
                                        <span>Published: {alert.date}</span>
                                        <div className="flex items-center gap-2 text-primary group">
                                            <span>Full Briefing</span>
                                            <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sidebar: Advisories & Stats */}
                        <div className="space-y-8">
                            <div className="glass-card p-8 rounded-2xl">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-cyan-500">verified_user</span>
                                    Safety Advisories
                                </h3>
                                <div className="space-y-6">
                                    {safetyAdvisories.map((adv, i) => (
                                        <div key={i} className="group cursor-help">
                                            <h5 className="text-[10px] font-black text-text-primary uppercase tracking-widest mb-1 group-hover:text-cyan-500 transition-colors">{adv.title}</h5>
                                            <p className="text-xs text-text-secondary leading-relaxed">{adv.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-8 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
                                <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl opacity-10 group-hover:scale-110 transition-transform">support_agent</span>
                                <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                                <p className="text-xs text-text-secondary mb-6 italic">If you have been a victim of any of these threats, report it immediately.</p>
                                <button onClick={(e) => { e.stopPropagation(); window.location.href = '/report-crime' }} className="btn-primary w-full shadow-lg shadow-primary/20">
                                    Emergency Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Briefing Modal */}
            {selectedAlert && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fade-in"
                        onClick={() => setSelectedAlert(null)}
                    ></div>

                    <div className="glass-card max-w-2xl w-full p-8 rounded-[32px] relative z-10 animate-scale-in max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setSelectedAlert(null)}
                            className="absolute top-6 right-6 size-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                <span className="material-symbols-outlined text-red-500 text-3xl">{selectedAlert.icon}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">{selectedAlert.severity} ALERT</span>
                                <h2 className="text-2xl font-black tracking-tight">{selectedAlert.title}</h2>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h5 className="text-[10px] font-black uppercase tracking-[0.15em] text-primary mb-3">Threat Summary</h5>
                                <p className="text-sm text-text-secondary leading-[1.8] font-medium">
                                    {selectedAlert.fullBriefing.summary}
                                </p>
                            </section>

                            <section>
                                <h5 className="text-[10px] font-black uppercase tracking-[0.15em] text-primary mb-3">Technical Intelligence</h5>
                                <div className="p-4 rounded-xl bg-surface/50 border border-white/5 font-mono text-[11px] leading-relaxed text-text-muted">
                                    {selectedAlert.fullBriefing.technicalDetails}
                                </div>
                            </section>

                            <section>
                                <h5 className="text-[10px] font-black uppercase tracking-[0.15em] text-primary mb-3">Recommended Actions</h5>
                                <ul className="space-y-3">
                                    {selectedAlert.fullBriefing.actions.map((action, i) => (
                                        <li key={i} className="flex gap-3 text-sm font-bold text-text-primary">
                                            <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                                            {action}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <button
                                onClick={() => setSelectedAlert(null)}
                                className="w-full btn-primary py-4 rounded-2xl mt-4"
                            >
                                Acknowledge Briefing
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Alerts;
