import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, reports: 0, investigations: 0 });
    const [pendingUsers, setPendingUsers] = useState([]);
    const [performance, setPerformance] = useState([]);
    const [heatmap, setHeatmap] = useState([]);
    const [loading, setLoading] = useState(true);

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
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [statsRes, usersRes, perfRes, heatRes] = await Promise.all([
                axios.get('http://localhost:5001/api/admin/stats', config),
                axios.get('http://localhost:5001/api/admin/users/pending', config),
                axios.get('http://localhost:5001/api/analytics/performance', config),
                axios.get('http://localhost:5001/api/analytics/heatmap', config)
            ]);

            setStats(statsRes.data);
            setPendingUsers(usersRes.data);
            setPerformance(perfRes.data);
            setHeatmap(heatRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const approveUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5001/api/admin/users/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingUsers(pendingUsers.filter(u => u.id !== id));

            alert('Investigator approved successfully.');
        } catch (err) {
            alert('Approval failed. Please try again.');
        }
    };

    const handleExport = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/analytics/export/csv', {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob', // Important for file handling
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'crime_reports.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export Failed', err);
            alert('Export failed. Ensure you are an Admin.');
        }
    };

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-body pb-24">
            <Header />
            <main className="max-w-7xl mx-auto px-6 pt-16 animate-fade-in">
                <div className="flex flex-col gap-10">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2 bg-gradient-to-r from-red-900/20 to-purple-900/20 p-8 rounded-3xl border border-red-500/10">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-red-500">admin_panel_settings</span>
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">System Administration</span>
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-white">Command Center</h1>
                            <p className="text-red-200 mt-2 font-medium italic">Overview of system status and personnel.</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleExport} className="btn-secondary text-xs">
                                <span className="material-symbols-outlined text-lg">download</span>
                                Export Data
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-6 rounded-2xl border-white/5">
                            <h3 className="text-sm font-bold uppercase text-text-muted mb-2">Total Reports</h3>
                            <p className="text-4xl font-black text-white">{stats.reports}</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border-white/5">
                            <h3 className="text-sm font-bold uppercase text-text-muted mb-2">Active Investigations</h3>
                            <p className="text-4xl font-black text-white">{stats.investigations}</p>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border-white/5">
                            <h3 className="text-sm font-bold uppercase text-text-muted mb-2">Total Users</h3>
                            <p className="text-4xl font-black text-primary">{stats.users}</p>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass-card p-6 rounded-2xl border-white/5 h-[350px]">
                            <h3 className="text-sm font-bold uppercase text-text-muted mb-6">Crime Category Breakdown</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={crimeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                    <YAxis stroke="#94a3b8" fontSize={10} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20' }} />
                                    <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border-white/5 h-[350px]">
                            <h3 className="text-sm font-bold uppercase text-text-muted mb-6">Network Activity</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                                    <YAxis stroke="#94a3b8" fontSize={10} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20' }} />
                                    <Line type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Analytics Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass-card p-6 rounded-2xl border-white/5 h-[350px]">
                            <h3 className="text-sm font-bold uppercase text-text-muted mb-6">Investigator Performance</h3>
                            {performance.length === 0 ? (
                                <p className="text-text-muted text-sm">No data available.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height="90%">
                                    <BarChart data={performance}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                        <YAxis stroke="#94a3b8" fontSize={10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20' }} />
                                        <Bar dataKey="rate" fill="#a855f7" name="Resolution Rate (%)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <div className="glass-card p-6 rounded-2xl border-white/5">
                            <h3 className="text-sm font-bold uppercase text-text-muted mb-4">Crime Geographic Heatmap</h3>
                            <div className="h-[280px] bg-black/20 rounded-xl flex items-center justify-center border border-white/5 relative overflow-hidden">
                                {heatmap.length === 0 ? (
                                    <p className="text-sm text-text-muted">No heatmap data.</p>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                                        {heatmap.map((point, i) => (
                                            <div
                                                key={i}
                                                className="absolute size-2 rounded-full bg-red-500 blur-sm animate-pulse"
                                                style={{
                                                    // Mock positioning logic for demo since we don't have real map library installed yet
                                                    left: `${(point.lng - 70) * 10}%`,
                                                    top: `${(point.lat - 20) * 10}%`
                                                }}
                                                title={`Intensity: ${point.intensity}`}
                                            ></div>
                                        ))}
                                        <p className="relative z-10 text-xs text-text-muted bg-black/60 px-3 py-1 rounded-full">Live Spatial Data Visualization</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pending Approvals */}
                    <div className="glass-card p-8 rounded-2xl border-white/5">
                        <h3 className="text-lg font-bold text-white mb-6">Pending Access Requests</h3>
                        {pendingUsers.length === 0 ? (
                            <p className="text-text-muted">No pending requests.</p>
                        ) : (
                            <div className="grid gap-4">
                                {pendingUsers.map(u => (
                                    <div key={u.id} className="flex flex-col md:flex-row items-center justify-between bg-surface-dark border border-white/5 p-4 rounded-xl gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{u.name[0]}</div>
                                            <div>
                                                <h4 className="font-bold text-white">{u.name}</h4>
                                                <p className="text-xs text-text-muted">{u.email} • Badge: {u.badgeId}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => approveUser(u.id)} className="px-4 py-2 bg-green-500/10 text-green-500 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-green-500/20 transition-colors">Approve</button>
                                            <button className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-500/20 transition-colors">Reject</button>
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

export default AdminDashboard;
