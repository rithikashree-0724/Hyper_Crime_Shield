import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LockdownAlert = () => {
    const { isLockdown, toggleLockdown } = useContext(AuthContext);

    if (!isLockdown) return null;

    return (
        <div className="fixed top-0 left-0 w-full z-[100] bg-red-600 text-white px-4 py-3 flex items-center justify-between shadow-2xl animate-pulse">
            <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">emergency_home</span>
                <div>
                    <h3 className="font-black text-sm uppercase tracking-widest">System Lockdown Active</h3>
                    <p className="text-xs text-red-100">All outbound communications are being spoofed and logged. Physical response units dispatched.</p>
                </div>
            </div>
            <button
                onClick={toggleLockdown}
                className="bg-white text-red-600 px-4 py-1.5 rounded text-xs font-bold hover:bg-red-50 transition-colors"
            >
                TERMINATE LOCKDOWN
            </button>
        </div>
    );
};

export default LockdownAlert;
