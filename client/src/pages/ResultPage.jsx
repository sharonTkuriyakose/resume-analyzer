import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Trophy, Target, Zap, BookOpen, ExternalLink, 
  Youtube, ChevronRight, LayoutGrid, Award, ShieldCheck,
  Activity, CheckCircle2, Download
} from 'lucide-react';

const ResultPage = ({ data }) => {
  const reportRef = useRef();

  if (!data) return <div className="h-screen flex items-center justify-center text-slate-400 bg-[#0A0C10]">No Analysis Found.</div>;

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0A0C10',
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Resume_Analysis_${data.domain || 'Report'}.pdf`);
  };

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
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0A0C10; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }
      `}} />

      <div ref={reportRef} className="max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 md:space-y-12 bg-[#0A0C10]">
        
        {/* 1. TOP SYSTEM STATUS */}
        <div className="flex flex-col sm:flex-row justify-between items-center pb-6 md:pb-10 border-b border-white/5 gap-4">
            <div className="flex items-center gap-4 text-slate-500 font-black text-sm md:text-xl uppercase tracking-[0.2em] md:tracking-[0.4em] text-center sm:text-left">
                <Activity className="w-5 h-5 text-indigo-500 shrink-0" /> Analysis Neural Link Active
            </div>
            
            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 md:px-6 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] md:text-sm font-black uppercase tracking-[0.1em] text-white hover:bg-indigo-500/20 transition-all"
                >
                    <Download className="w-4 h-4" /> Export PDF
                </button>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs md:text-sm uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4" /> Validated
                </div>
            </div>
        </div>

        <main className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-6 md:py-12">
          
          {/* LEFT PILLAR: CORE SCORE */}
          <section className="col-span-1 lg:col-span-4 space-y-8 md:space-y-12">
            <div className="relative group p-8 md:p-14 rounded-[2rem] md:rounded-[3.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 flex flex-col items-center">
              <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-indigo-500/10 blur-[60px] md:blur-[90px] rounded-full" />
              
              <div className="flex items-center gap-3 mb-8 md:mb-14">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-slate-500">Industry Readiness</h2>
              </div>
              
              <div className="relative w-56 h-56 md:w-80 md:h-80 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
                  <circle cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/5" />
                  <circle cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="16" fill="transparent" 
                    strokeDasharray={911} strokeDashoffset={911 - (911 * data.score) / 100}
                    strokeLinecap="round" className="text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-none">{data.score}%</span>
                  <span className="text-[10px] md:text-sm font-bold text-indigo-400 mt-2 md:mt-6 tracking-widest uppercase">Global Rank</span>
                </div>
              </div>

              <div className="mt-8 md:mt-14 w-full p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/5 text-center shadow-xl">
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-2 tracking-widest">Detected Domain</span>
                  <span className="text-xl md:text-3xl font-bold text-white tracking-tight break-words">{data.domain || 'Unclassified'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8">
              <div className="p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/5 border border-white/10">
                <Trophy className="w-6 h-6 md:w-8 md:h-8 text-emerald-400 mb-3 md:mb-5" />
                <div className="text-3xl md:text-5xl font-black text-white">{data.foundSkills?.length || 0}</div>
                <div className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mt-1">Strengths</div>
              </div>
              <div className="p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/5 border border-white/10">
                <Target className="w-6 h-6 md:w-8 md:h-8 text-amber-400 mb-3 md:mb-5" />
                <div className="text-3xl md:text-5xl font-black text-white">{data.missingSkills?.length || 0}</div>
                <div className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mt-1">Gap items</div>
              </div>
            </div>
          </section>

          {/* RIGHT PILLAR: SKILL MATRIX & ROADMAP */}
          <section className="col-span-1 lg:col-span-8 space-y-8 md:space-y-12">
            <div className="p-6 md:p-14 rounded-[2rem] md:rounded-[3.5rem] bg-white/[0.02] border border-white/10">
              <div className="flex items-center gap-4 mb-8 md:mb-12 text-indigo-400">
                <LayoutGrid className="w-6 h-6" />
                <h3 className="font-black uppercase tracking-widest text-xs md:text-sm">Skill Matrix Analysis</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
                <div className="space-y-6 md:space-y-8">
                  <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Validated Expertise</span>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-3.5">
                    {data.foundSkills?.map((skill, i) => (
                      <span key={i} className="px-4 md:px-6 py-2 md:py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs md:text-sm font-bold rounded-lg md:rounded-xl">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-6 md:space-y-8">
                  <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Requirement Gaps</span>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-3.5">
                    {data.missingSkills?.map((skill, i) => (
                      <span key={i} className="px-4 md:px-6 py-2 md:py-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs md:text-sm font-bold rounded-lg md:rounded-xl">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-14 rounded-[2rem] md:rounded-[3.5rem] bg-white/[0.02] border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4 mb-8 md:mb-12 text-indigo-400">
                  <BookOpen className="w-6 h-6" />
                  <h3 className="font-black uppercase tracking-widest text-xs md:text-sm">Strategic Upskilling Roadmap</h3>
                </div>

                <div className="space-y-4 md:space-y-6">
                  {data.roadmap?.map((item, i) => (
                    <div key={i} className="group p-6 md:p-10 bg-white/5 hover:bg-white/[0.08] border border-white/5 hover:border-indigo-500/30 rounded-[1.5rem] md:rounded-[2.5rem] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-6 md:gap-10 w-full">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xl md:text-2xl shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-white text-lg md:text-2xl mb-1 md:mb-2 tracking-tight truncate">{item.skill}</h4>
                          <p className="text-xs md:text-base text-slate-400 font-medium leading-relaxed line-clamp-2 md:line-clamp-none">{item.task}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                        <a href={item.link} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none p-3 md:p-5 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all flex justify-center">
                          <ExternalLink className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                        </a>
                        <a href={item.youtubeLink} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none p-3 md:p-5 bg-red-500/10 hover:bg-red-500/20 rounded-xl md:rounded-2xl transition-all flex justify-center">
                          <Youtube className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                        </a>
                        <ChevronRight className="hidden sm:block w-7 h-7 text-slate-800 group-hover:text-indigo-500 transition-colors ml-4" />
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