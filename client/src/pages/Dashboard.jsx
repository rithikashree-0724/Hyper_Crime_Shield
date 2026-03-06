import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import * as API_SERVICE from '../api';

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect non-citizens to their appropriate dashboards
        if (user?.role === 'admin') {
            navigate('/admin-dashboard');
            return;
        }
        if (user?.role === 'investigator') {
            navigate('/investigator-dashboard');
            return;
        }

        const fetchReports = async () => {
            try {
                const { data } = await API_SERVICE.getReports();
                setReports(data.data);
            } catch (err) {
                console.error('FETCH_ERR: Terminal connection unstable.', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [user, navigate]);

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

    const quickActions = [
        { label: 'Report New Crime', icon: 'add_circle', link: '/report-crime', color: 'bg-red-500' },
        { label: 'View All Reports', icon: 'article', link: '#reports', action: true, color: 'bg-blue-500' },
        { label: 'Safety Resources', icon: 'shield', link: '/resources', color: 'bg-green-500' },
        { label: 'Contact Support', icon: 'support_agent', link: '/support', color: 'bg-purple-500' }
    ];

    const handleQuickAction = (e, action) => {
        if (action.action && action.link.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(action.link);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };


    const safetyTips = [
        { tip: 'Always verify caller identity before sharing personal information', icon: 'verified_user' },
        { tip: 'Use strong, unique passwords for each online account', icon: 'password' },
        { tip: 'Keep your software and antivirus up to date', icon: 'system_update' },
        { tip: 'Be cautious of suspicious emails and attachments', icon: 'mark_email_read' }
    ];

    return (
        <div className="min-h-screen bg-background text-text-primary font-body">
            <Header />

            <main className="max-w-7xl mx-auto px-6 pt-[160px] pb-24">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em]">
                                {user?.role === 'citizen' ? 'Citizen Portal' : 'My Dashboard'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Welcome, {user?.name || 'User'}</h1>
                        <p className="text-text-secondary mt-2 font-medium italic">Your safety is our priority. Track reports and stay informed.</p>
                    </div>
                    <Link to="/report-crime" className="btn-primary flex items-center gap-2 whitespace-nowrap">
                        <span className="material-symbols-outlined">add_circle</span>
                        Report Crime
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-4xl">article</span>
                        </div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">My Reports</p>
                        <h2 className="text-4xl font-extrabold text-text-primary">{reports.length}</h2>
                    </div>
                    <div className="glass-card p-8 rounded-2xl bg-amber-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-4xl">pending</span>
                        </div>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Pending</p>
                        <h2 className="text-4xl font-extrabold text-text-primary">
                            {reports.filter(r => r.status === 'pending' || r.status === 'reported').length}
                        </h2>
                    </div>
                    <div className="glass-card p-8 rounded-2xl bg-blue-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-4xl">troubleshoot</span>
                        </div>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Investigating</p>
                        <h2 className="text-4xl font-extrabold text-text-primary">
                            {reports.filter(r => r.status === 'investigating').length}
                        </h2>
                    </div>
                    <div className="glass-card p-8 rounded-2xl bg-emerald-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-4xl">check_circle</span>
                        </div>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Resolved</p>
                        <h2 className="text-4xl font-extrabold text-text-primary">
                            {reports.filter(r => r.status === 'closed' || r.status === 'resolved').length}
                        </h2>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 mb-24">
                    {/* Quick Actions */}
                    <div className="lg:col-span-2">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">bolt</span>
                            Quick Actions
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {quickActions.map((action, i) => (
                                <Link
                                    key={i}
                                    to={action.link}
                                    onClick={(e) => handleQuickAction(e, action)}
                                    className="glass-card p-6 rounded-2xl group"
                                >
                                    <div className={`size-12 rounded-xl ${action.color} bg-opacity-20 border border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <span className="material-symbols-outlined text-2xl" style={{ color: action.color.replace('bg-', '') }}>{action.icon}</span>
                                    </div>
                                    <p className="text-sm font-bold">{action.label}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Safety Tips */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-500">tips_and_updates</span>
                            Safety Tips
                        </h3>
                        <div className="glass-card p-6 rounded-2xl">
                            <div className="flex flex-col gap-4">
                                {safetyTips.map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <span className="material-symbols-outlined text-green-500 mt-0.5">{item.icon}</span>
                                        <p className="text-xs text-text-secondary">{item.tip}</p>
                                    </div>
                                ))}
                            </div>
                            <Link to="/resources" className="mt-6 text-xs font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity flex items-center gap-2">
                                View All Tips
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Reports Table */}
                <div id="reports" className="glass-card rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-xl font-bold">My Crime Reports</h3>
                        <p className="text-sm text-text-secondary mt-1">Track the status of your submitted reports</p>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-primary/5 border-b border-border">
                                <tr>
                                    {['Report Title', 'Date Reported', 'Category', 'Handled By', 'Status', 'Actions'].map((header) => (
                                        <th key={header} className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan="5" className="px-8 py-20 text-center text-text-muted italic animate-pulse tracking-widest uppercase text-[10px]">Loading reports...</td></tr>
                                ) : reports.length === 0 ? (
                                    <tr><td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <span className="material-symbols-outlined text-6xl text-text-muted opacity-20">article</span>
                                            <p className="text-text-muted font-medium">No reports found.</p>
                                            <Link to="/report-crime" className="btn-primary">Submit Your First Report</Link>
                                        </div>
                                    </td></tr>
                                ) : reports.map((report) => (
                                    <tr key={report.id} className="group hover:bg-primary/5 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold group-hover:text-primary transition-colors">
                                                    {report.title || 'Untitled Report'}
                                                </span>
                                                <span className="text-[8px] font-mono text-text-muted uppercase mt-0.5 tracking-tighter">
                                                    ID: {report.complaintId || report.id}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <p className="text-xs font-bold uppercase tracking-tight">{new Date(report.createdAt).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-text-muted mt-0.5 font-medium">{new Date(report.createdAt).toLocaleTimeString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#137fec] italic">{report.category}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {report.investigation?.primaryInvestigator ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                                        <span className="material-symbols-outlined text-xs text-primary">person</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold uppercase tracking-tight">{report.investigation.primaryInvestigator.name}</span>
                                                        <span className="text-[8px] text-text-muted uppercase tracking-tighter">{report.investigation.primaryInvestigator.department || 'Investigator'}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-text-muted opacity-50 italic">Not Assigned</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold tracking-widest uppercase ${getStatusStyles(report.status)}`}>
                                                <div className={`size-1.5 rounded-full ${report.status === 'investigating' ? 'bg-current animate-pulse' : 'bg-current'}`}></div>
                                                {report.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Link to={`/reports/${report.id}`} className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-primary transition-colors flex items-center gap-2 group/btn border border-border px-4 py-2 rounded-lg hover:border-primary/50">
                                                View Details
                                                <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">visibility</span>
                                            </Link>
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
