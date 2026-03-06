import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';

const Header = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Report', path: '/report-crime' },
        { label: 'Track', path: '/dashboard' },
        { label: 'Info', path: '/resources' },
        { label: 'Alerts', path: '/alerts' }
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 flex justify-center pt-5 ${isScrolled ? 'px-4' : 'px-12'}`}>
            <div className={`flex items-center w-full max-w-7xl px-12 py-5 transition-all duration-500 rounded-[32px] ${isScrolled
                ? 'glass-card shadow-2xl bg-surface/90 border-primary/20 scale-[1.02]'
                : 'bg-transparent border-transparent'
                }`}>

                {/* Logo Section - Fixed Width/Scale */}
                <div className="flex-1 flex justify-start">
                    <div className="scale-[0.9] md:scale-110 origin-left shrink-0">
                        <Link to="/">
                            <Logo />
                        </Link>
                    </div>
                </div>

                {/* Floating Navigation Menu (Truly Centered & Condensed) */}
                <nav className="hidden lg:flex items-center bg-surface/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[22px] px-2 py-2 shadow-lg shrink-0">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-4 py-2.5 rounded-2xl text-[12px] font-black uppercase tracking-[0.1em] transition-all duration-300 relative flex items-center ${location.pathname === link.path
                                ? 'text-primary bg-primary/5'
                                : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                }`}
                        >
                            {link.label}
                            {location.pathname === link.path && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-primary" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Action Controls - Fixed Width/Scale */}
                <div className="flex-1 flex justify-end items-center gap-4">
                    {user && <NotificationBell />}

                    <button
                        onClick={toggleTheme}
                        className="size-13 flex items-center justify-center rounded-3xl glass-card text-text-primary hover:text-primary transition-all active:scale-90"
                        title="Toggle Theme"
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>

                    <div className="h-8 w-px bg-white/10 mx-1" />

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile">
                                <div
                                    className="size-12 rounded-2xl bg-surface-accent border-2 border-primary/20 bg-cover bg-center transition-transform hover:scale-110"
                                    style={{ backgroundImage: `url(${user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || user.name}`})` }}
                                />
                            </Link>
                            <button onClick={logout} className="text-[12px] font-black uppercase tracking-widest text-red-500 hover:opacity-80 transition-opacity">
                                Exit
                            </button>
                        </div>
                    ) : (
                        <Link to="/register" className="px-10 py-4 bg-primary text-white rounded-3xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all">
                            Join Node
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
