import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import * as API_SERVICE from '../api';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [userData, setUserData] = useState({ name: '', email: '', phone: '', role: '', isVerified: false, isTwoFactorEnabled: false });
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showVerify, setShowVerify] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [loginHistory, setLoginHistory] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProfile();
        if (activeTab === 'history') {
            fetchLoginHistory();
        }
    }, [activeTab]);

    useEffect(() => {
        if (!profileImage) {
            setImagePreview(null);
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(profileImage);
    }, [profileImage]);

    const fetchProfile = async () => {
        try {
            const { data } = await API_SERVICE.getProfile();
            if (data.success) {
                setUserData(data.data);
                setUser(data.data); // Sync global context
                setFormData({ name: data.data.name || '', email: data.data.email || '', phone: data.data.phone || '' });
            }
        } catch (err) {
            showMessage('error', 'Failed to load profile');
        }
    };

    const fetchLoginHistory = async () => {
        try {
            const { data } = await API_SERVICE.getLoginHistory();
            if (data.success && Array.isArray(data.data)) {
                setLoginHistory(data.data);
            } else {
                setLoginHistory([]);
            }
        } catch (err) {
            console.error('Failed to fetch login history', err);
            setLoginHistory([]);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            if (profileImage) {
                data.append('profileImage', profileImage);
            }

            const res = await API_SERVICE.updateProfile(data);
            setUserData(res.data.user);
            setUser(res.data.user); // Update global state
            setEditMode(false);
            setProfileImage(null);
            showMessage('success', 'Profile updated successfully!');
        } catch (err) {
            showMessage('error', err.response?.data?.message || 'Failed to update profile');
        }
        setLoading(false);
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage('error', 'Passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            showMessage('error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await API_SERVICE.updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showMessage('success', 'Password changed successfully!');
        } catch (err) {
            showMessage('error', err.response?.data?.message || 'Failed to change password');
        }
        setLoading(false);
    };

    const handleEnable2FA = async () => {
        setLoading(true);
        try {
            await API_SERVICE.setup2FA();
            setShowVerify(true);
            showMessage('success', 'Verification OTP sent to your email!');
        } catch (err) {
            showMessage('error', err.response?.data?.message || 'Failed to enable 2FA');
        }
        setLoading(false);
    };

    const handleDisable2FA = async () => {
        setLoading(true);
        try {
            await API_SERVICE.disable2FA();
            setUserData({ ...userData, isTwoFactorEnabled: false });
            showMessage('success', '2FA Disabled');
        } catch (err) {
            showMessage('error', 'Failed to disable 2FA');
        }
        setLoading(false);
    };

    const handleVerify2FA = async () => {
        if (twoFactorCode.length !== 6) {
            showMessage('error', 'Please enter a 6-digit code');
            return;
        }

        setLoading(true);
        try {
            await API_SERVICE.verify2FA(twoFactorCode);
            setUserData({ ...userData, isTwoFactorEnabled: true });
            setUser({ ...user, isTwoFactorEnabled: true });
            setShowVerify(false);
            setTwoFactorCode('');
            showMessage('success', '2FA enabled successfully!');
        } catch (err) {
            showMessage('error', err.response?.data?.message || 'Verification failed');
        }
        setLoading(false);
    };

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-red-500/20 text-red-500 border-red-500/30',
            investigator: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
            citizen: 'bg-green-500/20 text-green-500 border-green-500/30'
        };
        return styles[role] || styles.citizen;
    };

    return (
        <div className="min-h-screen bg-background text-text-primary font-body">
            <Header />
            <main className="max-w-6xl mx-auto px-6 pt-[160px] pb-12">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary">account_circle</span>
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em]">Account Management</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Profile Settings</h1>
                    <p className="text-text-secondary mt-2 font-medium">Manage your account security and personal information</p>
                </div>

                {/* Message Banner */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        : 'bg-red-500/10 border-red-500/20 text-red-500'
                        } animate-fade-in flex items-center gap-3`}>
                        <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                        <p className="text-sm font-bold">{message.text}</p>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-border">
                    {[
                        { id: 'profile', label: 'Profile Info', icon: 'person' },
                        { id: 'security', label: 'Security', icon: 'security' },
                        { id: 'password', label: 'Password', icon: 'key' },
                        { id: 'history', label: 'Login History', icon: 'history' },
                        { id: 'privacy', label: 'Privacy', icon: 'lock' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-t-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-primary/10 text-text-primary border-b-2 border-primary'
                                : 'text-text-muted hover:text-text-primary hover:bg-primary/5'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="grid gap-8">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="glass-card p-8 rounded-2xl">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <div className="size-24 rounded-full bg-primary/5 border-2 border-border overflow-hidden flex items-center justify-center bg-cover bg-center"
                                            style={(imagePreview || userData.profileImage) ? { backgroundImage: `url(${imagePreview || userData.profileImage})` } : { backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email || userData.name})` }}>
                                            {!(imagePreview || userData.profileImage || userData.email || userData.name) && (
                                                <span className="material-symbols-outlined text-4xl text-text-muted">person</span>
                                            )}
                                        </div>
                                        {editMode && (
                                            <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => setProfileImage(e.target.files[0])}
                                                />
                                                <span className="material-symbols-outlined text-white">camera_alt</span>
                                            </label>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">Personal Information</h2>
                                        <p className="text-sm text-text-secondary">Update your account details</p>
                                    </div>
                                </div>
                                {!editMode && (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">edit</span>
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Full Name</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-lg font-bold">{userData.name || 'Not set'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Email Address</label>
                                    {editMode ? (
                                        <input
                                            type="email"
                                            className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-lg font-bold flex items-center gap-2">
                                            {userData.email || 'Not set'}
                                            {userData.isVerified && (
                                                <span className="material-symbols-outlined text-green-500 text-sm">verified</span>
                                            )}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Phone Number</label>
                                    {editMode ? (
                                        <input
                                            type="tel"
                                            className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+91 98765 43210"
                                        />
                                    ) : (
                                        <p className="text-lg font-bold">{userData.phone || 'Not set'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Account Role</label>
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider ${getRoleBadge(userData.role)}`}>
                                        <span className="material-symbols-outlined text-sm">badge</span>
                                        {userData.role || 'Citizen'}
                                    </span>
                                </div>
                            </div>

                            {editMode && (
                                <div className="flex gap-3 mt-8">
                                    <button
                                        onClick={handleUpdateProfile}
                                        disabled={loading}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                        <span className="material-symbols-outlined">check</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData({ name: userData.name, phone: userData.phone });
                                        }}
                                        className="px-6 py-3 rounded-xl bg-primary/5 border border-border text-sm font-bold uppercase tracking-widest hover:bg-primary/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="glass-card p-8 rounded-2xl">
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">shield</span>
                                Two-Factor Authentication
                            </h2>
                            <p className="text-sm text-text-secondary mb-8">Add an extra layer of security to your account</p>

                            <div className="p-6 bg-primary/5 rounded-xl border border-border mb-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-bold mb-1">Email Authentication</h3>
                                        <p className="text-xs text-text-secondary">Receive a 6-digit code on your email for every login</p>
                                    </div>
                                    {userData.isTwoFactorEnabled ? (
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                                Enabled
                                            </span>
                                            <button onClick={handleDisable2FA} className="text-red-500 text-xs ml-4">Disable</button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleEnable2FA}
                                            disabled={loading}
                                            className="btn-primary text-xs px-4 py-2"
                                        >
                                            {loading ? 'Processing...' : 'Enable Email 2FA'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {showVerify && (
                                <div className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 animate-fade-in">
                                    <div className="flex flex-col items-center text-center">
                                        <span className="material-symbols-outlined text-6xl text-primary mb-4">sms</span>
                                        <h3 className="text-xl font-bold mb-2">Verify Email Address</h3>
                                        <p className="text-sm text-text-secondary mb-6 max-w-md">
                                            We've sent a 6-digit verification code to your email. Enter it below to enable 2FA.
                                        </p>

                                        <div className="flex gap-2 w-full max-w-sm">
                                            <input
                                                type="text"
                                                maxLength="6"
                                                placeholder="000000"
                                                className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 text-center font-mono text-2xl tracking-[0.5em]"
                                                value={twoFactorCode}
                                                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                            />
                                            <button
                                                onClick={handleVerify2FA}
                                                disabled={loading || twoFactorCode.length !== 6}
                                                className="btn-primary whitespace-nowrap px-6"
                                            >
                                                {loading ? 'Verifying...' : 'Verify'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <div className="glass-card p-8 rounded-2xl">
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">password</span>
                                Change Password
                            </h2>
                            <p className="text-sm text-text-secondary mb-8">Update your password to keep your account secure</p>

                            <div className="max-w-md grid gap-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Current Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="Enter new password (min. 6 characters)"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2 block">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-primary/5 border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 text-sm"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="Confirm new password"
                                    />
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                    className="btn-primary flex items-center gap-2 justify-center"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                    <span className="material-symbols-outlined">check</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Login History Tab */}
                    {activeTab === 'history' && (
                        <div className="glass-card p-8 rounded-2xl">
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history</span>
                                Recent Login Activity
                            </h2>
                            <p className="text-sm text-text-secondary mb-8">Monitor your account access and security</p>

                            <div className="space-y-4">
                                {loginHistory.length === 0 ? (
                                    <div className="text-center py-12">
                                        <span className="material-symbols-outlined text-6xl text-text-muted opacity-20">history</span>
                                        <p className="mt-4 text-text-muted">No login history available</p>
                                    </div>
                                ) : (
                                    [...loginHistory]
                                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                                        .slice(0, 10)
                                        .map((login, i) => (
                                            <div key={i} className="p-4 bg-primary/5 rounded-xl border border-border hover:bg-primary/10 transition-all">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex gap-3">
                                                        <div className="size-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-blue-500">login</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm">{login.ip || 'Unknown IP'}</p>
                                                            <p className="text-xs text-text-secondary mt-1">
                                                                {new Date(login.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {i === 0 && (
                                                        <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                                            Latest Activity
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <div className="glass-card p-8 rounded-2xl animate-fade-in">
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">gavel</span>
                                Privacy & Data Protection
                            </h2>
                            <p className="text-sm text-text-secondary mb-8">Manage your digital footprint and compliance rights</p>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-6 bg-primary/5 rounded-xl border border-border">
                                    <h3 className="font-bold mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">download</span>
                                        Export My Data
                                    </h3>
                                    <p className="text-xs text-text-secondary mb-6">Download all your personal information, reports, and activity logs in your preferred format.</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={async () => {
                                                const res = await API_SERVICE.exportData('pdf');
                                                const url = window.URL.createObjectURL(new Blob([res.data]));
                                                const link = document.createElement('a');
                                                link.href = url;
                                                link.setAttribute('download', 'my_data.pdf');
                                                document.body.appendChild(link);
                                                link.click();
                                            }}
                                            className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
                                        >
                                            PDF Format
                                        </button>
                                        <button
                                            onClick={async () => {
                                                const res = await API_SERVICE.exportData('excel');
                                                const url = window.URL.createObjectURL(new Blob([res.data]));
                                                const link = document.createElement('a');
                                                link.href = url;
                                                link.setAttribute('download', 'my_data.xlsx');
                                                document.body.appendChild(link);
                                                link.click();
                                            }}
                                            className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
                                        >
                                            Excel Format
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 bg-red-500/5 rounded-xl border border-red-500/10">
                                    <h3 className="font-bold mb-2 text-red-500 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">delete_forever</span>
                                        Danger Zone
                                    </h3>
                                    <p className="text-xs text-text-secondary mb-6 italic">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('CRITICAL: Are you sure you want to permanently delete your account? This will remove all your reports and activity logs.')) {
                                                try {
                                                    await API_SERVICE.deleteAccount();
                                                    alert('Account deleted. Redirecting...');
                                                    window.location.href = '/';
                                                } catch (err) {
                                                    alert('Deletion failed.');
                                                }
                                            }
                                        }}
                                        className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                                    >
                                        Delete My Account
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

export default Profile;
