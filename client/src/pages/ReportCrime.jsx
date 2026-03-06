import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import * as API_SERVICE from '../api';

const ReportCrime = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Information Security Breach',
        severity: 'medium',
        location: ''
    });
    const [files, setFiles] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            // Handle file uploads
            if (files) Array.from(files).forEach(file => data.append('evidence', file));

            await API_SERVICE.createReport(data);
            alert('Report successfully submitted.');
            navigate('/dashboard');
        } catch (err) {
            console.error('API Error', err);
            alert('Submission Error: ' + (err.response?.data?.message || 'Connection lost.'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-primary font-body pb-24">
            <Header />

            <main className="max-w-3xl mx-auto px-6 pt-[160px] animate-fade-in">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="h-px w-10 bg-primary/40"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Secure Reporting Form</span>
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight">Report a Crime</h2>
                        <p className="text-text-secondary font-medium mt-1">Please provide details about the incident so we can help.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Subject / Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="bg-primary/5 border border-border rounded-xl px-5 py-4 text-text-primary font-bold focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-text-muted"
                                placeholder="e.g., Online Banking Fraud"
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Crime Category</label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full bg-primary/5 border border-border rounded-xl px-5 py-4 text-text-primary font-bold appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all cursor-pointer"
                                    >
                                        <option value="Financial Fraud">Financial Fraud</option>
                                        <option value="Identity Theft">Identity Theft</option>
                                        <option value="Cyber Bullying">Cyber Bullying</option>
                                        <option value="Phishing Attack">Phishing Attack</option>
                                        <option value="Malware / Virus">Malware / Virus</option>
                                        <option value="Data Breach">Data Breach</option>
                                        <option value="Social Media Crime">Social Media Crime</option>
                                        <option value="Other Cyber Crime">Other Cyber Crime</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">expand_more</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Severity Level</label>
                                <div className="relative">
                                    <select
                                        name="severity"
                                        value={formData.severity}
                                        onChange={handleChange}
                                        className="w-full bg-primary/5 border border-border rounded-xl px-5 py-4 text-text-primary font-bold appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all cursor-pointer"
                                    >
                                        <option value="low">Low - Minor Issue</option>
                                        <option value="medium">Medium - Important</option>
                                        <option value="high">High - Action Needed</option>
                                        <option value="critical">Critical - Emergency</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">warning</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                className="bg-primary/5 border border-border rounded-2xl px-5 py-5 text-text-primary font-medium focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-text-muted resize-none leading-relaxed"
                                placeholder="Describe exactly what happened. Include any relevant details..."
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-4 pt-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Incident Time</label>
                                    <input
                                        type="datetime-local"
                                        name="incidentDate"
                                        onChange={handleChange}
                                        className="bg-primary/5 border border-border rounded-xl px-5 py-4 text-text-primary font-bold focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-text-muted text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Suspects (Optional)</label>
                                    <input
                                        name="suspects"
                                        onChange={handleChange}
                                        className="bg-primary/5 border border-border rounded-xl px-5 py-4 text-text-primary font-bold focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-text-muted"
                                        placeholder="Names or descriptions..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="isAnonymous"
                                        onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                        className="w-5 h-5 rounded border-border bg-primary/5 text-primary focus:ring-primary/40"
                                    />
                                    <span className="text-xs font-bold uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">Submit Anonymously</span>
                                </label>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Upload Evidence (Optional)</label>
                                <input
                                    type="file"
                                    multiple
                                    name="evidence"
                                    onChange={(e) => setFiles(e.target.files)}
                                    className="bg-primary/5 border border-border rounded-xl px-5 py-4 text-text-primary font-bold focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full h-16 rounded-xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${submitting ? 'bg-primary/50 text-text-muted' : 'bg-primary hover:bg-primary-light text-white shadow-xl shadow-primary/20 hover:scale-[1.01]'}`}
                            >
                                {submitting ? 'Submitting...' : <>
                                    Submit Report
                                    <span className="material-symbols-outlined">verified</span>
                                </>}
                            </button>
                            <p className="text-[9px] text-text-muted font-bold text-center uppercase tracking-[0.2em] italic opacity-60">Please ensure all information is accurate.</p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ReportCrime;
