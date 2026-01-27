import React from 'react';
import logoImage from '../assets/logo.png';

const Logo = () => {
    return (
        <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative size-12 flex items-center justify-center transition-all duration-700 group-hover:scale-110">
                {/* Electric Mesh Glow */}
                <div className="absolute inset-0 bg-accent-cyan/20 rounded-full blur-2xl opacity-40 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 bg-accent-violet/10 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity"></div>

                <img
                    src={logoImage}
                    alt="Hyper Crime Shield"
                    className="w-full h-full object-contain relative z-10"
                />
            </div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-black tracking-tighter text-white font-display leading-[0.85]">
                    Hyper <span className="text-accent-cyan">Guard</span>
                </h1>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Crime Shield System</p>
            </div>
        </div>
    );
};

export default Logo;
