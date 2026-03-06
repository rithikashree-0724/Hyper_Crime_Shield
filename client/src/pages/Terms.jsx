import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Terms = () => {
    return (
        <div className="min-h-screen bg-background text-text-primary">
            <Header />
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto glass-card p-12 space-y-12 border-white/5">
                    <section className="space-y-2">
                        <h1 className="text-4xl font-black font-display">Terms of Engagement</h1>
                        <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.4em]">Section IV: Operational Standards</p>
                    </section>

                    <div className="space-y-10 text-text-secondary leading-relaxed text-sm">
                        <p className="font-bold text-lg text-white">
                            By accessing and using the Hyper Crime Shield platform, users agree to follow the terms and conditions outlined below.
                        </p>

                        <div className="p-8 bg-white/5 rounded-3xl space-y-4 border border-white/5">
                            <h3 className="text-lg font-black text-accent-cyan flex items-center gap-2">
                                <span className="material-symbols-outlined">verified</span>
                                User Responsibility
                            </h3>
                            <p>The platform is designed for reporting legitimate cybercrime incidents. Users must ensure that the information provided during registration and complaint submission is accurate and truthful.</p>
                        </div>

                        <div className="p-8 bg-white/5 rounded-3xl space-y-4 border border-white/5">
                            <h3 className="text-lg font-black text-accent-violet flex items-center gap-2">
                                <span className="material-symbols-outlined">warning</span>
                                Misuse and Consequences
                            </h3>
                            <p>Any misuse of the platform, including submission of false complaints or inappropriate content, may result in account suspension or legal action.</p>
                        </div>

                        <div className="p-8 bg-white/5 rounded-3xl space-y-4 border border-white/5">
                            <h3 className="text-lg font-black text-accent-emerald flex items-center gap-2">
                                <span className="material-symbols-outlined">policy</span>
                                Account Security
                            </h3>
                            <p>Users are responsible for maintaining the confidentiality of their account credentials. The system administrators reserve the right to monitor platform activities to maintain security and system integrity. Hyper Crime Shield may update these terms and conditions periodically to improve platform services and security.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Terms;
