import React from 'react';

const Sidebar = () => {
    return (
        <aside className="hidden lg:flex w-[260px] flex-col shrink-0">
            <div className="sticky top-24 flex flex-col gap-4">
                <div className="flex flex-col px-4">
                    <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">Table of Contents</h1>
                    <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-normal leading-normal">Quick Navigation</p>
                </div>
                <nav className="flex flex-col gap-2">
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-200 dark:bg-[#283039] text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors group" href="#threats">
                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">warning</span>
                        <p className="text-sm font-medium leading-normal">Common Threats</p>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#283039] hover:text-slate-900 dark:hover:text-white transition-colors group" href="#prevention">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">shield</span>
                        <p className="text-sm font-medium leading-normal">Prevention Tips</p>
                    </a>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#283039] hover:text-slate-900 dark:hover:text-white transition-colors group" href="#response">
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">e911_emergency</span>
                        <p className="text-sm font-medium leading-normal">Incident Response</p>
                    </a>
                </nav>
                <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <h3 className="text-primary font-bold text-sm mb-2">Emergency?</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">If you are currently under attack, contact the hotline immediately.</p>
                    <button className="w-full py-2 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors">
                        Call Support
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
