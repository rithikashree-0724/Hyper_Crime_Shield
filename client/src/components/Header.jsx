import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Header = ({ user }) => {
    const location = useLocation();

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Resources', path: '/resources' },
        { label: 'How It Works', path: '/how-it-works' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Support', path: '/support' }
    ];

    return (
        <header className="glass-header sticky top-0 z-[100] w-full px-4 lg:px-10 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <Link to="/">
                        <Logo />
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'text-white bg-white/5' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/report-crime" className="btn-primary px-5 py-2 text-sm">
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        Report Incident
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10 h-8">
                            <div
                                className="size-8 rounded-full bg-surface-accent border border-white/10 bg-cover bg-center"
                                style={{ backgroundImage: `url(${user.profilePic || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop'})` }}
                            />
                        </div>
                    ) : (
                        <Link to="/login" className="text-sm font-semibold text-text-secondary hover:text-white transition-colors">Login</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
