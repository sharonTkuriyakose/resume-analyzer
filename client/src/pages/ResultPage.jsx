import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Trophy, Target, Zap, BookOpen, ExternalLink, 
  Youtube, ChevronRight, LayoutGrid, Award, 
  Activity, CheckCircle2, Download, Code2, 
  ArrowRight, ShieldCheck, Clock, ListChecks, Sparkles
} from 'lucide-react';

const ResultPage = ({ data }) => {
  const reportRef = useRef();

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-white bg-[#0A0C10]">
        <Activity className="w-12 h-12 text-emerald-400 animate-pulse mb-4" />
        <h2 className="text-xl font-black uppercase tracking-widest">Neural Lab Synchronizing...</h2>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#0A0C10' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`${data.domain || 'Analysis'}_Report.pdf`);
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0C10] text-white font-sans pt-8 md:pt-12 pb-24 selection:bg-white/20">
      <style dangerouslySetInnerHTML={{ __html: `
        html, body, #root { margin: 0; padding: 0; background-color: #0A0C10 !important; }
      `}} />

      <div ref={reportRef} className="max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12 bg-[#0A0C10]">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-white/10 gap-4">
            <div className="flex items-center gap-4 text-white font-black text-sm md:text-xl uppercase tracking-[0.2em]">
                <Activity className="w-5 h-5 text-emerald-400" /> AI Neural Lab Active
            </div>
            <button onClick={handleDownloadPDF} className="px-6 py-2 rounded-full border border-white/20 bg-white/5 text-[10px] md:text-sm font-black uppercase text-white hover:bg-white/10 transition-all">
                <Download className="w-4 h-4 mr-2 inline" /> Export PDF Report
            </button>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: SCORE & DOMAIN */}
          <section className="col-span-1 lg:col-span-4 space-y-8">
            <div className="p-8 md:p-14 rounded-[2.5rem] bg-white/[0.02] border border-white/10 flex flex-col items-center">
              <div className="relative w-56 h-56 md:w-80 md:h-80 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
                  <circle cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/5" />
                  <circle cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="16" fill="transparent" 
                    strokeDasharray={911} strokeDashoffset={911 - (911 * (data.score || 0)) / 100}
                    strokeLinecap="round" className="text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                  />
                </svg>
                <span className="absolute text-6xl md:text-9xl font-black">{data.score || 0}%</span>
              </div>
              <div className="mt-8 text-center uppercase tracking-[0.4em] text-xs font-black text-slate-500">Readiness Score</div>
              <div className="mt-2 text-xl md:text-3xl font-black text-white uppercase text-center tracking-tighter italic">
                {data.domain || 'Professional Profile'}
              </div>
            </div>

            {/* SKILL MATRIX */}
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" /> Validated Expertise
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.foundSkills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg uppercase">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" /> Requirement Gaps
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.missingSkills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold rounded-lg uppercase">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: PROJECTS LAB */}
          <section className="col-span-1 lg:col-span-8 space-y-12">
            
            {/* 1. DYNAMIC AI-POWERED PROJECT LAB (Strictly based on your example) */}
            <div className="p-8 md:p-14 rounded-[2.5rem] bg-white/[0.02] border border-white/10">
              <h3 className="font-black uppercase tracking-widest text-xs mb-12 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400" /> AI-Analyzed Project Lab
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.roadmap?.slice(0, 4).map((item, i) => (
                  <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-white/20 transition-all flex flex-col group">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em] mb-4 block opacity-60">
                      {item.skill || 'DOMAIN FOCUS'}
                    </span>
                    
                    {/* ✅ AI TITLE: Matches your request for a specific, professional title */}
                    <h4 className="text-white font-black text-xl mb-10 uppercase leading-tight tracking-tight">
                      {item.projectTitle || `${item.skill} Portfolio Project`}
                    </h4>

                    {/* ✅ 3-POINT DYNAMIC PLAN: Provided by AI */}
                    <div className="space-y-8">
                      {(item.steps && Array.isArray(item.steps) ? item.steps : [
                        `Architect a high-performance solution for ${item.skill} ensuring scalability within the ${data.domain} sector.`,
                        `Integrate specialized security and data management protocols tailored for professional ${item.skill} standards.`,
                        `Verify outcomes using industry-standard KPIs to validate professional proficiency for your career profile.`
                      ]).map((step, index) => (
                        <div key={index} className="flex items-start gap-5">
                          <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white group-hover:text-black transition-all">
                            <span className="text-[10px] font-black">{index + 1}</span>
                          </div>
                          <p className="text-[11px] md:text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-wide">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. PHASED LEARNING CURRICULUM */}
            <div className="p-8 md:p-14 rounded-[2.5rem] bg-white/[0.02] border border-white/10 shadow-2xl">
              <h3 className="font-black uppercase tracking-widest text-xs mb-10 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-emerald-400" /> Phased Learning Curriculum
              </h3>
              
              <div className="space-y-10 relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
                {data.roadmap?.map((item, i) => (
                  <div key={i} className="relative pl-0 md:pl-20 group">
                    <div className="absolute left-0 top-0 hidden md:flex w-12 h-12 rounded-full bg-[#0A0C10] border-2 border-white/20 items-center justify-center font-black text-white group-hover:border-emerald-400 transition-all z-10">
                      {i + 1}
                    </div>
                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                      <h4 className="text-2xl font-black text-white uppercase tracking-tight">{item.skill || 'Advanced Skill'}</h4>
                      <div className="space-y-3 mt-4 mb-8">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Zap className="w-4 h-4" /> Primary Goal</span>
                         <p className="text-xs text-slate-400 italic leading-relaxed">{item.task || 'Standard professional implementation.'}</p>
                      </div>
                      <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                        <a href={item.link || '#'} target="_blank" rel="noreferrer" className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-white hover:bg-white transition-all">Documentation</a>
                        <a href={item.youtubeLink || '#'} target="_blank" rel="noreferrer" className="px-6 py-2 bg-red-500/5 border border-red-500/20 rounded-full text-[10px] font-black uppercase text-red-400 hover:bg-red-500 transition-all">Video Guide</a>
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