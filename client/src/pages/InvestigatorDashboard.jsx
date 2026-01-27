import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useRealTime } from '../context/RealTimeContext';
import axios from 'axios';

const InvestigatorDashboard = () => {
    const { user } = useAuth();
    const { socket } = useRealTime();
    const navigate = useNavigate();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Redirect non-investigators
        if (user?.role !== 'investigator') {
            if (user?.role === 'admin') navigate('/admin-dashboard');
            else navigate('/dashboard');
            return;
        }

        fetchCases();
    }, [user, navigate]);

    useEffect(() => {
        if (!socket) return;

        socket.on('new_report', (report) => {
            fetchCases();
        });

        socket.on('report_updated', (updatedReport) => {
            setCases(prev => prev.map(c => c.report.id === updatedReport.id ? { ...c, report: updatedReport } : c));
        });

        return () => {
            socket.off('new_report');
            socket.off('report_updated');
        };
    }, [socket]);

    const fetchCases = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/investigations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCases(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'investigating': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'closed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'pending':
            case 'reported': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    const filteredCases = filter === 'all' ? cases : cases.filter(c => c.report.status === filter);

    const stats = [
        { label: 'Total Cases', value: cases.length, icon: 'folder_open', color: 'blue' },
        { label: 'Active', value: cases.filter(c => c.report.status === 'investigating').length, icon: 'troubleshoot', color: 'amber' },
        { label: 'Pending Review', value: cases.filter(c => c.report.status === 'pending' || c.report.status === 'reported').length, icon: 'pending_actions', color: 'purple' },
        { label: 'Resolved', value: cases.filter(c => c.report.status === 'closed').length, icon: 'check_circle', color: 'green' }
    ];

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-body">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 bg-gradient-to-r from-blue-900/20 to-amber-900/20 p-8 rounded-3xl border border-blue-500/10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-amber-500">badge</span>
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em]">Investigation Unit</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">Officer Dashboard</h1>
                        <p className="text-blue-200 mt-2 font-medium italic">Welcome back, Officer {user?.name || 'Unknown'}</p>
                    </div>
                    <div className="flex gap-3">
                        {['all', 'pending', 'investigating', 'closed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === status
                                    ? 'bg-primary text-white'
                                    : 'bg-white/5 text-text-muted hover:bg-white/10'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className={`glass-card p-8 rounded-2xl border-white/5 bg-${stat.color}-500/5 shadow-xl overflow-hidden relative`}>
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="material-symbols-outlined text-4xl">{stat.icon}</span>
                            </div>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                            <h2 className="text-4xl font-extrabold text-white">{stat.value}</h2>
                        </div>
                    ))}
                </div>

                {/* Investigation Tools */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <Link to="/resources" className="glass-card p-6 rounded-2xl border-white/5 hover:bg-white/[0.05] transition-all group">
                        <div className="size-12 rounded-xl bg-purple-500/20 border border-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl text-purple-500">school</span>
                        </div>
                        <h3 className="text-sm font-bold mb-2">Training Resources</h3>
                        <p className="text-xs text-text-secondary">Access investigation guides and best practices</p>
                    </Link>

                    <Link to="/support" className="glass-card p-6 rounded-2xl border-white/5 hover:bg-white/[0.05] transition-all group">
                        <div className="size-12 rounded-xl bg-blue-500/20 border border-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl text-blue-500">support_agent</span>
                        </div>
                        <h3 className="text-sm font-bold mb-2">Technical Support</h3>
                        <p className="text-xs text-text-secondary">Get help with investigation tools and systems</p>
                    </Link>

                    <Link to="/profile" className="glass-card p-6 rounded-2xl border-white/5 hover:bg-white/[0.05] transition-all group">
                        <div className="size-12 rounded-xl bg-green-500/20 border border-green-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl text-green-500">verified_user</span>
                        </div>
                        <h3 className="text-sm font-bold mb-2">Security Settings</h3>
                        <p className="text-xs text-text-secondary">Manage your profile and enable 2FA</p>
                    </Link>
                </div>

                {/* Cases List */}
                <div className="glass-card rounded-2xl overflow-hidden border-white/5 shadow-2xl bg-surface-dark/20">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">work</span>
                            Assigned Cases ({filteredCases.length})
                        </h3>
                        <p className="text-sm text-text-secondary mt-1">Manage and track your investigation workload</p>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                <p className="mt-4 text-text-muted uppercase text-xs tracking-widest">Loading cases...</p>
                            </div>
                        ) : filteredCases.length === 0 ? (
                            <div className="text-center py-20">
                                <span className="material-symbols-outlined text-6xl text-text-muted opacity-20">folder_open</span>
                                <p className="mt-4 text-text-muted font-medium">No cases found for "{filter}" filter.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredCases.map((investigation) => (
                                    <div key={investigation.id} className="glass-card p-6 rounded-xl border-white/5 hover:bg-white/[0.03] transition-all group">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mt-1">
                                                        <span className="material-symbols-outlined text-primary">description</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                                                            {investigation.report?.title || 'Untitled Case'}
                                                        </h4>
                                                        <p className="text-xs text-text-secondary mt-1">
                                                            Case ID: {investigation.report?.complaintId || investigation.id}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider">
                                                                {investigation.report?.category}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(investigation.report?.status)}`}>
                                                                {investigation.report?.status}
                                                            </span>
                                                            <span className="px-2 py-1 rounded-md bg-white/5 text-text-muted text-[10px] font-bold uppercase tracking-wider">
                                                                Priority: {investigation.report?.severity || 'Medium'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-text-secondary ml-13">
                                                    {investigation.report?.description?.substring(0, 150)}...
                                                </p>
                                                <div className="flex items-center gap-4 mt-4 ml-13 text-xs text-text-muted">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                                        {new Date(investigation.createdAt).toLocaleDateString()}
                                                    </span>
                                                    {investigation.notes && (
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-sm">note</span>
                                                            {investigation.notes.length} Notes
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Link
                                                to={`/reports/${investigation.report?.id}`}
                                                className="btn-primary flex items-center gap-2 whitespace-nowrap"
                                            >
                                                View Case File
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InvestigatorDashboard;
