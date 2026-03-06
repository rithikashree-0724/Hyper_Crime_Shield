import React from 'react';

const Hero = () => {
    return (
        <section className="@container">
            <div className="relative overflow-hidden rounded-xl bg-primary/5 border border-border">
                <div
                    className="flex min-h-[400px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-start justify-end px-6 pb-10 md:px-10"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(13, 20, 29, 0.4) 0%, rgba(13, 20, 29, 0.95) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCWOfw9tyBVtB7fUQNssKL5V09SqE775KgzWURqILMGD1rSLO7Z8dPZGAB-gmHBH2wSiAbDSjPga5lMR9n7eG_WdXFnQdhjpqzfRBaJt2RSK2KMiuD1loCISW-E6yNs5n3vxFYo2K4SKU_83wQcC6gVoXwCQ6TY1neA0C9vdFtl2RxsMnTb0wRKjee7mhFNtZJ2ylUZCfYRpPSAg6UWWlGrGvEFIqVx0LBNSFefDZWhI3X6f5-3SkJm2ot4iMrM0f-SLORBbRIacM3j")'
                    }}
                >
                    <div className="flex flex-col gap-3 text-left max-w-2xl relative z-10">
                        <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
                            Understanding Cybercrime
                        </h1>
                        <h2 className="text-white/80 text-sm font-normal leading-relaxed md:text-base lg:text-lg">
                            Stay informed about the current threat landscape. Learn how to identify, prevent, and report cyber incidents effectively to protect your digital assets.
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-4 relative z-10">
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-primary-light text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg shadow-primary/30">
                            <span className="truncate">Report a Crime</span>
                        </button>
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 text-base font-bold leading-normal tracking-[0.015em] transition-colors">
                            <span className="truncate">Download Guide</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
