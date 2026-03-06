import React from 'react';

const Sidebar = () => {
    return (
        <aside className="hidden lg:flex w-[260px] flex-col shrink-0">
            <div className="sticky top-24 flex flex-col gap-4">
                <div className="flex flex-col px-4">
                    <h1 className="text-text-primary text-base font-bold leading-normal">Table of Contents</h1>
                    <p className="text-text-secondary text-sm font-normal leading-normal">Quick Navigation</p>
                </div>
                <nav className="flex flex-col gap-2">
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-text-primary hover:bg-primary/20 transition-colors group" href="#threats">
                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">warning</span>
                        <p className="text-sm font-medium leading-normal">Common Threats</p>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-primary/5 hover:text-text-primary transition-colors group" href="#prevention">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">shield</span>
                        <p className="text-sm font-medium leading-normal">Prevention Tips</p>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-primary/5 hover:text-text-primary transition-colors group" href="#response">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">e911_emergency</span>
                        <p className="text-sm font-medium leading-normal">Incident Response</p>
                    </a>
                </nav>
                <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <h3 className="text-primary font-bold text-sm mb-2">Emergency?</h3>
                    <p className="text-xs text-text-muted mb-3">If you are currently under attack, contact the hotline immediately.</p>
                    <button className="w-full py-2 bg-primary hover:bg-primary-light text-white text-sm font-bold rounded-lg transition-colors">
                        Call Support
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
