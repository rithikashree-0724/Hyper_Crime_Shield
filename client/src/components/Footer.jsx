import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
    return (
        <footer className="relative bg-background-dark pt-20 pb-10 px-6 overflow-hidden border-t border-white/5 font-body">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-6">
                        <Logo />
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Empowering citizens and law enforcement to collaborate for a safer community through secure and transparent reporting.
                        </p>
                        <div className="flex gap-3 mt-2">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-blue-600/10 text-blue-500 border border-blue-600/20 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                <span className="material-symbols-outlined">facebook</span>
                            </a>
                            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all">
                                <span className="material-symbols-outlined">chat</span>
                            </a>
                            <a href="#" className="size-10 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all">
                                <span className="material-symbols-outlined">share</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="/" className="text-sm text-slate-400 hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/report-crime" className="text-sm text-slate-400 hover:text-primary transition-colors">Report Crime</Link></li>
                            <li><Link to="/how-it-works" className="text-sm text-slate-400 hover:text-primary transition-colors">How It Works</Link></li>
                            <li><Link to="/resources" className="text-sm text-slate-400 hover:text-primary transition-colors">Resources</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">Legal & Support</h4>
                        <ul className="flex flex-col gap-3">
                            {['Privacy Policy', 'Terms of Service', 'Support Center', 'Accessibility'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-slate-400 hover:text-primary transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact Us</h4>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                                <p className="text-sm text-slate-400">Cyber Crime Wing HQ,<br />New Delhi, India 110001</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">phone</span>
                                <p className="text-sm text-slate-400">+91 98765-43210</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">email</span>
                                <p className="text-sm text-slate-400">support@hypershield.net</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500 font-medium text-center md:text-left">
                        © {new Date().getFullYear()} Hyper Crime Shield. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
