import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ReportDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchReport();
    }, [id]);

    const fetchReport = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5001/api/reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Find specific report from list (since getReports returns all for that user/admin)
            const found = res.data.find(r => r.id === parseInt(id) || r.complaintId === id);
            setReport(found);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5001/api/reports/${report.id}/message`, { content: newMessage }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMessage('');
            fetchReport(); // Refresh to show new message
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5001/api/reports/${report.id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchReport();
            alert(`Status updated to ${newStatus}`);
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    const handleEscalate = async () => {
        if (!window.confirm('Are you sure you want to escalate this case? This will notify higher authorities.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5001/api/reports/${report.id}/escalate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchReport();
            alert('Case Escalated!');
        } catch (err) {
            console.error(err);
            alert('Failed to escalate case');
        }
    };

    if (loading) return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white italic">Accessing encrypted archives...</div>;
    if (!report) return <div className="min-h-screen bg-background-dark flex flex-center text-red-500">Error: Record not found.</div>;

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-body pb-20">
            <Header />
            <main className="max-w-6xl mx-auto px-6 pt-12">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white mb-8 transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Dashboard
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Report Info */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="glass-card p-8 rounded-3xl border-white/5 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2 block">Case File: {report.complaintId || report.id}</span>
                                    <h1 className="text-3xl font-black text-white">{report.title}</h1>
                                </div>
                                <div className="px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                                    {report.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div>
                                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Category</p>
                                    <p className="text-sm font-bold text-white uppercase">{report.category}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Severity</p>
                                    <p className={`text-sm font-bold uppercase ${report.severity === 'critical' ? 'text-red-500' : 'text-primary'}`}>{report.severity}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Location</p>
                                    <p className="text-sm font-bold text-white uppercase">{report.location || 'Not Specified'}</p>
                                </div>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">description</span>
                                    Incident Description
                                </h3>
                                <p className="text-slate-300 leading-relaxed bg-black/20 p-6 rounded-2xl border border-white/5 italic">
                                    "{report.description}"
                                </p>
                            </div>

                            {/* Evidence Preview */}
                            {report.evidence && report.evidence.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#94a3b8] mb-4">Attached Evidence</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {report.evidence.map((file, i) => (
                                            <div key={i} onClick={() => window.open(file, '_blank')} className="aspect-square bg-surface-dark rounded-xl border border-white/10 flex items-center justify-center group overflow-hidden relative cursor-pointer">
                                                <span className="material-symbols-outlined text-3xl text-text-muted group-hover:scale-110 transition-transform">article</span>
                                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">View</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Communications / Messaging */}
                        <div className="glass-card p-8 rounded-3xl border-white/5">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">chat</span>
                                Secure Communications
                            </h3>

                            <div className="flex flex-col gap-4 h-[400px] overflow-y-auto mb-6 pr-4 custom-scrollbar">
                                {report.messages && report.messages.length > 0 ? (
                                    report.messages.map((msg, i) => (
                                        <div key={i} className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === user?.id ? 'bg-primary/20 border border-primary/30 self-end ml-auto' : 'bg-surface-dark border border-white/10 self-start'}`}>
                                            <p className="text-xs text-slate-100">{msg.message}</p>
                                            <span className="text-[8px] text-text-muted uppercase mt-2 block tracking-wider">
                                                {new Date(msg.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-text-muted opacity-50">
                                        <span className="material-symbols-outlined text-4xl mb-2">lock_open</span>
                                        <p className="text-xs font-bold uppercase tracking-widest">Channel initialized. No messages yet.</p>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    placeholder="Type your secure message..."
                                    className="w-full bg-surface-dark border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm font-medium"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 size-10 bg-primary rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg">
                                    <span className="material-symbols-outlined text-base">send</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Timeline & Suspects */}
                    <div className="flex flex-col gap-8">
                        {/* Timeline */}
                        <div className="glass-card p-6 rounded-3xl border-white/5">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#94a3b8] mb-6">Case Timeline</h3>
                            <div className="flex flex-col gap-6 relative">
                                <div className="absolute left-1.5 top-0 bottom-0 w-px bg-white/5"></div>
                                {report.timeline && report.timeline.length > 0 ? (
                                    report.timeline.map((event, i) => (
                                        <div key={i} className="flex gap-4 relative z-10">
                                            <div className="size-3 rounded-full bg-primary mt-1 border-4 border-background-dark shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                                            <div>
                                                <p className="text-xs font-black text-white uppercase tracking-tight">{event.status}</p>
                                                <p className="text-[10px] text-text-secondary mt-0.5">{event.note}</p>
                                                <p className="text-[8px] text-text-muted mt-1 uppercase tracking-widest">{new Date(event.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex gap-4 relative z-10">
                                        <div className="size-3 rounded-full bg-primary mt-1 border-4 border-background-dark"></div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-tight">Report Received</p>
                                            <p className="text-[10px] text-text-secondary mt-0.5">Automated logging initiated.</p>
                                            <p className="text-[8px] text-text-muted mt-1 uppercase tracking-widest">{new Date(report.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Suspects Card */}
                        <div className="glass-card p-6 rounded-3xl border-white/5 bg-red-500/[0.02]">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">person_search</span>
                                Identified Suspects
                            </h3>
                            <div className="flex flex-col gap-3">
                                {report.suspects && report.suspects.length > 0 ? (
                                    report.suspects.map((s, i) => (
                                        <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                            <p className="text-xs font-bold text-white uppercase tracking-tighter">{s}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-text-muted italic">No suspects identified yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Investigator Controls */}
                        {(user?.role === 'investigator' || user?.role === 'admin') && (
                            <div className="glass-card p-6 rounded-3xl border-white/5 bg-blue-500/[0.02]">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">gavel</span>
                                    Actions
                                </h3>
                                <div className="flex flex-col gap-3">
                                    <h4 className="text-[10px] font-bold uppercase text-text-muted">Update Status</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => handleStatusUpdate('investigating')} className="px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold uppercase hover:bg-yellow-500/20 transition-colors">Investigating</button>
                                        <button onClick={() => handleStatusUpdate('resolved')} className="px-3 py-2 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold uppercase hover:bg-green-500/20 transition-colors">Resolve Case</button>
                                        <button onClick={() => handleStatusUpdate('closed')} className="px-3 py-2 rounded-lg bg-gray-500/10 text-gray-500 border border-gray-500/20 text-[10px] font-bold uppercase hover:bg-gray-500/20 transition-colors">Close Case</button>
                                    </div>

                                    <div className="h-px bg-white/5 my-2"></div>

                                    <button onClick={handleEscalate} className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase tracking-wider hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-sm">warning</span>
                                        Escalate to Higher Authority
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Support Info */}
                        <div className="p-6 rounded-3xl border border-white/5 bg-surface-dark/40">
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Need Help?</h4>
                            <p className="text-[10px] text-text-secondary leading-relaxed mb-4">You can message your investigator directly using the secure channel on the left.</p>
                            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors">Case FAQ & Guidelines</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportDetails;
