import React, { useState } from 'react';
import Header from '../components/Header';

const Resources = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const resources = [
        {
            title: 'Phishing & Social Engineering',
            shortDesc: 'Techniques used to trick you into giving up passwords or money.',
            fullDesc: 'Phishing attacks attempt to steal sensitive information by masquerading as trustworthy entities. Common tactics include fake emails, texts, or calls claiming to be from banks, government agencies, or companies. Always verify sender identity, never click suspicious links, and report phishing attempts. Enable two-factor authentication on all accounts and educate yourself about common social engineering tactics like urgency manipulation and authority impersonation.',
            icon: 'psychology'
        },
        {
            title: 'Advanced Persistent Threats (APT)',
            shortDesc: 'Long-term targeted attacks designed to steal data over extended periods.',
            fullDesc: 'APTs are sophisticated, sustained cyberattacks where hackers gain unauthorized access to a network and remain undetected for months or years. These attacks target high-value organizations to steal intellectual property, financial data, or sensitive information. Protection requires multi-layered security: regular security audits, network segmentation, intrusion detection systems, employee training, and incident response plans. Keep all systems updated and monitor for unusual network activity.',
            icon: 'security_update_warning'
        },
        {
            title: 'Business Email Compromise (BEC)',
            shortDesc: 'Sophisticated scams targeting businesses through fake executive emails.',
            fullDesc: 'BEC attacks involve criminals impersonating executives or business partners to trick employees into transferring money or sharing confidential information. Attackers research targets thoroughly, creating convincing fake emails. Defend against BEC by implementing email authentication protocols (SPF, DKIM, DMARC), verifying all financial requests through secondary channels, training staff to recognize suspicious communications, and establishing clear approval processes for financial transactions.',
            icon: 'mail_lock'
        },
        {
            title: 'Distributed Denial of Service (DDoS)',
            shortDesc: 'Overwhelming attacks that make websites and services unavailable.',
            fullDesc: 'DDoS attacks flood targets with massive traffic from multiple sources, rendering services inaccessible to legitimate users. Attackers use botnets (networks of compromised devices) to amplify their impact. Mitigation strategies include using DDoS protection services, implementing rate limiting, having redundant infrastructure, maintaining excess bandwidth capacity, and creating incident response protocols. Cloud-based services often provide built-in DDoS protection.',
            icon: 'speed'
        },
        {
            title: 'Zero-Day Exploits',
            shortDesc: 'Attacks targeting unknown software vulnerabilities before fixes are available.',
            fullDesc: 'Zero-day vulnerabilities are security flaws unknown to vendors, giving attackers a window to exploit systems before patches exist. These are particularly dangerous and often used in targeted attacks. Protection requires defense-in-depth strategies: keeping software updated, using advanced threat detection, implementing application whitelisting, network segmentation, and maintaining regular backups. Security awareness training helps staff recognize unusual system behavior that might indicate exploitation.',
            icon: 'terminal'
        },
        {
            title: 'Ransomware Protection',
            shortDesc: 'Malware that encrypts your data and demands payment for recovery.',
            fullDesc: 'Ransomware encrypts files and systems, demanding cryptocurrency payments for decryption keys. Prevention is critical as paying ransoms doesn\'t guarantee data recovery. Best practices: maintain offline backups (3-2-1 rule), use reputable security software, restrict user privileges, implement email filtering, educate users about dangerous attachments, segment networks, and create disaster recovery plans. Regular security updates and patches are essential.',
            icon: 'lock'
        }
    ];

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-body">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-16">
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
                            <div key={i} className="glass-card p-10 rounded-2xl border-white/5 group hover:bg-white/[0.05] transition-all">
                                <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl font-bold">{resource.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-4 tracking-tight">{resource.title}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed font-medium mb-6">
                                    {expandedIndex === i ? resource.fullDesc : resource.shortDesc}
                                </p>
                                <button
                                    onClick={() => toggleExpand(i)}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-2"
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
                                    <a href="tel:+919876543210" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined">call</span>
                                        Emergency Hotline
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Best Practices & Warning Signs */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass-card p-10 rounded-2xl border-white/5">
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

                        <div className="glass-card p-10 rounded-2xl border-white/5">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-3xl text-amber-500">report</span>
                                Warning Signs
                            </h3>
                            <ul className="flex flex-col gap-4 text-text-secondary">
                                <li className="flex gap-3"><span className="text-red-500">•</span> Unexpected emails requesting personal information</li>
                                <li className="flex gap-3"><span className="text-red-500">•</span> Unsolicited calls from "tech support"</li>
                                <li className="flex gap-3"><span className="text-red-500">•</span> Links or attachments from unknown senders</li>
                                <li className="flex gap-3"><span className="text-red-500">•</span> Urgent requests for money or credentials</li>
                                <li className="flex gap-3"><span className="text-red-500">•</span> Unusual account activity or unauthorized access</li>
                                <li className="flex gap-3"><span className="text-red-500">•</span> Websites with spelling errors or poor design</li>
                            </ul>
                        </div>
                    </div>

                    {/* FAQ & Guidelines Section */}
                    <div className="glass-card p-12 rounded-3xl border-white/5">
                        <div className="text-center mb-12">
                            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit mx-auto mb-4">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest text-center">Help Center</span>
                            </div>
                            <h2 className="text-3xl font-extrabold mb-4">Frequently Asked Questions</h2>
                            <p className="text-text-secondary">Common questions about using the Hyper Crime Shield System.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-white">How do I submit a report?</h3>
                                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                    Navigate to the "Report Crime" page, fill out the details about the incident, attach any evidence, and click submit. You can track its status in your dashboard.
                                </p>

                                <h3 className="text-lg font-bold mb-2 text-white">Is my identity kept anonymous?</h3>
                                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                    We prioritize your privacy. Your personal details are shared only with assigned investigators. We also offer an "anonymous reporting" feature for sensitive cases.
                                </p>

                                <h3 className="text-lg font-bold mb-2 text-white">What type of evidence should I upload?</h3>
                                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                    Screenshots of chats/emails, transaction receipts, headers of suspicious emails, and any logs are helpful. Ensure files are clear and relevant.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2 text-white">How long does an investigation take?</h3>
                                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                    Timelines vary based on complexity. Simple cases may be resolved in days, while complex networks can take weeks. You will receive real-time updates on your dashboard.
                                </p>

                                <h3 className="text-lg font-bold mb-2 text-white">Can I withdraw a complaint?</h3>
                                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                    Yes, you can request to close a case from your dashboard if the issue is resolved or you no longer wish to pursue it.
                                </p>

                                <h3 className="text-lg font-bold mb-2 text-white">Who are the investigators?</h3>
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
