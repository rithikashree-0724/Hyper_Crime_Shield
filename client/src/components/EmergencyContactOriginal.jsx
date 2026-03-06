import React from 'react';

const EmergencyContactOriginal = () => {
    return (
        <section className="py-12 relative overflow-hidden bg-background">
            <div className="absolute top-0 left-1/2 w-[60%] h-[100%] bg-red-500/5 blur-[150px] -translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="glass-card p-12 md:p-16 rounded-[60px] border-red-500/10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="text-center lg:text-left">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em]">Emergency Response</span>
                        <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6 tracking-tighter">Need Immediate Assistance?</h2>
                        <p className="text-lg text-text-secondary font-medium max-w-xl">If you are facing active extortion or a critical digital breach, reach our 24/7 dedicated cyber helpline.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <a href="tel:1930" className="h-24 px-12 rounded-3xl bg-red-600 text-white flex items-center gap-6 hover:scale-[1.05] transition-all shadow-[0_20px_40px_-10px_rgba(220,38,38,0.4)]">
                            <span className="material-symbols-outlined text-5xl font-black">call</span>
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none">Cyber Helpline</p>
                                <p className="text-4xl font-black tracking-tighter">1930</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmergencyContactOriginal;
