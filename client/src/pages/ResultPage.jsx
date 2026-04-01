import React from 'react';
import { 
  Trophy, Target, Zap, BookOpen, Activity, Download, 
  Sparkles, Award, ExternalLink, Youtube, Search, 
  CheckCircle2, AlertCircle 
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
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .card-bg { border: 1px solid #ddd !important; background: transparent !important; color: black !important; break-inside: avoid; }
        }
      `}} />

      <div className="max-w-[1750px] mx-auto px-4 md:px-12 space-y-10 md:space-y-12 bg-[#0A0C10]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center pb-6 border-b border-white/10 no-print">
            <div className="flex items-center gap-4 text-emerald-400 font-black text-[12px] md:text-base uppercase tracking-[0.2em]">
                <Activity className="w-6 h-6" /> Neural Lab Active
            </div>
            <button onClick={handleExport} className="px-6 py-2.5 rounded-full bg-white text-black text-[10px] md:text-xs font-black uppercase transition-transform hover:scale-105">
                <Download className="w-4 h-4 mr-2 inline" /> Export Report
            </button>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
          
          {/* LEFT COLUMN: READINESS & SKILLS */}
          <section className="col-span-1 lg:col-span-4 space-y-8">
            {/* SCORE CIRCLE */}
            <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 flex flex-col items-center card-bg">
              <div className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
                  <circle cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/5" />
                  <circle cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="16" fill="transparent" 
                    strokeDasharray={911} strokeDashoffset={911 - (911 * (data.score || 0)) / 100}
                    strokeLinecap="round" className="text-white transition-all duration-1000 shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                  />
                </svg>
                <span className="absolute text-6xl md:text-8xl font-black italic text-white tracking-tighter">{data.score || 0}%</span>
              </div>
              <div className="mt-8 text-center">
                <div className="uppercase tracking-[0.4em] text-[11px] font-black text-slate-500 mb-2">Market Readiness</div>
                <div className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight">{data.domain}</div>
              </div>
            </div>

            {/* VALIDATED SKILLS & GAPS */}
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 space-y-10 text-left card-bg">
                <div className="space-y-4">
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" /> Validated Expertise
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {data.foundSkills?.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-black rounded-lg uppercase tracking-wide">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4 pt-8 border-t border-white/5">
                  <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" /> Strategy Gaps
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {data.missingSkills?.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-black rounded-lg uppercase tracking-wide">{skill}</span>
                    ))}
                  </div>
                </div>
            </div>
          </section>

          {/* RIGHT COLUMN: KEYWORDS, PROJECTS & ROADMAP */}
          <section className="col-span-1 lg:col-span-8 space-y-12">
            
            {/* 1. ATS KEYWORD INTELLIGENCE (LARGE TEXT VERSION) */}
            <div className="p-8 md:p-14 rounded-[2.5rem] bg-white/[0.03] border border-white/10 text-left card-bg shadow-2xl">
              <h3 className="font-black uppercase tracking-widest text-xs md:text-sm mb-12 flex items-center gap-4 text-white">
                <Search className="w-6 h-6 text-indigo-400" /> ATS Keyword Intelligence
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* DETECTED */}
                <div className="space-y-6">
                  <span className="text-[12px] md:text-sm font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" /> High-Impact Detected
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {data.keywordsDetected && data.keywordsDetected.length > 0 ? (
                      data.keywordsDetected.map((kw, i) => (
                        <div key={i} className="px-6 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                          <span className="text-sm md:text-base font-black text-white uppercase tracking-wider">{kw}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-600 text-xs font-bold uppercase italic">No keywords found. Re-upload to scan.</p>
                    )}
                  </div>
                </div>

                {/* MISSING */}
                <div className="space-y-6">
                  <span className="text-[12px] md:text-sm font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" /> Critical Misses (ATS Risk)
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {data.keywordsMissing && data.keywordsMissing.length > 0 ? (
                      data.keywordsMissing.map((kw, i) => (
                        <div key={i} className="px-6 py-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
                          <span className="text-sm md:text-base font-black text-white uppercase tracking-wider">{kw}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-600 text-xs font-bold uppercase italic">Optimizing for industry gaps...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PROJECT LAB */}
            <div className="p-8 md:p-14 rounded-[2.5rem] bg-white/[0.02] border border-white/10 text-left card-bg">
              <h3 className="font-black uppercase tracking-widest text-xs mb-12 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-400" /> AI-Analyzed Project Lab
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.roadmap?.slice(0, 4).map((item, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4 block opacity-60">Strategic Target: {item.skill}</span>
                    <h4 className="text-white font-black text-xl mb-8 uppercase tracking-tight leading-tight">{item.projectTitle || `${item.skill} Simulation`}</h4>
                    <div className="space-y-6">
                      {item.steps?.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[10px] font-black">{idx + 1}</span></div>
                          <p className="text-[12px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. LEARNING CURRICULUM */}
            <div className="p-8 md:p-14 rounded-[2.5rem] bg-white/[0.02] border border-white/10 text-left card-bg">
              <h3 className="font-black uppercase tracking-widest text-xs mb-10 flex items-center gap-3 text-white">
                <BookOpen className="w-6 h-6 text-emerald-400" /> Phased Learning Curriculum
              </h3>
              <div className="space-y-10 relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
                {data.roadmap?.map((item, i) => (
                  <div key={i} className="relative pl-0 md:pl-20 group">
                    <div className="absolute left-0 top-0 hidden md:flex w-12 h-12 rounded-full bg-[#0A0C10] border-2 border-white/20 items-center justify-center font-black z-10 transition-all group-hover:border-emerald-400 text-white">{i + 1}</div>
                    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                      <h4 className="text-2xl font-black text-white uppercase mb-4 tracking-tight">{item.skill}</h4>
                      <p className="text-[12px] text-slate-500 uppercase font-black tracking-widest mb-8 italic leading-relaxed">{item.task}</p>
                      <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5">
                        <a href={item.link} target="_blank" rel="noreferrer" className="w-full sm:w-auto flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-white text-center flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all">
                          Documentation <ExternalLink className="w-4 h-4"/>
                        </a>
                        <a href={item.youtubeLink} target="_blank" rel="noreferrer" className="w-full sm:w-auto flex-1 px-6 py-4 bg-red-500/5 border border-red-500/20 rounded-xl text-[10px] font-black uppercase text-red-400 text-center flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all">
                          Video Guide <Youtube className="w-4 h-4"/>
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