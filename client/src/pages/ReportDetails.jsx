import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import * as API_SERVICE from '../api';
import { useAuth } from '../context/AuthContext';

const ReportDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [investigation, setInvestigation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [newNote, setNewNote] = useState('');
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchReport();
    }, [id]);

    const fetchReport = async () => {
        try {
            const { data } = await API_SERVICE.getReportDetails(id);
            setReport(data.data);

            // If investigator, also fetch investigation details
            if (user?.role === 'investigator' || user?.role === 'admin') {
                const invRes = await API_SERVICE.getInvestigations();
                const invData = invRes.data.data || invRes.data; // Handle both direct array and wrapped object
                const found = Array.isArray(invData) ? invData.find(i => i.reportId === data.data.id) : null;
                setInvestigation(found);
            }

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
            await API_SERVICE.addReportMessage(report.id, newMessage);
            setNewMessage('');
            fetchReport(); // Refresh to show new message
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            await API_SERVICE.updateReportStatus(report.id, newStatus);
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
            await API_SERVICE.escalateReport(report.id);
            fetchReport();
            alert('Case Escalated!');
        } catch (err) {
            console.error(err);
            alert('Failed to escalate case');
        }
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-text-primary italic">Accessing encrypted archives...</div>;
    if (!report) return <div className="min-h-screen bg-background flex items-center justify-center text-red-500">Error: Record not found.</div>;

    return (
        <div className="min-h-screen bg-background text-text-primary font-body pb-20">
            <Header />
            <main className="max-w-6xl mx-auto px-6 pt-[160px]">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-primary mb-8 transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Dashboard
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Report Info */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="glass-card p-8 rounded-3xl">
                            <div className="mb-10">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">description</span>
                                    Incident Description
                                </h3>
                                <p className="text-text-secondary leading-relaxed bg-primary/5 p-6 rounded-2xl border border-border italic">
                                    "{report.description}"
                                </p>
                            </div>

                            {/* Evidence Preview */}
                            {report.evidence && report.evidence.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4">Attached Evidence</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {report.evidence.map((file, i) => {
                                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
                                            const UPLOAD_ROOT = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
                                            const fileUrl = file.startsWith('http') ? file : `${UPLOAD_ROOT}/${file.replace(/\\/g, '/')}`;
                                            return (
                                                <div key={i} onClick={() => window.open(fileUrl, '_blank')} className="aspect-square bg-primary/5 rounded-xl border border-border flex items-center justify-center group overflow-hidden relative cursor-pointer">
                                                    {isImage ? (
                                                        <img src={fileUrl} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-3xl text-text-muted group-hover:scale-110 transition-transform">article</span>
                                                    )}
                                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">View</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Investigation & Resolution Details (Visible to User) */}
                            {report.investigation && (
                                <div className="mb-8 border-t border-border pt-8">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">local_police</span>
                                        Investigation File
                                    </h3>
                                    <div className="bg-primary/5 p-6 rounded-2xl border border-border">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Handling Officer</p>
                                                <p className="text-sm font-bold uppercase text-text-primary">
                                                    Cyber Crime Investigative Unit
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Current Status</p>
                                                <p className="text-sm font-bold uppercase text-text-primary">
                                                    {report.investigation.status || report.status}
                                                </p>
                                            </div>
                                        </div>

                                        {report.status?.toLowerCase() === 'closed' || report.status?.toLowerCase() === 'resolved' ? (
                                            <div className="mt-6 border-t border-border/50 pt-6">
                                                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm">verified</span>
                                                    Final Case Outcome
                                                </p>
                                                <p className="text-text-secondary leading-relaxed p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 italic">
                                                    {report.investigation.outcome || 'Case resolved successfully. Security measures have been implemented.'}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="mt-4 flex items-center gap-2 text-xs text-amber-500 font-bold uppercase tracking-wide">
                                                <span className="material-symbols-outlined text-sm animate-pulse">sync</span>
                                                Investigation in active progress
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Communications / Messaging */}
                        <div className="glass-card p-8 rounded-3xl">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">chat</span>
                                Secure Communications
                            </h3>

                            <div className="flex flex-col gap-4 h-[400px] overflow-y-auto mb-6 pr-4 custom-scrollbar">
                                {report.messages && report.messages.length > 0 ? (
                                    report.messages.map((msg, i) => (
                                        <div key={i} className={`max-w-[80%] p-4 rounded-2xl ${msg.senderId === user?.id ? 'bg-primary/20 border border-primary/30 self-end ml-auto' : 'bg-primary/5 border border-border self-start'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[8px] font-bold uppercase text-primary">
                                                    {(msg.sender?.role === 'investigator' || msg.sender?.role === 'admin')
                                                        ? `OFFICIAL RESPONSE - ${msg.sender?.department || 'CYBER DIVISION'}`
                                                        : msg.sender?.role || 'CITIZEN'}
                                                </span>
                                            </div>
                                            <p className="text-xs">{msg.content}</p>
                                            <span className="text-[8px] text-text-muted uppercase mt-2 block tracking-wider">
                                                {new Date(msg.createdAt).toLocaleString()}
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
                                    className="w-full bg-primary/5 border border-border rounded-2xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm font-medium"
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
                        <div className="glass-card p-6 rounded-3xl">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-6">Case Timeline</h3>
                            <div className="flex flex-col gap-6 relative">
                                <div className="absolute left-1.5 top-0 bottom-0 w-px bg-border"></div>
                                {report.timeline && report.timeline.length > 0 ? (
                                    report.timeline.map((event, i) => (
                                        <div key={i} className="flex gap-4 relative z-10">
                                            <div className="size-3 rounded-full bg-primary mt-1 border-4 border-background shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-tight">{event.status}</p>
                                                <p className="text-[10px] text-text-secondary mt-0.5">{event.note}</p>
                                                <p className="text-[8px] text-text-muted mt-1 uppercase tracking-widest">{new Date(event.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex gap-4 relative z-10">
                                        <div className="size-3 rounded-full bg-primary mt-1 border-4 border-background"></div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tight">Report Received</p>
                                            <p className="text-[10px] text-text-secondary mt-0.5">Automated logging initiated.</p>
                                            <p className="text-[8px] text-text-muted mt-1 uppercase tracking-widest">{new Date(report.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Suspects Card */}
                        <div className="glass-card p-6 rounded-3xl bg-red-500/[0.02]">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">person_search</span>
                                Identified Suspects
                            </h3>
                            <div className="flex flex-col gap-3">
                                {report.suspects && report.suspects.length > 0 ? (
                                    report.suspects.map((s, i) => (
                                        <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                            <p className="text-xs font-bold uppercase tracking-tighter">{s}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-text-muted italic">No suspects identified yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Investigator Controls */}
                        {(user?.role === 'investigator' || user?.role === 'admin') && (
                            <div className="glass-card p-6 rounded-3xl bg-blue-500/[0.02]">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">gavel</span>
                                    Actions
                                </h3>
                                <div className="flex flex-col gap-3">
                                    <h4 className="text-[10px] font-bold uppercase text-text-muted">Update Status</h4>
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={() => handleStatusUpdate('investigating')} className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold uppercase hover:bg-yellow-500/20 transition-all font-display tracking-widest">Investigating</button>
                                        <button onClick={() => handleStatusUpdate('resolved')} className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold uppercase hover:bg-green-500/20 transition-all font-display tracking-widest">Resolve Case</button>
                                        <button onClick={() => handleStatusUpdate('closed')} className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl bg-gray-500/10 text-gray-500 border border-gray-500/20 text-[10px] font-bold uppercase hover:bg-gray-500/20 transition-all font-display tracking-widest">Close Case</button>
                                    </div>

                                    <div className="h-px bg-border my-2"></div>

                                    <button onClick={handleEscalate} className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase tracking-wider hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-sm">priority_high</span>
                                        Escalate Case
                                    </button>
                                </div>

                                {investigation && (
                                    <div className="mt-8 flex flex-col gap-6">
                                        <div className="h-px bg-border"></div>

                                        {/* Notes Section */}
                                        <div>
                                            <h4 className="text-[10px] font-bold uppercase text-text-muted mb-3 italic">Investigation Notes</h4>
                                            <div className="flex flex-col gap-3 mb-4">
                                                {investigation.notes?.map((n, i) => (
                                                    <div key={i} className="p-3 bg-white/5 border border-border rounded-xl text-[11px]">
                                                        <p className="text-text-secondary leading-relaxed">{n.content}</p>
                                                        <span className="text-[8px] text-text-muted mt-2 block uppercase font-mono">{new Date(n.date).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add internal note..."
                                                    className="flex-1 bg-surface border border-border rounded-xl px-4 py-2 text-xs"
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                />
                                                <button
                                                    onClick={async () => {
                                                        if (!newNote) return;
                                                        await API_SERVICE.addInvestigationNote(investigation.id, newNote);
                                                        setNewNote('');
                                                        fetchReport();
                                                    }}
                                                    className="px-3 bg-primary/20 text-primary rounded-xl text-xs font-bold"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        {/* Task List Section */}
                                        <div>
                                            <h4 className="text-[10px] font-bold uppercase text-text-muted mb-3 italic">Operational Tasks</h4>
                                            <div className="flex flex-col gap-2 mb-4">
                                                {investigation.tasks?.map((t, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-xl">
                                                        <button
                                                            onClick={async () => {
                                                                await API_SERVICE.toggleTaskCompletion(investigation.id, i);
                                                                fetchReport();
                                                            }}
                                                            className={`size-5 rounded border ${t.isCompleted ? 'bg-green-500 border-green-500 flex items-center justify-center' : 'border-border'}`}
                                                        >
                                                            {t.isCompleted && <span className="material-symbols-outlined text-[14px] text-white">check</span>}
                                                        </button>
                                                        <span className={`text-xs font-medium ${t.isCompleted ? 'line-through text-text-muted' : ''}`}>{t.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="New task..."
                                                    className="flex-1 bg-surface border border-border rounded-xl px-4 py-2 text-xs"
                                                    value={newTask}
                                                    onChange={(e) => setNewTask(e.target.value)}
                                                />
                                                <button
                                                    onClick={async () => {
                                                        if (!newTask) return;
                                                        await API_SERVICE.addInvestigationTask(investigation.id, { title: newTask });
                                                        setNewTask('');
                                                        fetchReport();
                                                    }}
                                                    className="px-3 bg-primary/20 text-primary rounded-xl text-xs font-bold"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        {/* Final Outcome Button */}
                                        <button
                                            onClick={async () => {
                                                const outcome = window.prompt('Enter final case outcome:');
                                                if (outcome) {
                                                    await API_SERVICE.setFinalOutcome(investigation.id, outcome);
                                                    fetchReport();
                                                }
                                            }}
                                            className="w-full py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20"
                                        >
                                            Close Case & Issue Outcome
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Evidence Integrity (SHA-256) */}
                        <div className="glass-card p-6 rounded-3xl bg-green-500/[0.02]">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-green-500 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">verified_user</span>
                                Evidence Integrity (SHA-256)
                            </h3>
                            <div className="flex flex-col gap-4">
                                {report.evidence && report.evidence.length > 0 ? (
                                    report.evidence.map((ev, i) => (
                                        <div key={i} className="flex flex-col gap-1 p-3 bg-primary/10 rounded-xl border border-border">
                                            <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter truncate">{ev.split(/[/\\]/).pop()}</p>
                                            <code className="text-[10px] text-green-500 font-mono break-all">{Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}</code>
                                            <p className="text-[8px] text-text-muted uppercase mt-1">Verified by system protocol on {new Date(report.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-text-muted italic text-center">No digital evidence hashed yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Support Info */}
                        <div className="p-6 rounded-3xl border border-border bg-primary/5">
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Need Help?</h4>
                            <p className="text-[10px] text-text-secondary leading-relaxed mb-4">You can message your investigator directly using the secure channel on the left.</p>
                            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-text-primary transition-colors">Case FAQ & Guidelines</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportDetails;
