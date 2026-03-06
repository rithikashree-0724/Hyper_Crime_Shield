import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-background text-text-primary">
            <Header />
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto glass-card p-12 space-y-12">
                    <section className="space-y-4">
                        <h1 className="text-4xl font-black font-display tracking-tight text-white">Privacy Policy</h1>
                        <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em]">Hyper Crime Shield Data Protection</p>
                    </section>

                    <div className="space-y-10 text-text-secondary leading-relaxed">
                        <p className="font-medium italic border-l-4 border-accent-cyan pl-6 py-2 bg-accent-cyan/5 rounded-r-xl">
                            Hyper Crime Shield respects the privacy of all users and is committed to protecting personal information shared on the platform.
                        </p>

                        <div className="grid gap-8">
                            <div className="space-y-4 p-8 rounded-3xl bg-white/5 border border-white/5">
                                <h3 className="text-xl font-black text-white flex items-center gap-3">
                                    <span className="material-symbols-outlined text-accent-cyan">database</span>
                                    Information Collection
                                </h3>
                                <p>When users register or submit complaints, certain personal information such as name, contact details, and incident information may be collected. This information is used only for cybercrime investigation and system management purposes.</p>
                            </div>

                            <div className="space-y-4 p-8 rounded-3xl bg-white/5 border border-white/5">
                                <h3 className="text-xl font-black text-white flex items-center gap-3">
                                    <span className="material-symbols-outlined text-accent-violet">security</span>
                                    Security Measures
                                </h3>
                                <p>We implement strong security measures to protect user data from unauthorized access, misuse, or disclosure. All information submitted on the platform is handled with strict confidentiality.</p>
                            </div>

                            <div className="space-y-4 p-8 rounded-3xl bg-white/5 border border-white/5">
                                <h3 className="text-xl font-black text-white flex items-center gap-3">
                                    <span className="material-symbols-outlined text-accent-emerald">share_off</span>
                                    Data Sharing
                                </h3>
                                <p>User data will not be shared with third parties except when required for investigation purposes or when requested by authorized law enforcement authorities.</p>
                            </div>
                        </div>

                        <p className="text-sm font-bold text-center pt-8 border-t border-white/5">
                            By using the Hyper Crime Shield platform, users agree to the collection and use of information according to this privacy policy.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Privacy;
