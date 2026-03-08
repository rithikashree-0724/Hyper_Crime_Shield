import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRealTime } from '../context/RealTimeContext';
import Header from '../components/Header';
import * as API_SERVICE from '../api';

const InvestigatorDashboard = () => {
    const { user } = useAuth();
    const { socket } = useRealTime();
    const navigate = useNavigate();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (user?.role !== 'investigator') {
            if (user?.role === 'admin') navigate('/admin-dashboard');
            else navigate('/dashboard');
            return;
        }
        fetchCases();
    }, [user, navigate]);

    useEffect(() => {
        if (!socket) return;
        socket.on('new_report', () => fetchCases());
        socket.on('report_updated', (updatedReport) => {
            setCases(prev => prev.map(c => c.report?.id === updatedReport.id ? { ...c, report: updatedReport } : c));
        });
        return () => {
            socket.off('new_report');
            socket.off('report_updated');
        };
    }, [socket]);

    const fetchCases = async () => {
        try {
            const res = await API_SERVICE.getInvestigations();
            const data = res.data.data || res.data;
            setCases(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'investigating': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'closed':
            case 'resolved': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'pending':
            case 'reported': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    // Calculate progress % from step statuses
    const calcProgress = (inv) => {
        if (!inv) return 0;
        const steps = [
            inv.complaintReviewStatus === 'completed',
            inv.forensicStatus === 'completed',
            ['completed', 'verified', 'suspicious'].includes(inv.transactionStatus),
            inv.callAnalysisStatus === 'completed',
            ['completed', 'verified'].includes(inv.physicalVerificationStatus)
        ];
        return Math.round((steps.filter(Boolean).length / steps.length) * 100);
    };

    const stepIcons = [
        { key: 'complaintReviewStatus', label: 'Review', icon: 'rate_review' },
        { key: 'forensicStatus', label: 'Forensic', icon: 'troubleshoot' },
        { key: 'transactionStatus', label: 'Finance', icon: 'payments' },
        { key: 'callAnalysisStatus', label: 'Calls', icon: 'call' },
        { key: 'physicalVerificationStatus', label: 'Field', icon: 'location_on' },
    ];

    const isStepDone = (inv, key) => {
        const val = inv?.[key];
        return ['completed', 'verified', 'suspicious'].includes(val);
    };

    const filteredCases = filter === 'all'
        ? cases
        : cases.filter(c => {
            const s = c.report?.status?.toLowerCase();
            if (filter === 'pending') return s === 'pending' || s === 'reported' || s === 'review';
            if (filter === 'investigating') return s === 'investigating' || s === 'approved';
            if (filter === 'closed') return s === 'closed' || s === 'resolved';
            return s === filter;
        });

    const stats = [
        { label: 'Total Cases', value: cases.length, icon: 'folder_open', color: 'blue' },
        { label: 'Active', value: cases.filter(c => c.report?.status === 'investigating').length, icon: 'troubleshoot', color: 'amber' },
        { label: 'Pending Review', value: cases.filter(c => c.report?.status === 'pending' || c.report?.status === 'reported').length, icon: 'pending_actions', color: 'purple' },
        { label: 'Resolved', value: cases.filter(c => c.report?.status === 'closed' || c.report?.status === 'resolved').length, icon: 'check_circle', color: 'green' }
    ];

    // Overall portfolio progress
    const overallProgress = cases.length > 0
        ? Math.round(cases.reduce((acc, c) => acc + calcProgress(c), 0) / cases.length)
        : 0;

    return (
        <div className="min-h-screen bg-background text-text-primary font-body">
            <Header />
            <main className="max-w-7xl mx-auto px-6 pt-[160px] pb-24">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 bg-gradient-to-r from-blue-500/10 to-amber-500/10 p-10 rounded-3xl border border-border">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-amber-500">badge</span>
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em]">Investigation Unit</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Officer Dashboard</h1>
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                            <p className="text-text-secondary font-medium italic text-lg">Welcome back, Officer {user?.name || 'Unknown'}</p>
                            <div className="h-4 w-px bg-border hidden md:block"></div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Badge ID</span>
                                    <span className="text-xs font-mono font-bold text-text-primary">{user?.badgeId || 'CCIU-8829'}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Dept</span>
                                    <span className="text-xs font-bold text-text-primary uppercase tracking-tight">{user?.department || 'Cyber Division'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Portfolio Progress */}
                        {cases.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Overall Case Progress</span>
                                    <span className="text-xs font-black text-primary">{overallProgress}%</span>
                                </div>
                                <div className="w-64 h-2 bg-primary/10 rounded-full overflow-hidden border border-border">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                                        style={{ width: `${overallProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        {['all', 'pending', 'investigating', 'closed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === status
                                    ? 'bg-primary text-white'
                                    : 'bg-primary/10 text-text-muted hover:bg-primary/20'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {stats.map((stat, i) => (
                        <div key={i} className={`glass-card p-8 rounded-2xl border-border relative overflow-hidden bg-${stat.color}-500/5`}>
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="material-symbols-outlined text-4xl">{stat.icon}</span>
                            </div>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                            <h2 className="text-4xl font-extrabold">{stat.value}</h2>
                        </div>
                    ))}
                </div>

                {/* Quick Tools */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    <Link to="/resources" className="glass-card p-6 rounded-2xl group">
                        <div className="size-12 rounded-xl bg-purple-500/20 border border-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl text-purple-500">school</span>
                        </div>
                        <h3 className="text-sm font-bold mb-2">Training Resources</h3>
                        <p className="text-xs text-text-secondary">Access investigation guides and best practices</p>
                    </Link>
                    <Link to="/alerts" className="glass-card p-6 rounded-2xl group">
                        <div className="size-12 rounded-xl bg-blue-500/20 border border-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl text-blue-500">notification_important</span>
                        </div>
                        <h3 className="text-sm font-bold mb-2">Shield Alerts</h3>
                        <p className="text-xs text-text-secondary">Monitor real-time cyber threats and advisories</p>
                    </Link>
                    <Link to="/profile" className="glass-card p-6 rounded-2xl group">
                        <div className="size-12 rounded-xl bg-green-500/20 border border-green-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl text-green-500">verified_user</span>
                        </div>
                        <h3 className="text-sm font-bold mb-2">Security Settings</h3>
                        <p className="text-xs text-text-secondary">Manage your profile and enable 2FA</p>
                    </Link>
                </div>

                {/* Cases List */}
                <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">work</span>
                                Assigned Cases ({filteredCases.length})
                            </h3>
                            <p className="text-sm text-text-secondary mt-1">Manage and track your investigation workload</p>
                        </div>
                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">analytics</span>
                            Progress Tracking Active
                        </div>
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
                            <div className="grid gap-6">
                                {filteredCases.map((investigation) => {
                                    const progress = calcProgress(investigation);
                                    const isClosed = ['closed', 'resolved'].includes(investigation.report?.status?.toLowerCase());

                                    return (
                                        <div key={investigation.id} className="glass-card p-6 rounded-2xl hover:bg-primary/5 transition-all group border border-border/50">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                                <div className="flex-1">
                                                    {/* Case Header */}
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mt-1 shrink-0">
                                                            <span className="material-symbols-outlined text-primary">description</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                                                                {investigation.report?.title || 'Untitled Case'}
                                                            </h4>
                                                            <p className="text-xs text-text-secondary mt-0.5">
                                                                Case ID: <span className="font-mono text-primary">{investigation.report?.complaintId || investigation.id}</span>
                                                            </p>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider">
                                                                    {investigation.report?.category}
                                                                </span>
                                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(investigation.report?.status)}`}>
                                                                    {investigation.report?.status}
                                                                </span>
                                                                <span className="px-2 py-1 rounded-md bg-primary/5 text-text-muted text-[10px] font-bold uppercase tracking-wider">
                                                                    Priority: {investigation.report?.severity || 'Medium'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="text-sm text-text-secondary mb-5">
                                                        {investigation.report?.description?.substring(0, 130)}...
                                                    </p>

                                                    {/* Investigation Progress Bar */}
                                                    <div className="mb-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-xs">analytics</span>
                                                                Investigation Progress
                                                            </span>
                                                            <span className={`text-[10px] font-black uppercase ${isClosed ? 'text-emerald-500' : 'text-primary'}`}>
                                                                {isClosed ? '✓ Resolved' : `${progress}%`}
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden border border-border/30">
                                                            <div
                                                                className={`h-full transition-all duration-1000 ease-out rounded-full ${isClosed ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-primary shadow-[0_0_8px_rgba(34,211,238,0.3)]'}`}
                                                                style={{ width: isClosed ? '100%' : `${progress}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Step Status Badges */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {stepIcons.map(step => {
                                                            const done = isStepDone(investigation, step.key);
                                                            return (
                                                                <div
                                                                    key={step.key}
                                                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${done
                                                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                                        : 'bg-primary/5 text-text-muted border-border/30'
                                                                        }`}
                                                                >
                                                                    <span className="material-symbols-outlined text-[10px]">{done ? 'check_circle' : 'radio_button_unchecked'}</span>
                                                                    {step.label}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Meta Info */}
                                                    <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                                            {new Date(investigation.createdAt).toLocaleDateString()}
                                                        </span>
                                                        {investigation.notes?.length > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-sm">note</span>
                                                                {investigation.notes.length} Notes
                                                            </span>
                                                        )}
                                                        {investigation.report?.messages?.length > 0 && (
                                                            <span className="flex items-center gap-1 text-primary font-bold">
                                                                <span className="material-symbols-outlined text-sm">chat</span>
                                                                {investigation.report.messages.length} Messages
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <div className="flex flex-col gap-3 shrink-0">
                                                    <Link
                                                        to={`/reports/${investigation.report?.id}`}
                                                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                                                    >
                                                        {isClosed ? 'View Report' : 'Open Investigation'}
                                                        <span className="material-symbols-outlined">arrow_forward</span>
                                                    </Link>
                                                    {!isClosed && progress < 100 && (
                                                        <p className="text-[9px] text-text-muted text-center uppercase tracking-widest">
                                                            {5 - Math.round(progress / 20)} steps remaining
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InvestigatorDashboard;
