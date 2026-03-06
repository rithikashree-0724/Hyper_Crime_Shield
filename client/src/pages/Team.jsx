import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Team = () => {
    const members = [
        { name: 'Dr. Sarah Vance', role: 'Chief Cyber Architect', exp: '15+ Years Defense' },
        { name: 'Marcus Steel', role: 'Lead Investigator', exp: 'Ex-Federal Forensic' },
        { name: 'Elena Ray', role: 'Neural Security Expert', exp: 'AI System Lead' },
        { name: 'David Chen', role: 'Global Compliance Head', exp: 'Policy Advisor' }
    ];

    return (
        <div className="min-h-screen bg-background text-text-primary">
            <Header />
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    <section className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-violet/10 border border-accent-violet/20 rounded-full">
                            <span className="size-2 rounded-full bg-accent-violet animate-pulse" />
                            <span className="text-[10px] font-black text-accent-violet uppercase tracking-[0.2em]">Our Experts</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight">Our Team</h1>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            The Hyper Crime Shield platform is developed by a team dedicated to improving cyber security awareness and providing effective solutions for cybercrime reporting.
                        </p>
                    </section>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-white">Multidisciplinary Excellence</h3>
                            <p className="text-text-secondary leading-relaxed">
                                Our team consists of developers, system administrators, and cybersecurity enthusiasts who work together to design, develop, and maintain the system.
                            </p>
                            <p className="text-text-secondary leading-relaxed">
                                The development team focuses on building a secure and reliable platform that allows citizens to report cybercrime incidents easily and enables investigators to manage cases efficiently.
                            </p>
                        </div>
                        <div className="glass-card p-10 bg-accent-cyan/5 border-white/5 flex flex-col justify-center">
                            <h3 className="text-xl font-black text-accent-cyan mb-4">Our Vision</h3>
                            <p className="text-text-secondary leading-relaxed italic">
                                "Through innovation and continuous improvement, our team aims to enhance the platform’s capabilities and support safer digital communities."
                            </p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { role: 'Core Development', focus: 'Secure Architecture' },
                            { role: 'System Admin', focus: 'Platform Integrity' },
                            { role: 'Security Research', focus: 'Threat Analysis' },
                            { role: 'UX/UI Design', focus: 'Accessibility' }
                        ].map((m, i) => (
                            <div key={i} className="glass-card p-8 space-y-4 border-white/5 text-center group hover:bg-white/5 transition-all">
                                <div className="size-12 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-violet mx-auto opacity-20 group-hover:opacity-100 transition-opacity" />
                                <h4 className="font-black text-lg">{m.role}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{m.focus}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Team;
