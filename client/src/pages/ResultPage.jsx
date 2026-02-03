import React from 'react';
import { 
  Trophy, Target, Zap, BookOpen, ExternalLink, 
  Youtube, ChevronRight, LayoutGrid, Award, ShieldCheck,
  Activity, CheckCircle2
} from 'lucide-react';

const ResultPage = ({ data }) => {
  if (!data) return <div className="h-screen flex items-center justify-center text-slate-400 bg-[#0A0C10]">No Analysis Found.</div>;

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
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0A0C10; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }
      `}} />

      <div className="max-w-[1750px] mx-auto px-12 space-y-12">
        
        {/* 1. TOP SYSTEM STATUS (Replaces Nav for consistency) */}
        <div className="flex justify-between items-center pb-10 border-b border-white/5">
            <div className="flex items-center gap-4 text-slate-500 font-black text-xl uppercase tracking-[0.4em]">
                <Activity className="w-5 h-5 text-indigo-500" /> Analysis Neural Link Active
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" /> Report Validated
                </div>
                <div className="px-6 py-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-sm font-black uppercase tracking-[0.2em] text-white">
                    v2.0 Analysis Result
                </div>
            </div>
        </div>

        <main className="w-full grid grid-cols-12 gap-12 py-12">
          
          {/* LEFT PILLAR: THE CORE SCORE */}
          <section className="col-span-12 lg:col-span-4 space-y-12">
            <div className="relative group p-14 rounded-[3.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 flex flex-col items-center">
              {/* Dynamic Background Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[90px] rounded-full" />
              
              <div className="flex items-center gap-3 mb-14">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500">Industry Readiness</h2>
              </div>
              
              <div className="relative w-80 h-80 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/5" />
                  <circle cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="16" fill="transparent" 
                    strokeDasharray={911} strokeDashoffset={911 - (911 * data.score) / 100}
                    strokeLinecap="round" className="text-indigo-500 drop-shadow-[0_0_25px_rgba(99,102,241,0.6)]" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-9xl font-black tracking-tighter text-white leading-none">{data.score}%</span>
                  <span className="text-sm font-bold text-indigo-400 mt-6 tracking-widest uppercase">Global Rank</span>
                </div>
              </div>

              <div className="mt-14 w-full p-8 rounded-3xl bg-white/5 border border-white/5 text-center shadow-xl">
                  <span className="text-xs font-black uppercase text-slate-500 block mb-3 tracking-widest">Detected Domain</span>
                  <span className="text-3xl font-bold text-white tracking-tight">{data.domain || 'Unclassified'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                <Trophy className="w-8 h-8 text-emerald-400 mb-5" />
                <div className="text-5xl font-black text-white">{data.foundSkills?.length || 0}</div>
                <div className="text-xs font-bold uppercase text-slate-500 tracking-widest mt-2">Strengths</div>
              </div>
              <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-amber-500/30 transition-colors">
                <Target className="w-8 h-8 text-amber-400 mb-5" />
                <div className="text-5xl font-black text-white">{data.missingSkills?.length || 0}</div>
                <div className="text-xs font-bold uppercase text-slate-500 tracking-widest mt-2">Gap items</div>
              </div>
            </div>
          </section>

          {/* RIGHT PILLAR: COMPETENCIES & ACTIONS */}
          <section className="col-span-12 lg:col-span-8 space-y-12">
            
            <div className="p-14 rounded-[3.5rem] bg-white/[0.02] border border-white/10">
              <div className="flex items-center gap-4 mb-12 text-indigo-400">
                <LayoutGrid className="w-6 h-6" />
                <h3 className="font-black uppercase tracking-widest text-sm">Skill Matrix Analysis</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Validated Expertise</span>
                  </div>
                  <div className="flex flex-wrap gap-3.5">
                    {data.foundSkills?.map((skill, i) => (
                      <span key={i} className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold rounded-xl shadow-sm hover:bg-emerald-500/20 transition-all">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Requirement Gaps</span>
                  </div>
                  <div className="flex flex-wrap gap-3.5">
                    {data.missingSkills?.map((skill, i) => (
                      <span key={i} className="px-6 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold rounded-xl shadow-sm hover:bg-amber-500/20 transition-all">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-14 rounded-[3.5rem] bg-white/[0.02] border border-white/10 shadow-2xl">
               <div className="flex items-center gap-4 mb-12 text-indigo-400">
                  <BookOpen className="w-6 h-6" />
                  <h3 className="font-black uppercase tracking-widest text-sm">Strategic Upskilling Roadmap</h3>
                </div>

                <div className="space-y-6">
                  {data.roadmap?.map((item, i) => (
                    <div key={i} className="group p-10 bg-white/5 hover:bg-white/[0.08] border border-white/5 hover:border-indigo-500/30 rounded-[2.5rem] transition-all duration-500 flex items-center justify-between">
                      <div className="flex items-center gap-10">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-2xl">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-black text-white text-2xl mb-2 tracking-tight">{item.skill}</h4>
                          <p className="text-base text-slate-400 font-medium leading-relaxed max-w-lg">{item.task}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <a href={item.link} target="_blank" rel="noreferrer" title="Documentation" className="p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                          <ExternalLink className="w-6 h-6 text-slate-400" />
                        </a>
                        <a href={item.youtubeLink} target="_blank" rel="noreferrer" title="YouTube Course" className="p-5 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-all">
                          <Youtube className="w-6 h-6 text-red-500" />
                        </a>
                        <ChevronRight className="w-7 h-7 text-slate-800 group-hover:text-indigo-500 transition-colors ml-6" />
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