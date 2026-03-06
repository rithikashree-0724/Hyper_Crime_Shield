import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-background text-text-primary">
            <Header />
            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-16">
                    <section className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-cyan/10 border border-accent-cyan/20 rounded-full shadow-[0_0_20px_rgba(0,245,255,0.1)]">
                            <span className="size-2 rounded-full bg-accent-cyan animate-pulse" />
                            <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.2em]">Our Platform</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight">
                            About <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-violet">Hyper Crime Shield</span>
                        </h1>
                        <p className="text-lg text-text-secondary leading-relaxed font-medium max-w-2xl mx-auto">
                            Hyper Crime Shield is a cybercrime complaint management platform designed to help citizens report digital crimes quickly and securely. The system connects citizens with investigators and administrators to ensure proper investigation and resolution of cybercrime cases.
                        </p>
                    </section>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass-card p-10 space-y-4 border-white/5">
                            <h3 className="text-xl font-black text-accent-cyan underline underline-offset-8 decoration-accent-cyan/30">The Challenge</h3>
                            <p className="text-text-secondary leading-relaxed">
                                With the rapid growth of internet usage, cyber threats such as phishing, online fraud, hacking, identity theft, and cyberbullying have become more common. Hyper Crime Shield provides a centralized platform where victims can report incidents, upload evidence, and track the progress of their complaints.
                            </p>
                        </div>
                        <div className="glass-card p-10 space-y-4 border-white/5">
                            <h3 className="text-xl font-black text-accent-violet underline underline-offset-8 decoration-accent-violet/30">The Solution</h3>
                            <p className="text-text-secondary leading-relaxed">
                                The platform also supports investigators with tools for evidence management, case analysis, and investigation tracking. Administrators manage the system, monitor activities, and ensure smooth operation of the platform.
                            </p>
                        </div>
                    </div>

                    <section className="text-center space-y-8 glass-card p-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-emerald opacity-50" />
                        <h2 className="text-3xl font-black tracking-tight">Our Primary Goal</h2>
                        <p className="text-text-secondary leading-relaxed max-w-3xl mx-auto italic font-medium">
                            "Our goal is to improve digital safety, increase cybercrime awareness, and provide efficient cybercrime reporting services for the community."
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default About;
