import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ReportCrime = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Information Security Breach',
        severity: 'medium',
        location: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        console.log("SUBMISSION_START: Initiating TLS handshake for incident report...");

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                console.log("SUBMISSION_SUCCESS: Incident log committed to database segment.");
                alert('Incident successfully submitted to the CSIRT repository.');
                navigate('/dashboard');
            } else {
                const data = await res.json();
                console.error("SUBMISSION_FAILURE: API rejected incident log.", data.message);
                alert('Submission Error: ' + data.message);
            }
        } catch (err) {
            console.error('CONNECTION_ERROR: Network timeout during log transmission.', err);
            alert('Mainframe connection lost. Please check your uplink status.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-body pb-24">
            <Header />

            <main className="max-w-3xl mx-auto px-6 pt-16 animate-fade-in">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="h-px w-10 bg-primary/40"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#22d3ee]">NCS-CSIRT INTAKE_LOG: FORM_V2</span>
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight">Incident Submission</h2>
                        <p className="text-text-secondary font-medium mt-1">Provide detailed forensic data and telemetry for rapid classification and triage.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Incident Title / Case ID (Optional)</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="bg-surface-dark border border-white/10 rounded-xl px-5 py-4 text-white font-bold focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-text-muted"
                                placeholder="e.g., Unauthorized_SQL_Access_Node_4"
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Attack Classification</label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full bg-surface-dark border border-white/10 rounded-xl px-5 py-4 text-white font-bold appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all cursor-pointer"
                                    >
                                        <option value="Information Security Breach">Information Security Breach</option>
                                        <option value="Malicious Code Execution">Malicious Code Execution</option>
                                        <option value="Advanced Phishing / Smishing">Advanced Phishing / Smishing</option>
                                        <option value="Data Exfiltration Event">Data Exfiltration Event</option>
                                        <option value="Infrastructure Denial (DoS)">Infrastructure Denial (DoS)</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">expand_more</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Threat Severity Index</label>
                                <div className="relative">
                                    <select
                                        name="severity"
                                        value={formData.severity}
                                        onChange={handleChange}
                                        className="w-full bg-surface-dark border border-white/10 rounded-xl px-5 py-4 text-white font-bold appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all cursor-pointer"
                                    >
                                        <option value="low">Priority-3 (Managed)</option>
                                        <option value="medium">Priority-2 (Critical Alert)</option>
                                        <option value="high">Priority-1 (Incursion Active)</option>
                                        <option value="critical">Priority-0 (Strategic Failure)</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">warning</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Incident Telemetry & Narrative</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                className="bg-surface-dark border border-white/10 rounded-2xl px-5 py-5 text-white font-medium focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-text-muted resize-none leading-relaxed"
                                placeholder="Describe the vector, targeted systems, and anomalous timestamps. Include suspicious IPs if identified..."
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full h-16 rounded-xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${submitting ? 'bg-surface-accent text-text-muted' : 'bg-primary hover:bg-primary-light text-white shadow-xl shadow-primary/20 hover:scale-[1.01]'}`}
                            >
                                {submitting ? 'Authenticating Submission...' : <>
                                    Commit Incident Log
                                    <span className="material-symbols-outlined">verified</span>
                                </>}
                            </button>
                            <p className="text-[9px] text-text-muted font-bold text-center uppercase tracking-[0.2em] italic opacity-60">Legal Warning: Submission of false forensic data is a violation of cyber-law v4.2.</p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ReportCrime;
