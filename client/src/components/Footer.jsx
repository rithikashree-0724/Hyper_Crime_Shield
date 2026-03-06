import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
    const links = {
        Platform: [
            { label: 'Home', path: '/' },
            { label: 'Report Complaint', path: '/report-crime' },
            { label: 'Track Complaint', path: '/dashboard' },
            { label: 'Shield Alerts', path: '/alerts' }
        ],
        Company: [
            { label: 'About Us', path: '/about' },
            { label: 'Contact', path: '/contact' },
            { label: 'Team', path: '/team' }
        ],
        Legal: [
            { label: 'Privacy Policy', path: '/privacy' },
            { label: 'Terms and Conditions', path: '/terms' }
        ]
    };

    return (
        <footer className="relative bg-background pt-24 pb-12 overflow-hidden border-t border-white/5">
            {/* Background elements to match original UI */}
            <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-accent-cyan/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20">
                    <div className="space-y-8">
                        <Logo />
                        <p className="text-text-secondary text-sm font-medium leading-[1.8] max-w-[280px]">
                            Protecting Citizens from Cyber Crime through advanced technology and investigative excellence.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { name: 'facebook', icon: 'fa-brands fa-facebook-f' },
                                { name: 'twitter', icon: 'fa-brands fa-x-twitter' },
                                { name: 'linkedin', icon: 'fa-brands fa-linkedin-in' },
                                { name: 'instagram', icon: 'fa-brands fa-instagram' }
                            ].map(s => (
                                <a key={s.name} href="#" className="size-9 rounded-xl glass-card flex items-center justify-center hover:bg-accent-cyan hover:text-slate-950 transition-all text-text-secondary border border-white/5 active:scale-90">
                                    <i className={s.icon}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {Object.entries(links).map(([title, items]) => (
                        <div key={title} className="flex flex-col">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] mb-10 text-accent-cyan p-0">{title}</h4>
                            <ul className="flex flex-col gap-5">
                                {items.map(item => (
                                    <li key={item.label} className="p-0">
                                        <Link to={item.path} className="text-text-secondary hover:text-accent-cyan text-sm font-bold transition-all hover:translate-x-1 inline-block">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-text-muted text-xs font-bold uppercase tracking-widest">
                        © 2026 Hyper Crime Shield System. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full glass-card">
                        <span className="size-2 rounded-full bg-accent-emerald animate-pulse shadow-[0_0_10px_#10b981]" />
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                            Systems Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
