import React from 'react';

const HowItWorksOriginal = () => {
    const steps = [
        { title: 'Register/Login', desc: 'Securely authenticate your session.', icon: 'how_to_reg' },
        { title: 'Submit Complaint', desc: 'Detail the digital incident precisely.', icon: 'edit_note' },
        { title: 'Upload Evidence', desc: 'Attach logs, files, or screenshots.', icon: 'upload_file' },
        { title: 'Investigation', desc: 'Digital forensic analysis begins.', icon: 'troubleshoot' },
        { title: 'Track Status', desc: 'Live updates on your case resolution.', icon: 'track_changes' }
    ];

    return (
        <section className="py-12 relative overflow-hidden">
            {/* Thematic background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-accent-violet/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20 reveal">
                    <span className="text-[10px] font-black text-accent-emerald uppercase tracking-[0.5em]">Process</span>
                    <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tighter font-display">How It Works</h2>
                </div>

                <div className="relative">
                    {/* Visual Connector Line */}
                    <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 text-center">
                        {steps.map((step, i) => (
                            <div key={i} className={`group flex flex-col items-center reveal stagger-${i + 1}`}>
                                <div className="size-24 rounded-[32px] glass-card flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 group-hover:bg-accent-blue/10 group-hover:border-accent-blue/50 transition-all duration-500">
                                    <span className="material-symbols-outlined text-4xl text-text-primary group-hover:text-accent-emerald transition-colors">
                                        {step.icon}
                                    </span>

                                    {/* Animated Step Number */}
                                    <div className={`absolute -top-3 -right-3 size-10 rounded-2xl font-black flex items-center justify-center text-xs shadow-lg transition-transform duration-500 group-hover:-translate-y-2 ${i % 3 === 0 ? 'bg-accent-cyan text-slate-950 shadow-accent-cyan/40' :
                                        i % 3 === 1 ? 'bg-accent-violet text-white shadow-accent-violet/40' :
                                            'bg-accent-emerald text-slate-950 shadow-accent-emerald/40'
                                        }`}>
                                        0{i + 1}
                                    </div>

                                    {/* Glow effect on hover */}
                                    <div className="absolute inset-0 rounded-[32px] bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                                </div>
                                <h3 className="text-xl font-black mb-3 tracking-tight group-hover:text-primary transition-colors">{step.title}</h3>
                                <p className="text-text-secondary text-sm font-medium leading-relaxed max-w-[200px]">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksOriginal;
