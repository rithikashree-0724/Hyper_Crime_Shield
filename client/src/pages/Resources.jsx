import React, { useState } from 'react';
import Header from '../components/Header';

const Resources = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const resources = [
        {
            title: 'Protecting Your Digital Identity',
            shortDesc: 'Basic hygiene for keeping your personal data safe online.',
            fullDesc: 'Use unique, complex passwords for every account and enable Multi-Factor Authentication (MFA) whenever possible. Avoid oversharing personal information on social media, such as your full birthday, home address, or phone number. Regularly audit your privacy settings on all platforms and be cautious of unsolicited requests for your personal or financial data.',
            icon: 'shield_person'
        },
        {
            title: 'Spotting Advanced Phishing',
            shortDesc: 'How to recognize modern, sophisticated email and SMS scams.',
            fullDesc: 'Modern phishing (vishing, smishing, spearfishing) often uses high-pressure tactics or impersonates trusted authority figures. Always check the reply-to address, look for subtle misspellings in domain names, and never click links in unexpected emails. Instead, go directly to the official website by typing the address in your browser. Be wary of messages claiming your account is locked or requiring urgent PAN/Aadhaar updates.',
            icon: 'alternate_email'
        },
        {
            title: 'Safe Online Banking',
            shortDesc: 'Essential tips for secure transactions and digital wallet safety.',
            fullDesc: 'Never conduct banking or financial transactions over public Wi-Fi. Use your bank\'s official mobile app instead of a web browser on public networks. Set up transaction alerts on your credit cards and bank accounts to catch unauthorized charges immediately. Be cautious of "screen-sharing" requests from individuals claiming to be technical support—reputable banks will never ask you to install such software.',
            icon: 'account_balance'
        },
        {
            title: 'Social Media Security',
            shortDesc: 'Preventing account takeovers and protecting your social footprint.',
            fullDesc: 'Be careful with third-party apps that ask for access to your social media profiles. Scammers often use "quizzes" or "games" to gather data used for security questions. Use the "Login Alerts" feature to get notified if your account is accessed from a new device. Be skeptical of friends sending unusual requests for money or urgent help—their account might be compromised. Verify the request through a different communication channel.',
            icon: 'share'
        },
        {
            title: 'Device & Software Hygiene',
            shortDesc: 'Keeping your hardware and software protected from vulnerabilities.',
            fullDesc: 'Keep your operating system, browser, and all applications updated to ensure you have the latest security patches. Use reputable anti-virus software and perform regular full-system scans. Download software only from official sources or verified app stores. Be careful with USB drives or other external hardware from unknown origins, as they can contain hidden malware or hardware exploits.',
            icon: 'devices'
        },
        {
            title: 'Reporting & Response',
            shortDesc: 'What to do if you suspect you\'ve been a victim of cybercrime.',
            fullDesc: 'If you suspect fraud, immediately change your passwords and notify your bank to freeze involved accounts. Take screenshots of all communications, transaction logs, and suspicious emails as evidence. File a formal complaint through the Hyper Crime Shield dashboard as soon as possible. Reporting quickly increases the chances of freezing stolen funds and helps authorities track down the perpetrators.',
            icon: 'report'
        }
    ];

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-background text-text-primary font-body">
            <Header />

            <main className="max-w-7xl mx-auto px-6 pt-[160px] pb-16">
                <div className="flex flex-col gap-16">
                    {/* Header Section */}
                    <div className="flex flex-col gap-6 text-center max-w-3xl mx-auto items-center">
                        <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest text-center">Cybersecurity Resources</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Stay Safe Online</h1>
                        <p className="text-lg text-text-secondary leading-relaxed font-medium capitalize">
                            Comprehensive guides to protect yourself from cyber threats and fraud.
                        </p>
                    </div>

                    {/* Threat Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {resources.map((resource, i) => (
                            <div key={i} className="glass-card p-10 rounded-2xl group hover:bg-primary/5 transition-all">
                                <div className="size-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl font-bold">{resource.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 tracking-tight">{resource.title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed font-medium mb-6">
                                    {expandedIndex === i ? resource.fullDesc : resource.shortDesc}
                                </p>
                                <button
                                    onClick={() => toggleExpand(i)}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-text-primary transition-colors flex items-center gap-2"
                                >
                                    {expandedIndex === i ? 'Show Less' : 'Read More'}
                                    <span className="material-symbols-outlined text-sm">
                                        {expandedIndex === i ? 'expand_less' : 'arrow_forward'}
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Emergency Alert Section */}
                    <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl p-12">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="size-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-4xl text-red-500">warning</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-3">Experienced a Cyber Crime?</h3>
                                <p className="text-text-secondary mb-6">
                                    Time is critical in cybercrime cases. Report immediately to improve chances of recovery and prevent further damage.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <a href="/report-crime" className="btn-primary">Report Now</a>
                                    <a href="tel:+919876543210" className="px-6 py-3 rounded-xl bg-primary/5 border border-primary/10 text-sm font-bold uppercase tracking-widest hover:bg-primary/10 transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined">call</span>
                                        Emergency Hotline
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Best Practices & Warning Signs */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass-card p-10 rounded-2xl">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-3xl text-green-500">verified_user</span>
                                Security Best Practices
                            </h3>
                            <ul className="flex flex-col gap-4 text-text-secondary">
                                <li className="flex gap-3"><span className="text-primary">•</span> Use strong, unique passwords for each account</li>
                                <li className="flex gap-3"><span className="text-primary">•</span> Enable two-factor authentication everywhere possible</li>
                                <li className="flex gap-3"><span className="text-primary">•</span> Keep all software and systems up to date</li>
                                <li className="flex gap-3"><span className="text-primary">•</span> Regularly backup important data</li>
                                <li className="flex gap-3"><span className="text-primary">•</span> Be cautious with email attachments and links</li>
                                <li className="flex gap-3"><span className="text-primary">•</span> Use VPN on public Wi-Fi networks</li>
                            </ul>
                        </div>

                        <div className="glass-card p-10 rounded-2xl">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-3xl text-amber-500">report</span>
                                Warning Signs
                            </h3>
                            <ul className="flex flex-col gap-4 text-text-secondary">
                                <li className="flex gap-3"><span className="text-red-500">•</span> Unexpected emails requesting personal information</li>
                                <li className="flex gap-3"><span className="text-red-500">•</span> Unsolicited calls from \"tech support\"</li>
                                <li className="flex gap-3"><span className="text-red-500">•</span> Links or attachments from unknown senders</li>
                                <li className="flex gap-3"><span className="text-red-500">•</span> Urgent requests for money or credentials</li>
                                <li className="flex gap-3"><span className="text-red-500">•</span> Unusual account activity or unauthorized access</li>
                                <li className="flex gap-3"><span className="text-red-500">•</span> Websites with spelling errors or poor design</li>
                            </ul>
                        </div>
                    </div>

                    {/* FAQ & Guidelines Section */}
                    <div className="glass-card p-12 rounded-3xl">
                        <div className="text-center mb-12">
                            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit mx-auto mb-4">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest text-center">Help Center</span>
                            </div>
                            <h2 className="text-3xl font-extrabold mb-4">Frequently Asked Questions</h2>
                            <p className="text-text-secondary">Common questions about using the Hyper Crime Shield System.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                            <div>
                                <h3 className="text-lg font-bold mb-2">How do I submit a report?</h3>
                                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                    Navigate to the \"Report Crime\" page, fill out the details about the incident, attach any evidence, and click submit. You can track its status in your dashboard.
                                </p>

                                <h3 className="text-lg font-bold mb-2">Is my identity kept anonymous?</h3>
                                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                    We prioritize your privacy. Your personal details are shared only with assigned investigators. We also offer an \"anonymous reporting\" feature for sensitive cases.
                                </p>

                                <h3 className="text-lg font-bold mb-2">What type of evidence should I upload?</h3>
                                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                    Screenshots of chats/emails, transaction receipts, headers of suspicious emails, and any logs are helpful. Ensure files are clear and relevant.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">How long does an investigation take?</h3>
                                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                    Timelines vary based on complexity. Simple cases may be resolved in days, while complex networks can take weeks. You will receive real-time updates on your dashboard.
                                </p>

                                <h3 className="text-lg font-bold mb-2">Can I withdraw a complaint?</h3>
                                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                    Yes, you can request to close a case from your dashboard if the issue is resolved or you no longer wish to pursue it.
                                </p>

                                <h3 className="text-lg font-bold mb-2">Who are the investigators?</h3>
                                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                    Our investigators are certified cybersecurity professionals and law enforcement officers vetted through a strict KYC process.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Resources;
