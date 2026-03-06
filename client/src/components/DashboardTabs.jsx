import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navConfig = {
    citizen: [
        { label: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
        { label: 'Report Complaint', path: '/report-crime', icon: 'add_circle' },
        { label: 'Track Complaint', path: '/dashboard#reports', icon: 'track_changes' },
        { label: 'Complaint History', path: '/dashboard#reports', icon: 'history' },
        { label: 'Notifications', path: '/notifications', icon: 'notifications' },
        { label: 'Profile', path: '/profile', icon: 'person' },
    ],
    investigator: [
        { label: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
        { label: 'Assigned Cases', path: '/investigator/cases', icon: 'assignment' },
        { label: 'Investigation Reports', path: '/investigator/reports', icon: 'article' },
        { label: 'Evidence Management', path: '/investigator/evidence', icon: 'folder_shared' },
        { label: 'Messages', path: '/messages', icon: 'mail' },
        { label: 'Profile', path: '/profile', icon: 'person' },
    ],
    admin: [
        { label: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
        { label: 'User Management', path: '/admin/users', icon: 'group' },
        { label: 'Complaint Management', path: '/admin/complaints', icon: 'report' },
        { label: 'Case Assignment', path: '/admin/assignments', icon: 'assignment_ind' },
        { label: 'Analytics', path: '/admin/analytics', icon: 'analytics' },
        { label: 'System Settings', path: '/admin/settings', icon: 'settings' },
        { label: 'Reports', path: '/admin/reports', icon: 'assessment' },
    ]
};

const DashboardTabs = ({ role }) => {
    const location = useLocation();
    const links = navConfig[role] || [];

    return (
        <div className="w-full mb-12 mt-8">
            <div className="flex overflow-x-auto custom-scrollbar pb-4 gap-2 border-b border-border/50">
                {links.map((link, index) => {
                    const isActive = location.pathname === link.path && !link.path.includes('#'); // simplified active check

                    return (
                        <Link
                            key={index}
                            to={link.path}
                            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl transition-all whitespace-nowrap min-w-max text-sm font-bold tracking-wide
                                ${isActive
                                    ? 'bg-primary/10 text-primary border-b-2 border-primary'
                                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                                }
                            `}
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {link.icon}
                            </span>
                            {link.label}
                        </Link>
                    )
                })}
            </div>
        </div>
    );
};

export default DashboardTabs;
