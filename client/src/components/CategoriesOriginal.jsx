import React from 'react';

const CategoriesOriginal = () => {
    const categories = [
        { title: 'Phishing', desc: 'Securely report fraudulent emails or malicious links.', icon: 'alternate_email', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
        { title: 'Online Fraud', desc: 'Financial scams and digital payment fraud reporting.', icon: 'payments', color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
        { title: 'Identity Theft', desc: 'Unauthorised use of your digital identity or data.', icon: 'badge', color: 'text-accent-emerald', bg: 'bg-accent-emerald/10' },
        { title: 'Cyberbullying', desc: 'Harassment and intimidation on digital platforms.', icon: 'forum', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
        { title: 'Hacking', desc: 'Unauthorized access to your devices or accounts.', icon: 'terminal', color: 'text-red-500', bg: 'bg-red-500/10' },
        { title: 'Social Media Scams', desc: 'Fraud conducted over social networking sites.', icon: 'share', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' }
    ];

    return (
        <section className="py-12 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-[10px] font-black text-accent-emerald uppercase tracking-[0.5em]">Classifications</span>
                    <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 tracking-tighter">Cybercrime Categories</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat, i) => (
                        <div key={i} className="glass-card p-10 rounded-[40px] group hover:scale-[1.02] transition-all relative overflow-hidden">
                            <div className={`size-16 rounded-2xl ${cat.bg} flex items-center justify-center ${cat.color} mb-8 group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined text-4xl">{cat.icon}</span>
                            </div>
                            <h3 className="text-xl font-black mb-3 tracking-tight">{cat.title}</h3>
                            <p className="text-text-secondary text-sm leading-relaxed font-medium">{cat.desc}</p>
                            <div className={`absolute bottom-0 left-0 w-full h-1 ${cat.color.replace('text', 'bg')} opacity-20`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesOriginal;
