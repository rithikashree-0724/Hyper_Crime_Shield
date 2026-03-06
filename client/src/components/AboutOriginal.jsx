import React from 'react';

const AboutOriginal = () => {
    return (
        <section className="relative overflow-hidden bg-background">
            <div className="absolute top-0 left-0 w-[40%] h-[100%] bg-accent-violet/5 blur-[140px] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <div className="relative group">
                        <div className="glass-card p-6 rounded-[40px] rotate-2 transition-transform duration-700 group-hover:rotate-0">
                            <div className="w-full aspect-video bg-primary/5 rounded-[32px] border border-white/10 flex items-center justify-center p-8 text-center overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-violet/10 opacity-50" />
                                <div className="relative z-10">
                                    <span className="material-symbols-outlined text-7xl text-accent-cyan mb-4 animate-pulse">security</span>
                                    <h3 className="text-2xl font-black text-text-primary mb-2 tracking-tight">Citizen Centric</h3>
                                    <p className="text-text-secondary text-sm font-medium">Empowering the digital community with safe reporting tools.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-violet/10 border border-accent-violet/20 rounded-full w-fit">
                            <span className="text-[10px] font-black text-accent-violet uppercase tracking-[0.2em]">Our Platform</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                            Bridging the <br />
                            <span className="text-accent-emerald leading-[1.3] inline-block mt-2">Security Gap.</span>
                        </h2>
                        <p className="text-xl text-text-secondary leading-relaxed font-medium opacity-90">
                            The Hyper Crime Shield System is a dedicated platform designed to help citizens report cybercrimes with total anonymity and security. We provide a bridge to professional investigators, ensuring cases are solved with technological precision and legal integrity.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutOriginal;
