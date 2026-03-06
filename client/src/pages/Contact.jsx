import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
    return (
        <div className="min-h-screen bg-background text-text-primary">
            <Header />
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-16">
                    <section className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-cyan/10 border border-accent-cyan/20 rounded-full shadow-[0_0_20px_rgba(0,245,255,0.1)]">
                            <span className="size-2 rounded-full bg-accent-cyan animate-pulse" />
                            <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.2em]">Support Desk</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight">Contact Us</h1>
                        <p className="text-lg text-text-secondary leading-relaxed font-medium max-w-2xl mx-auto">
                            If you need assistance with reporting cybercrime or using the Hyper Crime Shield platform, please contact our support team.
                        </p>
                    </section>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass-card p-10 space-y-6 border-white/5">
                            <div className="space-y-2">
                                <h3 className="text-xs font-black text-accent-cyan uppercase tracking-widest">Direct Contact</h3>
                                <p className="text-2xl font-black text-white">support@hypercrimeshield.com</p>
                                <p className="text-xl font-bold text-text-secondary">+91 98765 43210</p>
                            </div>
                            <div className="pt-6 border-t border-white/5 space-y-2">
                                <h3 className="text-xs font-black text-text-muted uppercase tracking-widest">Headquarters</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    Cyber Security Support Center,<br />
                                    Chennai, Tamil Nadu, India
                                </p>
                            </div>
                        </div>

                        <div className="glass-card p-10 space-y-6 border-primary/20 bg-primary/5">
                            <div className="flex items-center gap-3 text-primary mb-4">
                                <span className="material-symbols-outlined text-3xl">emergency</span>
                                <h3 className="text-xl font-black uppercase tracking-tight">Emergency Helpline</h3>
                            </div>
                            <p className="text-text-secondary leading-relaxed font-medium">
                                For urgent cybercrime complaints, you may also contact the National Cyber Crime Helpline:
                            </p>
                            <div className="text-4xl font-black text-primary py-4 border-y border-primary/10 text-center">
                                1930
                            </div>
                            <p className="text-xs text-text-muted italic">
                                Our support team is available to guide users through complaint submission, account management, and investigation tracking.
                            </p>
                        </div>
                    </div>

                    <div className="text-center p-10 glass-card border-white/5">
                        <p className="text-text-secondary font-medium italic">
                            "We aim to respond to all queries as quickly as possible and ensure that citizens receive proper assistance."
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
