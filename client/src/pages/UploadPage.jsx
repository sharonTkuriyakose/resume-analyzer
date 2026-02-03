import React from 'react';
import ResumeUpload from '../components/ResumeUpload';
import { 
  ShieldCheck, Map, Cpu, Zap, 
  Search, BarChart3, Globe, Sparkles,
  Award, Target, ArrowRight, CheckCircle2, Activity
} from 'lucide-react';

const UploadPage = ({ onAnalysisComplete }) => {
  const PEOPLE = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
  ];

  return (
    <div className="min-h-screen w-full bg-[#0A0C10] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden pt-12">
      {/* GLOBAL CSS RESET */}
      <style dangerouslySetInnerHTML={{ __html: `
        html, body, #root { 
          margin: 0 !important; 
          padding: 0 !important; 
          background-color: #0A0C10 !important; 
          width: 100%;
          min-height: 100%;
        }
      `}} />

      <div className="max-w-[1700px] mx-auto px-12 space-y-48">
        
        {/* 1. TOP SYSTEM STATUS (Replaces the redundant Nav) */}
        <div className="flex justify-between items-center pb-8 border-b border-white/5">
            <div className="flex items-center gap-4 text-white-500 font-black text-xl uppercase tracking-[0.4em]">
                <Activity className="w-5 h-5 text-indigo-500" /> System Neural Link Active
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" /> Groq Engine Online
                </div>
                <div className="px-6 py-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-sm font-black uppercase tracking-[0.2em] text-white">
                    v2.0 Scan Ready
                </div>
            </div>
        </div>

        {/* 2. HERO SECTION */}
        <section className="grid lg:grid-cols-12 gap-24 items-center min-h-[60vh]">
          <div className="lg:col-span-7 space-y-14">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-lg">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <span className="text-sm font-black uppercase tracking-[0.3em] text-white">
                Next-Gen MERN Intelligence
              </span>
            </div>

            <h1 className="text-9xl font-black text-white leading-[0.9] tracking-tighter">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">Professional Path.</span>
            </h1>

            <div className="space-y-8">
                <p className="text-2xl text-slate-400 max-w-2xl leading-relaxed font-medium">
                Instantly detect skill gaps in your profile and generate an automated, 
                project-based learning roadmap to reach your career goals.
                </p>
                {/* STRATEGIC CONTENT: Fills the gap and adds professional value */}
                <div className="flex flex-wrap gap-8 pt-4">
                    <div className="flex items-center gap-3 text-slate-300 font-bold text-sm uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                        <Zap className="w-4 h-4 text-indigo-500" /> Real-time Benchmarking
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 font-bold text-sm uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                        <BarChart3 className="w-4 h-4 text-indigo-500" /> Competency Scoring
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 font-bold text-sm uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                        <Globe className="w-4 h-4 text-indigo-500" /> Global Standards
                    </div>
                </div>
            </div>

            {/* Proof of Concept Avatars */}
            <div className="flex items-center gap-12 pt-10">
              <div className="flex -space-x-6">
                {PEOPLE.map((url, i) => (
                  <div key={i} className="w-20 h-20 rounded-full border-[8px] border-[#0A0C10] shadow-2xl overflow-hidden relative group">
                    <img src={url} alt="User" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 scale-110" />
                  </div>
                ))}
                <div className="w-20 h-20 rounded-full border-[8px] border-[#0A0C10] bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-2xl">
                  +500
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-black text-white tracking-tight">500+ Professionals</p>
                <p className="text-base text-slate-500 font-bold uppercase tracking-widest">Daily Analysis Active</p>
              </div>
            </div>
          </div>

          {/* UPLOAD CARD */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-24 bg-indigo-600/10 blur-[140px] rounded-full -z-10 animate-pulse"></div>
            <div className="bg-white/[0.03] backdrop-blur-3xl p-16 rounded-[4.5rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative">
              <div className="absolute top-12 right-16">
                 <div className="bg-emerald-500 w-4 h-4 rounded-full animate-ping shadow-[0_0_20px_rgba(16,185,129,0.6)]" />
              </div>
              <ResumeUpload onResult={onAnalysisComplete} />
            </div>
          </div>
        </section>

        {/* 3. FEATURE BENTO GRID */}
        <section className="space-y-24">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="px-8 py-3 bg-white/5 border border-white/10 text-slate-400 rounded-2xl text-sm font-black uppercase tracking-[0.4em]">
              System Architecture
            </div>
            <h2 className="text-7xl font-black text-white tracking-tight uppercase">Full-Stack Intelligence</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: <Search className="w-9 h-9" />, 
                title: "Deep Scan", 
                desc: "Scanning MERN & UI/UX competencies with high-precision parsing logic.",
                color: "text-indigo-400"
              },
              { 
                icon: <Target className="w-9 h-9" />, 
                title: "Gap Detection", 
                desc: "Identifying exactly which tools and frameworks are missing from your stack.",
                color: "text-amber-400"
              },
              { 
                icon: <Map className="w-9 h-9" />, 
                title: "Live Roadmap", 
                desc: "Personalized learning paths with documentation and YouTube resources.",
                color: "text-emerald-400"
              }
            ].map((feature, i) => (
              <div key={i} className="group bg-white/[0.02] p-14 rounded-[4rem] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-700 shadow-xl">
                <div className={`w-24 h-24 bg-white/5 ${feature.color} rounded-3xl flex items-center justify-center mb-12 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-xl font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. SYSTEM STATS */}
        <section className="bg-white/[0.03] border border-white/5 rounded-[6rem] p-28 text-white grid md:grid-cols-4 gap-20 text-center relative overflow-hidden shadow-2xl mb-24">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
          {[
            { label: "Skills Analyzed", val: "50+", icon: <Cpu className="w-5 h-5" /> },
            { label: "Accuracy Rate", val: "99%", icon: <Award className="w-5 h-5" /> },
            { label: "Analysis Time", val: "1.2s", icon: <Zap className="w-5 h-5" /> },
            { label: "Global Reach", val: "24/7", icon: <Globe className="w-5 h-5" /> }
          ].map((stat, i) => (
            <div key={i} className="space-y-8 relative z-10">
              <div className="flex items-center justify-center gap-4 text-indigo-400/60">
                 {stat.icon}
                 <span className="text-base font-black uppercase tracking-[0.3em]">{stat.label}</span>
              </div>
              <h4 className="text-8xl font-black tracking-tighter text-white">{stat.val}</h4>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
};

export default UploadPage;