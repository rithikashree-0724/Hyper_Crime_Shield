import React from 'react';
import { Link } from 'react-router-dom';

const CallToActionOriginal = () => {
    return (
        <section className="py-16 relative overflow-hidden bg-background text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-accent-cyan/10 blur-[150px] pointer-events-none rounded-full" />

            <div className="max-w-4xl mx-auto px-6 relative z-10 animate-fade-in">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8">
                    Report <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-emerald italic">Cyber Crime</span> Now
                </h2>
                <p className="text-xl text-text-secondary mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
                    Don't let criminals compromise your digital safety. Join thousands of protected citizens and take action today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        to="/report-crime"
                        className="h-16 px-12 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-blue text-slate-950 font-black uppercase tracking-widest text-sm shadow-[0_20px_40px_-15px_rgba(0,245,255,0.4)] hover:scale-[1.05] transition-all flex items-center justify-center group"
                    >
                        Report Cyber Crime Now
                        <span className="material-symbols-outlined ml-3 transition-transform group-hover:translate-x-2">send</span>
                    </Link>
                    <Link
                        to="/register"
                        className="h-16 px-10 rounded-2xl glass-card text-text-primary font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center"
                    >
                        Join the Protection Node
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CallToActionOriginal;
