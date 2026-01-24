import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
    return (
        <footer className="relative bg-background-dark pt-24 pb-12 px-6 overflow-hidden border-t border-white/5">
            {/* Background Mesh Glow */}
            <div className="absolute bottom-0 right-0 w-[40%] h-[60%] bg-accent-violet/5 rounded-full blur-[120px] -z-10 translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute top-0 left-0 w-[30%] h-[40%] bg-accent-cyan/5 rounded-full blur-[100px] -z-10 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="flex flex-col gap-6">
                        <Logo />
                        <p className="text-sm text-text-secondary leading-relaxed font-medium">
                            An independent global coalition dedicated to threat neutralization,
                            digital forensics, and private-node protection across the decentralized grid.
                        </p>
                        <div className="flex gap-4 mt-2">
                            {['facebook', 'twitter', 'linkedin', 'github'].map(icon => (
                                <a key={icon} href="#" className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-primary/40 transition-all group">
                                    <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">share</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Security Infrastructure</h4>
                        <ul className="flex flex-col gap-4">
                            {['Threat Monitoring', 'Vulnerability Audit', 'Incident Response', 'Forensic Analysis'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-sm font-semibold text-text-muted hover:text-primary transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Alliance Node</h4>
                        <ul className="flex flex-col gap-4">
                            {['Member Portal', 'Network Documentation', 'Whitepapers', 'Open API'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-sm font-semibold text-text-muted hover:text-accent-cyan transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Emergency Uplink</h4>
                        <div className="glass-card p-6 rounded-2xl border-accent-cyan/10 bg-accent-cyan/[0.02]">
                            <p className="text-xs font-bold text-text-secondary mb-4 leading-relaxed italic">Direct frequency for active breach containment protocols.</p>
                            <div className="flex flex-col gap-2">
                                <span className="text-lg font-black text-white tracking-widest font-mono">0x_SHIELD_V4</span>
                                <span className="text-[9px] font-bold text-accent-cyan uppercase tracking-widest">Global Ops Command</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Shield</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Protocol Integrity</Link>
                        <Link to="/compliance" className="hover:text-white transition-colors">Legal Segments</Link>
                    </div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">
                        © 2026 Shield Alliance Alliance. Non-Governmental Entity.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
