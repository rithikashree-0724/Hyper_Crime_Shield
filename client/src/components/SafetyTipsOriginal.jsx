import React from 'react';

const SafetyTipsOriginal = () => {
    const tips = [
        { title: 'Link Integrity', desc: 'Avoid links from unknown sources claiming urgent action.', icon: 'link_off', color: 'text-accent-cyan' },
        { title: 'Secure Access', desc: 'Maintain complex, rotated passwords for all accounts.', icon: 'password', color: 'text-accent-violet' },
        { title: 'OTP Privacy', desc: 'Never disclose verification codes to third parties.', icon: 'lock_person', color: 'text-accent-emerald' }
    ];

    return (
        <section className="py-12 bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[30%] h-[100%] bg-accent-cyan/5 blur-[120px] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-[10px] font-black text-accent-emerald uppercase tracking-[0.5em]">Awareness</span>
                        <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 tracking-tighter">Cyber Safety Protocols</h2>
                        <p className="text-text-secondary font-medium italic">Practical guidance to fortify your digital perimeter against common threats.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {tips.map((tip, i) => (
                        <div key={i} className="glass-card p-10 rounded-[40px] hover:bg-white/5 transition-all duration-300">
                            <div className={`size-12 rounded-xl bg-surface flex items-center justify-center ${tip.color} mb-8 shadow-inner`}>
                                <span className="material-symbols-outlined">{tip.icon}</span>
                            </div>
                            <h3 className="text-xl font-black text-text-primary mb-4 tracking-tight">{tip.title}</h3>
                            <p className="text-text-secondary text-sm leading-relaxed font-medium">{tip.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SafetyTipsOriginal;
