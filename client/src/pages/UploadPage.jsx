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

  // ✅ DYNAMIC API CONFIGURATION
  // This ensures your phone connects to Render while your PC can still use Localhost
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div className="min-h-screen w-full bg-[#0A0C10] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden pt-8 md:pt-12">
      <style dangerouslySetInnerHTML={{ __html: `
        html, body, #root { 
          margin: 0 !important; 
          padding: 0 !important; 
          background-color: #0A0C10 !important; 
          width: 100%;
          min-height: 100%;
        }
      `}} />

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 space-y-24 md:space-y-48">
        
        <div className="flex flex-col sm:flex-row justify-between items-center pb-6 md:pb-8 border-b border-white/5 gap-4">
            <div className="flex items-center gap-4 text-white font-black text-sm md:text-xl uppercase tracking-[0.2em] md:tracking-[0.4em] text-center">
                <Activity className="w-5 h-5 text-indigo-500" /> System Neural Link Active
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs md:text-sm uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" /> Groq Engine Online
                </div>
                <div className="px-4 md:px-6 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-white">
                    v2.0 Scan Ready
                </div>
            </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-7 space-y-8 md:space-y-14 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 md:px-6 py-2 md:py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-indigo-400 animate-pulse" />
              <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white">
                Next-Gen MERN Intelligence
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-white leading-tight lg:leading-[0.9] tracking-tighter">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">Professional Path.</span>
            </h1>

            <div className="space-y-6 md:space-y-8">
                <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Instantly detect skill gaps in your profile and generate an automated, 
                  project-based learning roadmap to reach your career goals.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8 pt-4">
                    <div className="flex items-center gap-2 text-slate-300 font-bold text-[10px] md:text-sm uppercase tracking-widest bg-white/5 px-3 md:px-4 py-2 rounded-lg border border-white/5">
                        <Zap className="w-4 h-4 text-indigo-500" /> Benchmarking
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 font-bold text-[10px] md:text-sm uppercase tracking-widest bg-white/5 px-3 md:px-4 py-2 rounded-lg border border-white/5">
                        <BarChart3 className="w-4 h-4 text-indigo-500" /> Scoring
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 font-bold text-[10px] md:text-sm uppercase tracking-widest bg-white/5 px-3 md:px-4 py-2 rounded-lg border border-white/5">
                        <Globe className="w-4 h-4 text-indigo-500" /> Standards
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 md:gap-12 pt-6 md:pt-10">
              <div className="flex -space-x-4 md:-space-x-6">
                {PEOPLE.map((url, i) => (
                  <div key={i} className="w-12 h-12 md:w-20 md:h-20 rounded-full border-[4px] md:border-[8px] border-[#0A0C10] shadow-2xl overflow-hidden relative group">
                    <img src={url} alt="User" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                ))}
                <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border-[4px] md:border-[8px] border-[#0A0C10] bg-indigo-600 flex items-center justify-center text-white text-[10px] md:text-sm font-black shadow-2xl">
                  +500
                </div>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-xl md:text-3xl font-black text-white tracking-tight">500+ Professionals</p>
                <p className="text-[10px] md:text-base text-slate-500 font-bold uppercase tracking-widest">Daily Analysis Active</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-12 md:-inset-24 bg-indigo-600/10 blur-[80px] md:blur-[140px] rounded-full -z-10 animate-pulse"></div>
            <div className="bg-white/[0.03] backdrop-blur-3xl p-8 sm:p-12 md:p-16 rounded-[2.5rem] md:rounded-[4.5rem] border border-white/10 shadow-2xl relative">
              <div className="absolute top-8 right-8 md:top-12 md:right-16">
                 <div className="bg-emerald-500 w-3 h-3 md:w-4 md:h-4 rounded-full animate-ping" />
              </div>
              {/* ✅ Passing the Dynamic URL to the Upload Component */}
              <ResumeUpload 
                onResult={onAnalysisComplete} 
                apiUrl={API_BASE_URL} 
              />
            </div>
          </div>
        </section>

        <section className="space-y-12 md:space-y-24">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-8">
            <div className="px-6 md:px-8 py-2 md:py-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.4em]">
              System Architecture
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight uppercase text-center">Full-Stack Intelligence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { 
                icon: <Search className="w-7 h-7 md:w-9 md:h-9" />, 
                title: "Deep Scan", 
                desc: "Scanning MERN & UI/UX competencies with high-precision parsing logic.",
                color: "text-indigo-400"
              },
              { 
                icon: <Target className="w-7 h-7 md:w-9 md:h-9" />, 
                title: "Gap Detection", 
                desc: "Identifying exactly which tools and frameworks are missing from your stack.",
                color: "text-amber-400"
              },
              { 
                icon: <Map className="w-7 h-7 md:w-9 md:h-9" />, 
                title: "Live Roadmap", 
                desc: "Personalized learning paths with documentation and YouTube resources.",
                color: "text-emerald-400"
              }
            ].map((feature, i) => (
              <div key={i} className="group bg-white/[0.02] p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-700">
                <div className={`w-16 h-16 md:w-24 md:h-24 bg-white/5 ${feature.color} rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-12 group-hover:scale-110 transition-transform shadow-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl md:text-3xl font-black text-white mb-4 md:mb-6 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-sm md:text-xl text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/[0.03] border border-white/5 rounded-[3rem] md:rounded-[6rem] p-10 sm:p-16 md:p-28 text-white grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-20 text-center relative overflow-hidden shadow-2xl mb-12 md:mb-24">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
          {[
            { label: "Analyzed", val: "50+", icon: <Cpu className="w-4 h-4" /> },
            { label: "Accuracy", val: "99%", icon: <Award className="w-4 h-4" /> },
            { label: "Time", val: "1.2s", icon: <Zap className="w-4 h-4" /> },
            { label: "Global", val: "24/7", icon: <Globe className="w-4 h-4" /> }
          ].map((stat, i) => (
            <div key={i} className="space-y-4 md:space-y-8 relative z-10">
              <div className="flex items-center justify-center gap-2 md:gap-4 text-indigo-400/60">
                 {stat.icon}
                 <span className="text-[10px] md:text-base font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">{stat.label}</span>
              </div>
              <h4 className="text-4xl md:text-8xl font-black tracking-tighter text-white">{stat.val}</h4>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default UploadPage;