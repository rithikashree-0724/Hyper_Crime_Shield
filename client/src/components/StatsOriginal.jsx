import React, { useState, useEffect } from 'react';

const StatsOriginal = () => {
    const [counts, setCounts] = useState({ resolved: 0, active: 0, users: 0 });

    useEffect(() => {
        const timer = setTimeout(() => {
            setCounts({ resolved: 8900, active: 3550, users: 48000 });
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const stats = [
        { label: 'Cases Resolved', value: counts.resolved, color: 'text-accent-emerald' },
        { label: 'Investigations', value: counts.active, color: 'text-accent-violet' },
        { label: 'Shield Users', value: counts.users, color: 'text-text-primary uppercase' }
    ];

    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-6">
                <div className="glass-card rounded-[60px] p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-violet/10 opacity-30" />

                    <div className="relative z-10 grid sm:grid-cols-3 gap-12 text-center">
                        {stats.map((s, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className={`text-5xl font-black ${s.color} mb-4 tracking-tighter shadow-sm`}>
                                    {s.value > 1000 ? `${(s.value / 1000).toFixed(1)}k+` : s.value}
                                </div>
                                <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] opacity-70">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsOriginal;
