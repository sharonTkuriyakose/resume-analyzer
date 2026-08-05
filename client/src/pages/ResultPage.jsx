import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';
import { 
  Target, Zap, BookOpen, Activity, 
  Sparkles, Award, Search, 
  CheckCircle2, AlertCircle, Briefcase, MapPin, 
  ExternalLink, Youtube, ChevronRight, Share2, Download, ArrowLeft, ArrowUpRight,
  Twitter, Linkedin, Facebook, Link, X, MessageCircle, Mail, Send
} from 'lucide-react';

const ResultPage = ({ data }) => {
  const [activeCard, setActiveCard] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const handleExport = () => window.print();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleSharePDF = async () => {
    const element = document.getElementById('report-container');
    if (!element) {
        alert("Could not find the report container.");
        return;
    }
    
    setIsGeneratingPDF(true);
    try {
        const options = {
            quality: 0.85, 
            bgcolor: '#050505',
            width: element.scrollWidth,
            height: element.scrollHeight,
            style: {
                transform: 'scale(1)',
                transformOrigin: 'top left',
                width: element.scrollWidth + 'px',
                height: element.scrollHeight + 'px'
            }
        };
        const imgData = await domtoimage.toJpeg(element, options);
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        
        // Load the image data into an Image object to retrieve its natural dimensions
        const img = new Image();
        img.src = imgData;
        await new Promise(resolve => img.onload = resolve);
        
        const pdfHeight = (img.height * pdfWidth) / img.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        const pdfBlob = pdf.output('blob');
        const file = new File([pdfBlob], 'Neural_Resume_Analysis.pdf', { type: 'application/pdf' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'Neural Resume Analysis',
                    text: `My Neural Resume Analysis! Score: ${data?.score || 0}% for ${data?.domain || 'roles'}.`,
                    files: [file]
                });
            } catch(e) {
                console.log("Native share failed", e);
                pdf.save('Neural_Resume_Analysis.pdf');
            }
        } else {
            pdf.save('Neural_Resume_Analysis.pdf');
            alert('PDF Downloaded! You can now attach this file to WhatsApp, LinkedIn, or Email.');
        }
    } catch(err) {
        console.error("PDF Generation Failed", err);
        alert(`Failed to generate PDF: ${err.message || JSON.stringify(err)}`);
    } finally {
        setIsGeneratingPDF(false);
    }
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-white bg-[#050505]">
        <Activity className="w-12 h-12 text-[#06b6d4] animate-pulse mb-4" />
        <h2 className="text-xl font-black uppercase tracking-widest italic text-slate-300">Neural Lab Synchronizing...</h2>
      </div>
    );
  }

  const projectStage = data.phasedCurriculum?.find(step => step.id === 4 || step.isProject);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
  };

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut", delay: 0.5 } }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring", stiffness: 200, damping: 20 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } }
  };

  // Node Component for the Map
  const NodeButton = ({ id, icon: Icon, title, onClick, positionClass }) => (
    <motion.button 
      onClick={() => onClick(id)}
      className={`xl:absolute ${positionClass} w-full xl:w-[300px] xl:h-[100px] glass-card rounded-2xl z-10 flex items-center justify-start px-6 py-4 xl:py-0 gap-4 group cursor-pointer hover:border-[#06b6d4]/50 hover:bg-white/[0.05] transition-all`}
    >
      <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#06b6d4]/50 transition-colors">
        <Icon className="w-5 h-5 text-[#06b6d4]" />
      </div>
      <div className="flex flex-col items-start text-left">
        <h3 className="text-[11px] xl:text-[13px] font-black text-white uppercase tracking-widest">{title}</h3>
        <span className="text-[9px] xl:text-[10px] text-[#06b6d4] uppercase tracking-widest mt-1 xl:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Open Details <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </motion.button>
  );


  return (
    <div className="min-h-screen w-full bg-[#050505] text-slate-200 font-sans p-4 md:p-8 lg:p-12 selection:bg-[#06b6d4]/30 relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#06b6d4]/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#06b6d4]/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 6px; }
        ::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
        
        .glass-card {
          background: rgba(17, 17, 17, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-top: 1px solid rgba(6,182,212, 0.3);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
        }
      `}} />

      <div id="report-container" className="max-w-[1600px] mx-auto relative z-10 flex flex-col items-center">
        
        {/* Top Metadata Bar */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between mb-8 gap-6 bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:px-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#06b6d4] to-transparent opacity-50"></div>
           <div className="flex flex-col items-center md:items-start">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                <Target className="w-3 h-3 text-[#06b6d4]" /> Neural Lab / Analysis Complete
             </div>
             <div className="flex items-center gap-3">
               <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Candidate Profile</h1>
               <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-[#06b6d4] uppercase tracking-wider">
                 {data.domain || 'Professional'}
               </span>
             </div>
           </div>
           <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-3 sm:gap-4 no-print mt-6 md:mt-0">
              <button onClick={handleSharePDF} disabled={isGeneratingPDF} className="w-full sm:w-auto justify-center px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase text-white flex items-center gap-2 transition-all disabled:opacity-50">
                <Share2 className="w-4 h-4 text-slate-400" /> {isGeneratingPDF ? 'Generating PDF...' : 'Share Progress (PDF)'}
              </button>
              <button onClick={handleExport} className="w-full sm:w-auto justify-center px-5 py-2.5 bg-gradient-to-r from-[#06b6d4] to-[#FF8C00] hover:from-[#0284c7] hover:to-[#0369a1] text-black rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Download className="w-4 h-4" /> Export Report
              </button>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {!activeCard ? (
            /* ======================================= */
            /* MAP VIEW (THE TREE)                     */
            /* ======================================= */
            <motion.div 
              key="map-view"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative w-full max-w-[1600px] xl:aspect-[16/10] flex flex-col xl:block items-center justify-center mt-4 mb-20 gap-6 xl:gap-8 px-4 xl:px-0"
            >
              {/* SVG Connecting Lines (Desktop Only) */}
              <div className="absolute inset-0 pointer-events-none hidden xl:block z-0">
                 <svg viewBox="0 0 1600 1000" className="w-full h-full overflow-visible">
                    <defs>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                         <feGaussianBlur stdDeviation="4" result="blur" />
                         <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    
                    {/* Lines */}
                    <motion.g fill="none" stroke="#06b6d4" strokeWidth="2" filter="url(#glow)" className="opacity-60">
                      {/* Top Left to Center */}
                      <motion.path variants={lineVariants} d="M 450 250 L 550 250 Q 600 250 650 350 L 700 450 Q 750 500 800 500" />
                      {/* Bottom Left to Center */}
                      <motion.path variants={lineVariants} d="M 450 750 L 550 750 Q 600 750 650 650 L 700 550 Q 750 500 800 500" />
                      {/* Top Right to Center */}
                      <motion.path variants={lineVariants} d="M 1150 250 L 1050 250 Q 1000 250 950 350 L 900 450 Q 850 500 800 500" />
                      {/* Bottom Right to Center */}
                      <motion.path variants={lineVariants} d="M 1150 750 L 1050 750 Q 1000 750 950 650 L 900 550 Q 850 500 800 500" />
                    </motion.g>

                    {/* Connection Dots */}
                    <g fill="#06b6d4" filter="url(#glow)">
                      <circle cx="450" cy="250" r="4" />
                      <circle cx="450" cy="750" r="4" />
                      <circle cx="1150" cy="250" r="4" />
                      <circle cx="1150" cy="750" r="4" />
                    </g>
                 </svg>
              </div>

              {/* CENTER HUB: MARKET READINESS */}
              <div className="xl:absolute xl:top-1/2 xl:left-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2 w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] xl:w-[350px] xl:h-[350px] z-20 flex items-center justify-center relative mb-4 xl:mb-0 shrink-0 mx-auto">
                 <div className="absolute inset-0 bg-[#06b6d4]/20 rounded-full blur-[60px] animate-pulse"></div>
                 <div className="relative w-full h-full bg-[#111]/80 backdrop-blur-xl rounded-full border border-white/10 flex flex-col items-center justify-center shadow-[inset_0_0_60px_rgba(6,182,212,0.2),0_0_40px_rgba(0,0,0,0.8)]">
                    <svg className="absolute w-[90%] h-[90%] transform -rotate-90 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5" />
                      <motion.circle 
                        cx="60" cy="60" r="54" 
                        stroke="url(#blueGradient)" strokeWidth="6" fill="transparent" strokeLinecap="round" 
                        initial={{ strokeDasharray: 339.292, strokeDashoffset: 339.292 }}
                        animate={{ strokeDashoffset: 339.292 - (339.292 * (data.score || 0)) / 100 }}
                        transition={{ duration: 2, ease: "easeOut", delay: 1 }}
                      />
                      <defs>
                        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="z-10 flex flex-col items-center mt-4">
                       <div className="text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Market Readiness</div>
                       <div className="text-5xl sm:text-7xl font-black text-white drop-shadow-lg flex items-start">
                         {data.score || 0}<span className="text-xl sm:text-3xl text-[#06b6d4] mt-1 sm:mt-2">%</span>
                       </div>
                       <div className="mt-2 px-3 py-1 border border-[#06b6d4]/30 bg-[#06b6d4]/10 rounded-full text-[8px] sm:text-[10px] font-bold text-[#06b6d4] tracking-widest uppercase">
                         {data.score >= 80 ? 'Market Ready' : 'Development Needed'}
                       </div>
                    </div>
                 </div>
              </div>

              {/* 4 OUTER NODES */}
              <div className="w-full flex flex-col gap-4 xl:contents">
                <NodeButton id="ats" icon={Search} title="ATS Intelligence" onClick={setActiveCard} positionClass="xl:top-[20%] xl:left-[9%]" />
                <NodeButton id="skills" icon={Zap} title="Skill Proficiency" onClick={setActiveCard} positionClass="xl:top-[70%] xl:left-[9%]" />
                <NodeButton id="projects" icon={Sparkles} title="Projects Lab" onClick={setActiveCard} positionClass="xl:top-[20%] xl:right-[9%]" />
                <NodeButton id="roadmap" icon={Briefcase} title="Career & Jobs" onClick={setActiveCard} positionClass="xl:top-[70%] xl:right-[9%]" />
              </div>

            </motion.div>
          ) : (
            /* ======================================= */
            /* FULL PAGE DETAIL VIEWS                  */
            /* ======================================= */
            <motion.div
              key="detail-view"
              variants={pageVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="w-full max-w-[1200px] min-h-[600px] glass-card rounded-[2rem] p-8 md:p-12 relative flex flex-col mt-4"
            >
              <button 
                onClick={() => setActiveCard(null)}
                className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-[#06b6d4]/20 border border-white/10 hover:border-[#06b6d4]/50 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Map
              </button>

              <div className="mt-16 w-full">
                
                {activeCard === 'ats' && (
                  <div className="w-full">
                     <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3 mb-10">
                       <Search className="w-8 h-8 text-[#06b6d4]" /> ATS Intelligence Breakdown
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-8">
                          <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Detected Strengths
                          </h3>
                          <div className="flex flex-col gap-3">
                            {data.keywordsDetected?.map((kw, i) => {
                              const keyword = typeof kw === 'object' ? kw.keyword : kw;
                              const context = typeof kw === 'object' ? kw.context : null;
                              return (
                              <div key={i} className="p-3 bg-[#050505] border border-emerald-500/30 rounded-lg shadow-inner">
                                <span className="text-slate-200 text-xs font-bold uppercase tracking-wider">{keyword}</span>
                                {context && <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{context}</p>}
                              </div>
                              );
                            })}
                            {(!data.keywordsDetected || data.keywordsDetected.length === 0) && (
                              <span className="text-slate-500 text-sm italic">None detected</span>
                            )}
                          </div>
                       </div>
                       <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-8">
                          <h3 className="text-sm font-black text-cyan-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Critical Misses
                          </h3>
                          <div className="flex flex-col gap-3">
                            {data.keywordsMissing?.map((kw, i) => {
                              const keyword = typeof kw === 'object' ? kw.keyword : kw;
                              const context = typeof kw === 'object' ? kw.context : null;
                              return (
                              <div key={i} className="p-3 bg-[#050505] border border-cyan-500/30 rounded-lg">
                                <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">{keyword}</span>
                                {context && <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{context}</p>}
                              </div>
                              );
                            })}
                            {(!data.keywordsMissing || data.keywordsMissing.length === 0) && (
                              <span className="text-slate-500 text-sm italic">None missing</span>
                            )}
                          </div>
                       </div>
                     </div>
                  </div>
                )}

                {activeCard === 'skills' && (
                  <div className="w-full">
                     <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3 mb-10">
                       <Zap className="w-8 h-8 text-[#06b6d4]" /> Skill Proficiency Matrix
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div>
                         <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-6">Validated Expertise</h3>
                         <div className="space-y-6">
                            {data.foundSkills?.map((item, i) => {
                              const skillName = typeof item === 'object' ? item.skill : item;
                              const skillScore = typeof item === 'object' ? item.score : 85;
                              return (
                              <div key={`found-${i}`}>
                                <div className="flex justify-between items-end mb-2">
                                  <span className="text-xs font-bold text-white uppercase tracking-wider">{skillName}</span>
                                  <span className="text-xs font-black text-[#06b6d4]">{skillScore}%</span>
                                </div>
                                <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${skillScore}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full bg-gradient-to-r from-[#06b6d4] to-[#38bdf8]"></motion.div>
                                </div>
                              </div>
                              );
                            })}
                         </div>
                       </div>
                       <div>
                         <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-6">Action Required</h3>
                         <div className="space-y-6">
                            {data.missingSkills?.map((item, i) => {
                              const skillName = typeof item === 'object' ? item.skill : item;
                              const skillScore = typeof item === 'object' ? item.score : 90;
                              return (
                              <div key={`miss-${i}`}>
                                <div className="flex justify-between items-end mb-2">
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{skillName}</span>
                                  <span className="text-xs font-black text-cyan-500">{skillScore}%</span>
                                </div>
                                <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${skillScore}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full bg-cyan-500/50"></motion.div>
                                </div>
                              </div>
                              );
                            })}
                         </div>
                       </div>
                     </div>
                  </div>
                )}

                {activeCard === 'projects' && (
                  <div className="w-full">
                     <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3 mb-10">
                       <Sparkles className="w-8 h-8 text-[#06b6d4]" /> Strategic Projects Lab
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {projectStage?.projectList?.map((proj, i) => (
                          <div key={i} className="bg-black/50 border border-white/10 rounded-2xl p-6 hover:border-[#06b6d4]/50 transition-colors flex flex-col h-full">
                            <h4 className="text-sm font-black text-[#06b6d4] uppercase tracking-tight mb-2">{proj.name}</h4>
                            {proj.desc && <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">{proj.desc}</p>}
                            <ul className="space-y-3 flex-1">
                              {proj.points?.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] mt-1.5 shrink-0"></div>
                                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{point}</p>
                                </li>
                              ))}
                            </ul>
                            <button className="mt-6 w-full py-3 bg-[#06b6d4]/10 hover:bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                              Start Project
                            </button>
                          </div>
                        ))}
                        {(!projectStage?.projectList || projectStage.projectList.length === 0) && (
                          <div className="text-slate-500 text-sm italic">No project recommendations available.</div>
                        )}
                     </div>
                  </div>
                )}

                {activeCard === 'roadmap' && (
                  <div className="w-full">
                     <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3 mb-10">
                       <Briefcase className="w-8 h-8 text-[#06b6d4]" /> Career & Jobs Center
                     </h2>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                       
                       {/* Roadmap */}
                       <div>
                         <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-8 flex items-center gap-2">
                           <BookOpen className="w-4 h-4 text-[#06b6d4]" /> Phased Curriculum
                         </h3>
                         <div className="space-y-8 relative pl-4 border-l-2 border-white/10">
                            {data.phasedCurriculum?.filter(step => !step.isProject).map((item, i) => (
                              <div key={i} className="relative pl-6 group/item">
                                <div className="absolute left-[-29px] top-1 w-4 h-4 rounded-full bg-black border-2 border-[#06b6d4] group-hover/item:bg-[#06b6d4] transition-colors"></div>
                                <div className="text-[10px] font-black text-[#06b6d4] uppercase tracking-widest mb-1">Phase {item.id}</div>
                                <h4 className="text-sm font-bold text-white tracking-tight mb-2">
                                  {item.title.replace(/_/g, ' ')}
                                </h4>
                                <p className="text-xs text-slate-400 font-medium mb-4 leading-relaxed">{item.primaryGoal}</p>
                                
                                <div className="flex gap-3">
                                  {item.title && (
                                    <a href={`https://google.com/search?q=${encodeURIComponent(item.title.replace(/_/g, ' ').replace(/^(LEARN|MASTER|IMPLEMENT)\s+/i, '').trim().toLowerCase())}+learning+roadmap`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-black border border-white/10 hover:border-[#06b6d4]/50 rounded-lg flex items-center gap-2 text-[9px] font-bold text-white uppercase transition-colors">
                                      Documentation <ExternalLink className="w-3 h-3"/>
                                    </a>
                                  )}
                                  {item.title && (
                                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.title.replace(/_/g, ' ').replace(/^(LEARN|MASTER|IMPLEMENT)\s+/i, '').trim().toLowerCase())}+tutorial+2026`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#06b6d4]/10 border border-[#06b6d4]/20 hover:bg-[#06b6d4]/30 rounded-lg flex items-center gap-2 text-[9px] font-bold text-[#06b6d4] uppercase transition-colors">
                                      Video Guide <Youtube className="w-3 h-3"/>
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                         </div>
                       </div>

                       {/* Jobs */}
                       <div>
                         <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-500" /> Job Portal Search Hub
                          </h3>
                          <div className="space-y-4">
                            {data.liveJobs && data.liveJobs.length > 0 ? data.liveJobs.map((job, i) => (
                              <a key={i} href={job.url} target="_blank" rel="noreferrer" className="block bg-black/40 border border-white/5 hover:border-emerald-500/50 rounded-xl p-5 transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{job.title}</h4>
                                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                                </div>
                                <div className="text-xs text-slate-400 font-medium mb-3">{job.company} • {job.location}</div>
                                {job.description && (
                                  <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">{job.description}</p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-slate-300 font-bold uppercase tracking-wider">{job.type}</span>
                                </div>
                              </a>
                           )) : (
                             <div className="bg-black/40 border border-white/5 rounded-xl p-8 text-center flex flex-col items-center">
                               <Briefcase className="w-8 h-8 text-slate-600 mb-3" />
                               <p className="text-slate-400 text-sm">No live jobs found matching this profile yet.</p>
                               <button className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-bold text-white uppercase tracking-widest transition-colors">Scan Market</button>
                             </div>
                           )}
                         </div>
                       </div>
                       
                     </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* SHARE MODAL REMOVED - NOW USES DIRECT PDF GENERATION */}
    </div>
  );
};

export default ResultPage;