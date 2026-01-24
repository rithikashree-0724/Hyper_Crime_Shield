import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import heroImage from '../assets/hero.png';

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-accent-cyan/20 bg-[#060a0f] text-slate-100 font-body">
      
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-cyan/10 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[50%] bg-accent-violet/10 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] left-[60%] w-[30%] h-[30%] bg-accent-emerald/5 rounded-full blur-[100px]" />
      </div>

      <Header />

      {/* HERO */}
      <main className="relative z-10 pt-2">
        <section className="px-6 py-8 md:py-12">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">

            {/* Left */}
            <div className="flex flex-col gap-4 animate-fade-in text-center lg:text-left">

              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-cyan/10 border border-accent-cyan/20 rounded-full w-fit mx-auto lg:mx-0 shadow-[0_0_20px_rgba(0,245,255,0.1)]">
                <span className="size-2 rounded-full bg-accent-cyan animate-pulse" />
                <span className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.2em]">
                  Independent Defense Node v4.0
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter text-white">
                Shielding the <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-emerald">
                  Privatized Grid.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                We are the Shield Alliance. An elite coalition providing non-governmental threat
                neutralization and digital sovereignty for the global elite and decentralized nodes.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link
                  to="/report-crime"
                  className="h-14 px-8 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-blue text-slate-950 font-black uppercase tracking-widest text-sm shadow-xl shadow-accent-cyan/20 hover:scale-[1.02] transition-transform flex items-center gap-3 group"
                >
                  Initiate Intake
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                    rocket_launch
                  </span>
                </Link>

                <Link
                  to="/how-it-works"
                  className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center"
                >
                  Our Sovereignty
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-6 border-t border-white/5 mt-2 text-center lg:text-left">
                <div>
                  <p className="text-3xl font-black text-white tracking-tighter">0%</p>
                  <p className="text-[10px] text-accent-cyan font-black uppercase tracking-widest mt-1">Gvt. Oversight</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-white tracking-tighter">100%</p>
                  <p className="text-[10px] text-accent-violet font-black uppercase tracking-widest mt-1">Data Sovereignty</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-3xl font-black text-white tracking-tighter">∞</p>
                  <p className="text-[10px] text-accent-emerald font-black uppercase tracking-widest mt-1">Encrypted Uptime</p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="relative animate-fade-in -mt-6" style={{ animationDelay: '0.3s' }}>
              <div className="absolute -top-10 -right-10 size-40 bg-accent-cyan/20 rounded-full blur-3xl animate-float" />
              <div className="absolute -bottom-10 -left-10 size-40 bg-accent-violet/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

              <div className="relative glass-card p-3 rounded-[40px] border-white/10 group overflow-hidden shadow-2xl backdrop-blur-xl">
                <img
                  src={heroImage}
                  alt="Elite Node Monitoring"
                  className="rounded-[32px] w-full shadow-2xl brightness-110 contrast-110 group-hover:scale-[1.03] transition-transform duration-1000"
                />

                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-[#060a0f]/90 via-[#060a0f]/40 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="size-3 rounded-full bg-accent-cyan shadow-[0_0_15px_rgba(0,245,255,0.8)] animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-accent-cyan">
                      VOID_LINK: ACTIVE_NODES_999+
                    </span>
                  </div>
                </div>

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent animate-[scan_4s_linear_infinite]" />
              </div>
            </div>

          </div>
        </section>

        {/* FEATURES */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] font-black uppercase tracking-[1em] text-accent-violet">
                Elite_Protocols
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-5 tracking-tight">
                The Independent <span className="italic text-accent-emerald">Counter-Measure.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Zero-Knowledge Logs', desc: 'Secure reporting where even we cannot decrypt your identity meta-tags.', icon: 'lock_open', color: 'text-accent-cyan' },
                { title: 'Kinetic Containment', desc: 'Rapid digital-to-physical node isolation via private responder networks.', icon: 'bolt', color: 'text-accent-violet' },
                { title: 'VoidSync Archive', desc: 'Encrypted telemetry mirrored across 7 global independent data silos.', icon: 'cloud_sync', color: 'text-accent-emerald' }
              ].map((f, i) => (
                <div key={i} className="glass-card p-10 rounded-[40px] group hover:bg-white/[0.04] transition-all border-white/5 relative overflow-hidden">
                  <div className={`size-14 bg-white/5 rounded-2xl flex items-center justify-center ${f.color} mb-8 group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                  </div>
                  <h3 className="text-xl font-black mb-3 tracking-tight text-white">{f.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed font-medium">{f.desc}</p>
                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-current opacity-20 ${f.color}`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
