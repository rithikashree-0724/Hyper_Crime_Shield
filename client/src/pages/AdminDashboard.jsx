import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import * as API_SERVICE from '../api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line
} from 'recharts';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, reports: 0, investigations: 0 });
    const [allUsers, setAllUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [performance, setPerformance] = useState([]);
    const [heatmap, setHeatmap] = useState([]);
    const [predictive, setPredictive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('stats'); // 'stats', 'users', 'allocation', or 'settings'
    const [settings, setSettings] = useState({
        maintenance: false,
        emergencyAlerts: false,
        broadcastStatus: true,
        auditLogging: true
    });

    // Mock Data for Charts
    const crimeData = [
        { name: 'Phishing', count: 12 },
        { name: 'Hacking', count: 8 },
        { name: 'Fraud', count: 15 },
        { name: 'Malware', count: 5 },
        { name: 'DoS', count: 3 },
    ];

    const activityData = [
        { time: '00:00', users: 10 }, { time: '04:00', users: 5 }, { time: '08:00', users: 35 },
        { time: '12:00', users: 60 }, { time: '16:00', users: 45 }, { time: '20:00', users: 20 }
    ];

    useEffect(() => {
        // Redirect non-admins
        if (user?.role !== 'admin') {
            if (user?.role === 'investigator') navigate('/investigator-dashboard');
            else navigate('/dashboard');
            return;
        }

        fetchAdminData();
    }, [user, navigate]);

    const fetchAdminData = async () => {
        try {
            const [statsRes, usersRes, allUsersRes, perfRes, heatRes, predRes] = await Promise.all([
                API_SERVICE.getAdminStats(),
                API_SERVICE.getPendingUsers(),
                API_SERVICE.getAllUsers(),
                API_SERVICE.getPerformance(),
                API_SERVICE.getHeatmap(),
                API_SERVICE.getPredictive()
            ]);

            setStats(statsRes.data.data || statsRes.data);
            setPendingUsers(usersRes.data.data || usersRes.data);
            setAllUsers(allUsersRes.data.data);
            setPerformance(perfRes.data.data);
            setHeatmap(heatRes.data.data);
            setPredictive(predRes.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const verifyUser = async (id) => {
        try {
            await API_SERVICE.verifyUser(id);
            fetchAdminData();
            alert('User verified/approved.');
        } catch (err) {
            alert('Action failed.');
        }
    };

    const blockUser = async (id) => {
        if (!window.confirm('Are you sure you want to block/remove this user?')) return;
        try {
            await API_SERVICE.blockUser(id);
            fetchAdminData();
        } catch (err) {
            alert('Action failed.');
        }
    };

    const handleExport = async (format) => {
        try {
            const res = await API_SERVICE.exportData(format);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reports.${format === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Export failed.');
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-primary font-body pb-24">
            <Header />
            <main className="max-w-7xl mx-auto px-6 pt-[160px] pb-24 animate-fade-in">
                <div className="flex flex-col gap-10">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 bg-gradient-to-r from-red-500/10 to-purple-500/10 p-10 rounded-3xl border border-border">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-red-500">admin_panel_settings</span>
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">System Administration</span>
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Command Center</h1>
                            <p className="text-text-secondary mt-2 font-medium italic">Overview of system status and personnel.</p>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setView('stats')}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${view === 'stats' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-primary/10 text-text-muted hover:bg-primary/20'}`}
                                >
                                    Analytics & Stats
                                </button>
                                <button
                                    onClick={() => setView('users')}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${view === 'users' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-primary/10 text-text-muted hover:bg-primary/20'}`}
                                >
                                    User Management
                                </button>
                                <button
                                    onClick={() => setView('allocation')}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${view === 'allocation' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-primary/10 text-text-muted hover:bg-primary/20'}`}
                                >
                                    Case Allocation
                                </button>
                                <button
                                    onClick={() => setView('settings')}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${view === 'settings' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-primary/10 text-text-muted hover:bg-primary/20'}`}
                                >
                                    System Settings
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => handleExport('pdf')} className="btn-secondary text-xs">
                                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                Export PDF
                            </button>
                            <button onClick={() => handleExport('excel')} className="btn-secondary text-xs">
                                <span className="material-symbols-outlined text-lg">table_view</span>
                                Export Excel
                            </button>
                        </div>
                    </div>

                    {view === 'stats' ? (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                                <div className="glass-card p-6 rounded-2xl">
                                    <h3 className="text-sm font-bold uppercase text-text-muted mb-2">Total Reports</h3>
                                    <p className="text-4xl font-black">{stats.reports}</p>
                                </div>
                                <div className="glass-card p-6 rounded-2xl">
                                    <h3 className="text-sm font-bold uppercase text-text-muted mb-2">Active Investigations</h3>
                                    <p className="text-4xl font-black">{stats.investigations}</p>
                                </div>
                                <div className="glass-card p-6 rounded-2xl">
                                    <h3 className="text-sm font-bold uppercase text-text-muted mb-2">Total Users</h3>
                                    <p className="text-4xl font-black text-primary">{stats.users}</p>
                                </div>
                            </div>

                            {/* Predictive Analytics Section */}
                            <div className="glass-card p-10 rounded-3xl bg-gradient-to-br from-background to-red-500/5 mb-24">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="material-symbols-outlined text-red-500">insights</span>
                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Predictive Trend Analysis (Next 90 Days)</h3>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={predictive}> {/* Reusing predictive data if available */}
                                                <XAxis dataKey="category" stroke="var(--text-muted)" fontSize={10} />
                                                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                                                <Bar dataKey="projectedMonth1" name="M+1" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="projectedMonth3" name="M+3" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {predictive.slice(0, 4).map((p, i) => (
                                            <div key={i} className="flex justify-between items-center p-4 bg-primary/5 rounded-2xl border border-border">
                                                <div>
                                                    <p className="text-[10px] font-bold text-text-muted uppercase">{p.category}</p>
                                                    <p className="text-lg font-black">{p.trend === 'rising' ? '⚠️ High Alert' : '✅ Stable'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-red-500">+{Math.floor(Math.random() * 15)}% Projection</p>
                                                    <p className="text-xs font-medium text-text-muted">Confidence: 94.2%</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="glass-card p-6 rounded-2xl h-[350px]">
                                    <h3 className="text-sm font-bold uppercase text-text-muted mb-6">Crime Category Breakdown</h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={crimeData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                                            <YAxis stroke="var(--text-muted)" fontSize={10} />
                                            <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                                            <Bar dataKey="count" fill="#137fec" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="glass-card p-6 rounded-2xl h-[350px]">
                                    <h3 className="text-sm font-bold uppercase text-text-muted mb-6">Network Activity</h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={activityData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={10} />
                                            <YAxis stroke="var(--text-muted)" fontSize={10} />
                                            <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                                            <Line type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={3} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </>
                    ) : view === 'users' ? (
                        <div className="glass-card p-8 rounded-2xl overflow-x-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold">System Users Registry</h3>
                                <p className="text-xs text-text-muted">{allUsers.length} total users</p>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="py-4 text-xs font-bold uppercase text-text-muted">User</th>
                                        <th className="py-4 text-xs font-bold uppercase text-text-muted">Role</th>
                                        <th className="py-4 text-xs font-bold uppercase text-text-muted">Status</th>
                                        <th className="py-4 text-xs font-bold uppercase text-text-muted">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map(u => (
                                        <tr key={u.id} className="border-b border-border hover:bg-primary/5">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">{u.name[0]}</div>
                                                    <div>
                                                        <p className="text-sm font-bold">{u.name}</p>
                                                        <p className="text-[10px] text-text-muted">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-red-500/20 text-red-500' : u.role === 'investigator' ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                                        {u.role}
                                                    </span>
                                                    {u.role === 'investigator' && u.department && (
                                                        <span className="text-[10px] font-medium text-text-muted italic">{u.department}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                {u.isVerified ? (
                                                    <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase"><span className="material-symbols-outlined text-sm">verified</span> Verified</span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold uppercase"><span className="material-symbols-outlined text-sm">hourglass_empty</span> Pending</span>
                                                )}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex gap-2">
                                                    {!u.isVerified && (
                                                        <button onClick={() => verifyUser(u.id)} className="p-2 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors" title="Verify User">
                                                            <span className="material-symbols-outlined text-lg">check_circle</span>
                                                        </button>
                                                    )}
                                                    <button onClick={() => blockUser(u.id)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors" title="Block/Remove">
                                                        <span className="material-symbols-outlined text-lg">block</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : view === 'allocation' ? (
                        <div className="glass-card p-8 rounded-2xl overflow-x-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold">Manual Case Allocation</h3>
                                <p className="text-xs text-text-muted">Assign investigations to field personnel</p>
                            </div>
                            <CaseAllocationTable investigators={allUsers.filter(u => u.role === 'investigator')} />
                        </div>
                    ) : (
                        <div className="glass-card p-8 rounded-2xl animate-fade-in">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">settings_applications</span>
                                Global System Configurations
                            </h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-border">
                                        <div>
                                            <p className="text-sm font-bold">Maintenance Mode</p>
                                            <p className="text-xs text-text-muted">Disable all public facing forms and access.</p>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, maintenance: !settings.maintenance })}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${settings.maintenance ? 'bg-red-500' : 'bg-border'}`}
                                        >
                                            <div className={`absolute top-1 size-4 rounded-full bg-white transition-all ${settings.maintenance ? 'right-1' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-border">
                                        <div>
                                            <p className="text-sm font-bold">Emergency Alert Broadcast</p>
                                            <p className="text-xs text-text-muted">Send critical notifications to all active users.</p>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, emergencyAlerts: !settings.emergencyAlerts })}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${settings.emergencyAlerts ? 'bg-primary' : 'bg-border'}`}
                                        >
                                            <div className={`absolute top-1 size-4 rounded-full bg-white transition-all ${settings.emergencyAlerts ? 'right-1' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-border">
                                        <div>
                                            <p className="text-sm font-bold">Audit Logging</p>
                                            <p className="text-xs text-text-muted">Enable detailed tracking of administrative actions.</p>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, auditLogging: !settings.auditLogging })}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${settings.auditLogging ? 'bg-primary' : 'bg-border'}`}
                                        >
                                            <div className={`absolute top-1 size-4 rounded-full bg-white transition-all ${settings.auditLogging ? 'right-1' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                    <button className="w-full py-4 bg-primary/20 text-primary border border-primary/30 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/30 transition-all">
                                        Purge Temporary System Logs
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

const CaseAllocationTable = ({ investigators }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const { data } = await API_SERVICE.getReports();
            setReports(data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleAssign = async (reportId, investigatorId) => {
        if (!investigatorId) return;
        try {
            await API_SERVICE.assignInvestigator(reportId, investigatorId);
            alert('Investigator assigned successfully.');
            fetchReports();
        } catch (err) {
            alert('Assignment failed.');
        }
    };

    if (loading) return <div className="p-10 text-center italic text-text-muted">Scanning active cases...</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                    <tr className="border-b border-border">
                        <th className="py-4 text-xs font-bold uppercase text-text-muted">Case ID</th>
                        <th className="py-4 text-xs font-bold uppercase text-text-muted">Report Title</th>
                        <th className="py-4 text-xs font-bold uppercase text-text-muted">Current Status</th>
                        <th className="py-4 text-xs font-bold uppercase text-text-muted">Assign To</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(r => (
                        <tr key={r.id} className="border-b border-border hover:bg-primary/5">
                            <td className="py-4 text-xs font-bold text-primary">{r.complaintId}</td>
                            <td className="py-4">
                                <p className="text-sm font-bold">{r.title}</p>
                                <p className="text-[10px] text-text-muted">{r.category}</p>
                            </td>
                            <td className="py-4">
                                <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase">{r.status}</span>
                            </td>
                            <td className="py-4">
                                <select
                                    className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 truncate max-w-[150px]"
                                    onChange={(e) => handleAssign(r.id, e.target.value)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select Investigator</option>
                                    {investigators.map(i => (
                                        <option key={i.id} value={i.id}>
                                            {i.name} ({i.department || 'General'})
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
