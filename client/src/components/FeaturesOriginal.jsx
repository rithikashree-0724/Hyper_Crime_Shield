import React from 'react';

const FeaturesOriginal = () => {
    const features = [
        { title: 'Secure Registration', desc: 'Top-tier ID encryption for all users.', icon: 'security' },
        { title: 'Evidence Vault', desc: 'Military-grade storage for digital evidence.', icon: 'inventory_2' },
        { title: 'Live Tracking', desc: 'Instant updates on case progression.', icon: 'query_stats' },
        { title: 'Authority Link', desc: 'Direct connection to certified investigators.', icon: 'forum' },
        { title: 'Anonymous Mode', desc: 'Report without compromising your safety.', icon: 'visibility_off' },
        { title: 'Data Security', desc: 'End-to-end encryption for all sessions.', icon: 'data_object' }
    ];

    return (
        <section className="bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <span className="text-[10px] font-black text-accent-violet uppercase tracking-[0.6em]">Capabilities</span>
                    <h2 className="text-4xl md:text-5xl font-black mt-6 tracking-tight">Key Platform Features</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 sm:gap-20">
                    {features.map((f, i) => (
                        <div key={i} className="flex gap-6 group hover:translate-y-[-5px] transition-transform duration-300">
                            <div className="size-16 rounded-2xl glass-card flex items-center justify-center text-accent-violet group-hover:bg-accent-violet group-hover:text-white transition-all shrink-0">
                                <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-text-primary mb-2 tracking-tight">{f.title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed font-medium">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesOriginal;
