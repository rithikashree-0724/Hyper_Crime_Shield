import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/reports', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setReports(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('FETCH_ERR: Terminal connection unstable.', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'investigating': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'resolved':
            case 'closed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'pending':
            case 'reported': return 'bg-primary/10 text-primary border-primary/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-body">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em]">SECURE_FEED: CSIRT_NODE_ACTIVE</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Tactical Monitoring</h1>
                        <p className="text-text-secondary mt-2 font-medium italic">Verified incident telemetry and case management segments.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                    <div className="glass-card p-8 rounded-2xl border-white/5 bg-surface-dark/40 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-4xl">database</span>
                        </div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Total Logs</p>
                        <h2 className="text-4xl font-extrabold text-white">{reports.length}</h2>
                    </div>
                    <div className="glass-card p-8 rounded-2xl border-white/5 bg-surface-dark/40 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-4xl">troubleshoot</span>
                        </div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Active Triage</p>
                        <h2 className="text-4xl font-extrabold text-white">
                            {reports.filter(r => r.status === 'investigating').length}
                        </h2>
                    </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden border-white/5 shadow-2xl bg-surface-dark/20">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.03] border-b border-white/5">
                                <tr>
                                    {['Case Designation', 'Logged Timestamp', 'Classification', 'Status', 'Actions'].map((header) => (
                                        <th key={header} className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan="5" className="px-8 py-20 text-center text-text-muted italic animate-pulse tracking-widest uppercase text-[10px]">Synchronizing with data cluster...</td></tr>
                                ) : reports.length === 0 ? (
                                    <tr><td colSpan="5" className="px-8 py-20 text-center text-text-muted italic font-medium">No verified incident signatures found in current segment.</td></tr>
                                ) : reports.map((report) => (
                                    <tr key={report._id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                                                    {report.title || 'UNNAMED_INCIDENT'}
                                                </span>
                                                <span className="text-[8px] font-mono text-text-muted uppercase mt-0.5 tracking-tighter">
                                                    ID: {report._id}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <p className="text-xs font-bold text-white uppercase tracking-tight">{new Date(report.createdAt).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-text-muted mt-0.5 font-medium">{new Date(report.createdAt).toLocaleTimeString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#22d3ee] italic">{report.category}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold tracking-widest uppercase ${getStatusStyles(report.status)}`}>
                                                <div className={`size-1.5 rounded-full ${report.status === 'investigating' ? 'bg-current animate-pulse' : 'bg-current'}`}></div>
                                                {report.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors flex items-center gap-2 group/btn border border-white/5 px-4 py-2 rounded-lg hover:border-white/20">
                                                Audit Source
                                                <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">terminal</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
