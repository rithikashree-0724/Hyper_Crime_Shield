import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutOriginal from '../components/AboutOriginal';
import CategoriesOriginal from '../components/CategoriesOriginal';
import HowItWorksOriginal from '../components/HowItWorksOriginal';
import FeaturesOriginal from '../components/FeaturesOriginal';
import SafetyTipsOriginal from '../components/SafetyTipsOriginal';
import EmergencyContactOriginal from '../components/EmergencyContactOriginal';
import CallToActionOriginal from '../components/CallToActionOriginal';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';

const Home = () => {
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-accent-cyan/20 bg-background text-text-primary font-body transition-colors duration-300">

      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-70 dark:opacity-100">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-cyan/10 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[50%] bg-accent-violet/10 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] left-[60%] w-[30%] h-[30%] bg-accent-emerald/5 rounded-full blur-[100px]" />
      </div>

      <Header />

      {/* 1. Hero Section */}
      <main className="relative z-10">
        <section className="min-h-[85vh] flex items-center px-6 pt-32 pb-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 sm:gap-24 items-center w-full">
            {/* Left */}
            <div className="flex flex-col gap-8 animate-fade-in text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-cyan/10 border border-accent-cyan/20 rounded-full w-fit mx-auto lg:mx-0 shadow-[0_0_20px_rgba(0,245,255,0.1)]">
                <span className="size-2 rounded-full bg-accent-cyan animate-pulse" />
                <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.2em]">
                  Cyber Compliance Node
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.2] tracking-tight font-display">
                Protecting Citizens from <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-emerald leading-[1.4] inline-block mt-2">
                  Cyber Crime.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium opacity-90">
                We provide a professional, secure platform for citizens to report digital incidents and connect with authorized investigators to resolve cases with efficiency.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  to="/report-crime"
                  className="h-14 px-8 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-blue text-slate-950 font-black uppercase tracking-widest text-sm shadow-xl shadow-accent-cyan/20 hover:scale-[1.02] transition-transform flex items-center gap-3 group"
                >
                  Report Cyber Crime
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                    rocket_launch
                  </span>
                </Link>

                <Link
                  to="/dashboard"
                  className="h-14 px-8 rounded-2xl btn-secondary"
                >
                  Track Complaint
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 pt-10 border-t border-white/5 mt-6 text-center lg:text-left">
                <div>
                  <p className="text-3xl font-black tracking-tighter">24/7</p>
                  <p className="text-[10px] text-accent-cyan font-black uppercase tracking-widest mt-1">Monitoring</p>
                </div>
                <div>
                  <p className="text-3xl font-black tracking-tighter">100%</p>
                  <p className="text-[10px] text-accent-violet font-black uppercase tracking-widest mt-1">Encryption</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-3xl font-black tracking-tighter">Verified</p>
                  <p className="text-[10px] text-accent-emerald font-black uppercase tracking-widest mt-1">Investigations</p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="relative animate-fade-in -mt-6" style={{ animationDelay: '0.3s' }}>
              <div className="relative glass-card p-3 rounded-[40px] group overflow-hidden shadow-2xl backdrop-blur-xl border-white/5">
                <img
                  src={heroImage}
                  alt="Cyber Protection Visualization"
                  className="rounded-[32px] w-full shadow-2xl transition-transform duration-1000 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-background/90 via-background/40 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="size-3 rounded-full bg-accent-cyan shadow-[0_0_15px_rgba(0,245,255,0.8)] animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-accent-cyan">
                      Protection Pulse Active
                    </span>
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent animate-[scan_4s_linear_infinite]" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. About the Platform */}
        <div className="reveal py-24"><AboutOriginal /></div>

        {/* 3. Cybercrime Categories */}
        <div className="reveal py-24"><CategoriesOriginal /></div>

        {/* 4. How It Works */}
        <div className="reveal py-24"><HowItWorksOriginal /></div>

        {/* 5. Key Features */}
        <div className="reveal py-24"><FeaturesOriginal /></div>

        {/* 6. Cyber Safety Tips */}
        <div className="reveal py-24"><SafetyTipsOriginal /></div>

        {/* 7. Emergency Contact */}
        <div className="reveal py-24"><EmergencyContactOriginal /></div>

        {/* 9. Call to Action */}
        <div className="reveal py-24"><CallToActionOriginal /></div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
