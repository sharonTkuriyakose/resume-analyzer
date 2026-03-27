import React from 'react';
import { 
  Trophy, Target, Zap, BookOpen, Activity, Download, 
  Sparkles, Award, ExternalLink, Youtube 
} from 'lucide-react';

const ResultPage = ({ data }) => {
  const handleExport = () => window.print();

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-white bg-[#0A0C10]">
        <Activity className="w-12 h-12 text-emerald-400 animate-pulse mb-4" />
        <h2 className="text-xl font-black uppercase tracking-widest italic">Neural Lab Synchronizing...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0A0C10] text-white font-sans pt-6 pb-20 selection:bg-indigo-500/20">
      {/* 🟢 CSS Print Optimization */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .card-bg { border: 1px solid #ddd !important; background: transparent !important; color: black !important; break-inside: avoid; }
          .text-emerald-400, .text-amber-400, .text-indigo-400 { color: black !important; font-weight: bold !important; }
        }
      `}} />

      <div className="max-w-[1750px] mx-auto px-4 md:px-12 space-y-10 md:space-y-12 bg-[#0A0C10]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center pb-6 border-b border-white/10 no-print">
            <div className="flex items-center gap-4 text-emerald-400 font-black text-[10px] md:text-sm uppercase tracking-[0.2em]">
                <Activity className="w-5 h-5" /> Neural Lab Active
            </div>
            <button onClick={handleExport} className="px-5 py-2 rounded-full bg-white text-black text-[9px] md:text-[10px] font-black uppercase transition-transform hover:scale-105">
                <Download className="w-3 h-3 mr-2 inline" /> Export Report
            </button>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
          
          {/* LEFT COLUMN: READINESS & SKILLS */}
          <section className="col-span-1 lg:col-span-4 space-y-8">
            <div className="p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 flex flex-col items-center card-bg">
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
                  <circle cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-white/5" />
                  <circle cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="14" fill="transparent" 
                    strokeDasharray={911} strokeDashoffset={911 - (911 * (data.score || 0)) / 100}
                    strokeLinecap="round" className="text-white transition-all duration-1000 shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                  />
                </svg>
                <span className="absolute text-5xl md:text-7xl font-black italic">{data.score || 0}%</span>
              </div>
              <div className="mt-6 text-center">
                <div className="uppercase tracking-[0.4em] text-[9px] font-black text-slate-500 mb-1">Market Readiness</div>
                <div className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight leading-tight">{data.domain}</div>
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 space-y-8 text-left card-bg">
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Validated Expertise
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {data.foundSkills?.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[8px] font-black rounded uppercase">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 pt-6 border-t border-white/5">
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Requirement Gaps
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {data.missingSkills?.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-amber-500/5 border border-amber-500/10 text-amber-400 text-[8px] font-black rounded uppercase">{skill}</span>
                    ))}
                  </div>
                </div>
            </div>
          </section>

          {/* RIGHT COLUMN: PROJECTS & ROADMAP */}
          <section className="col-span-1 lg:col-span-8 space-y-12">
            
            {/* 1. PROJECT LAB */}
            <div className="p-8 md:p-14 rounded-[2.5rem] bg-white/[0.02] border border-white/10 text-left card-bg">
              <h3 className="font-black uppercase tracking-widest text-[10px] mb-10 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-400" /> AI-Analyzed Project Lab
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.roadmap?.slice(0, 4).map((item, i) => (
                  <div key={i} className="p-6 md:p-8 rounded-[2rem] bg-white/5 border border-white/5 group hover:border-white/20 transition-all">
                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-3 block opacity-60">Target: {item.skill}</span>
                    <h4 className="text-white font-black text-base md:text-lg mb-6 uppercase tracking-tight leading-tight">{item.projectTitle || `${item.skill} Simulation`}</h4>
                    <div className="space-y-4">
                      {item.steps?.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white group-hover:text-black transition-colors">
                            <span className="text-[9px] font-black">{idx + 1}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. LEARNING CURRICULUM */}
            <div className="p-8 md:p-14 rounded-[2.5rem] bg-white/[0.02] border border-white/10 text-left card-bg">
              <h3 className="font-black uppercase tracking-widest text-[10px] mb-10 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-emerald-400" /> Phased Learning Curriculum
              </h3>
              <div className="space-y-8 relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
                {data.roadmap?.map((item, i) => (
                  <div key={i} className="relative pl-0 md:pl-16 group">
                    <div className="absolute left-0 top-0 hidden md:flex w-10 h-10 rounded-full bg-[#0A0C10] border-2 border-white/20 items-center justify-center font-black z-10 transition-colors group-hover:border-emerald-400">{i + 1}</div>
                    <div className="p-6 md:p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                      <h4 className="text-lg md:text-xl font-black text-white uppercase mb-2 tracking-tight">{item.skill}</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-6 italic">{item.task}</p>
                      
                      {/* RESPONSIVE BUTTON CONTAINER (FIXED FOR MOBILE) */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-full sm:w-auto flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase text-white text-center flex items-center justify-center gap-2 whitespace-nowrap hover:bg-white hover:text-black transition-all"
                        >
                          Documentation <ExternalLink className="w-3 h-3 shrink-0"/>
                        </a>
                        <a 
                          href={item.youtubeLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-full sm:w-auto flex-1 px-4 py-3 bg-red-500/5 border border-red-500/20 rounded-full text-[9px] font-black uppercase text-red-400 text-center flex items-center justify-center gap-2 whitespace-nowrap hover:bg-red-500 hover:text-white transition-all"
                        >
                          Video Guide <Youtube className="w-3 h-3 shrink-0"/>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ResultPage;