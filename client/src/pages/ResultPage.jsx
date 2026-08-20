import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { 
  Target, Zap, BookOpen, Activity, 
  Sparkles, Award, Search, 
  CheckCircle2, AlertCircle, Briefcase, MapPin, 
  ExternalLink, Youtube, ChevronRight, Share2, Download, ArrowLeft, ArrowUpRight,
  Twitter, Linkedin, Facebook, Link, X, MessageCircle, Mail, Send
} from 'lucide-react';
import PrintView from '../components/PrintView';

const ResultPage = ({ data }) => {
  const [activeCard, setActiveCard] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!hasAnimated && data && data.score) {
      const controls = animate(0, data.score, {
        duration: 1.5,
        ease: "circOut",
        delay: 0.3,
        onUpdate(value) {
          setDisplayScore(Math.round(value));
        }
      });
      return () => controls.stop();
    } else if (data && data.score) {
      setDisplayScore(data.score);
    }
  }, [data, hasAnimated]);

  const handleCardClick = (id) => {
    setHasAnimated(true);
    setActiveCard(id);
  };

  const cleanJobTitle = (title) => {
    if (!title) return "";
    return title.replace(/\s*jobs?\s*on\s*.*$/i, '').trim();
  };

  const getJobSearchUrl = (job) => {
    const cleanTitle = cleanJobTitle(job.title);
    const query = encodeURIComponent(`${cleanTitle} ${job.location || ''}`.trim());
    const fullQuery = encodeURIComponent(`${cleanTitle} ${job.company || ''} ${job.location || ''}`.trim());
    
    if (!job.url) return `https://www.linkedin.com/jobs/search/?keywords=${fullQuery}`;

    const urlLower = job.url.toLowerCase();
    const titleLower = job.title ? job.title.toLowerCase() : '';
    
    if (urlLower.includes('linkedin') || titleLower.includes('linkedin')) {
      return `https://www.linkedin.com/jobs/search/?keywords=${fullQuery}`;
    } else if (urlLower.includes('indeed') || titleLower.includes('indeed')) {
      return `https://www.indeed.com/jobs?q=${fullQuery}`;
    } else if (urlLower.includes('glassdoor') || titleLower.includes('glassdoor')) {
      return `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${fullQuery}`;
    } else if (urlLower.includes('naukri') || titleLower.includes('naukri')) {
      return `https://www.naukri.com/${cleanTitle.replace(/[^a-zA-Z0-9]/g, '-')}-jobs`;
    } else if (urlLower.includes('wellfound') || urlLower.includes('angel.co') || titleLower.includes('wellfound')) {
      return `https://wellfound.com/jobs?search=${query}`;
    } else if (urlLower.includes('dice') || titleLower.includes('dice')) {
      return `https://www.dice.com/jobs?q=${encodeURIComponent(cleanTitle)}`;
    } else if (urlLower.includes('simplyhired') || titleLower.includes('simplyhired')) {
      return `https://www.simplyhired.com/search?q=${encodeURIComponent(cleanTitle)}`;
    } else if (urlLower.includes('weworkremotely') || titleLower.includes('weworkremotely')) {
      return `https://weworkremotely.com/remote-jobs/search?term=${encodeURIComponent(cleanTitle)}`;
    } else if (urlLower.includes('flexjobs') || titleLower.includes('flexjobs')) {
      return `https://www.flexjobs.com/search?search=${encodeURIComponent(cleanTitle)}`;
    } else if (urlLower.includes('upwork') || titleLower.includes('upwork')) {
      return `https://www.upwork.com/nx/search/jobs/?q=${encodeURIComponent(cleanTitle)}`;
    }
    
    return `https://www.google.com/search?q=${fullQuery}+jobs&ibp=htl;jobs`;
  };

  const handleExport = () => {
    window.print();
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-white bg-[#020617]">
        <Activity className="w-12 h-12 text-[#3b82f6] animate-pulse mb-4" />
        <h2 className="text-xl font-black uppercase tracking-widest italic text-blue-300">Neural Lab Synchronizing...</h2>
      </div>
    );
  }

  const projectStage = data.phasedCurriculum?.find(step => step.id === 4 || step.isProject);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring", stiffness: 200, damping: 20 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } }
  };

  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 0.8, transition: { duration: 1.5, ease: "easeInOut", delay: 0.3 } }
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { duration: 0.5, delay: 1.8, type: "spring" } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 2.0 } }
  };

  const NodeButton = ({ id, icon: Icon, title, onClick, positionClass, delay }) => (
    <motion.button 
      variants={cardVariants}
      onClick={() => onClick(id)}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`absolute ${positionClass} w-[320px] h-[80px] bg-[#041033]/80 backdrop-blur-md border border-[#2563eb]/50 rounded-xl z-20 flex items-center justify-start px-5 gap-5 group cursor-pointer shadow-[0_0_30px_rgba(37,99,235,0.15)] hover:border-[#60a5fa] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] hover:bg-[#0a1e52]/90 transition-all`}
    >
      <div className="w-12 h-12 rounded-lg bg-[#1e3a8a]/50 flex items-center justify-center shrink-0 border border-[#3b82f6]/30 group-hover:bg-[#2563eb]/50 group-hover:border-[#60a5fa] transition-colors shadow-inner">
        <Icon className="w-6 h-6 text-[#60a5fa] group-hover:text-white" />
      </div>
      <div className="flex flex-col items-start text-left flex-1 overflow-hidden">
        <h3 className="text-[15px] font-bold text-white tracking-wide truncate w-full group-hover:text-blue-100">{title}</h3>
      </div>
    </motion.button>
  );

  return (
    <div className="min-h-screen print:min-h-0 w-full bg-[#020617] print:bg-white text-slate-200 print:text-black font-sans relative overflow-x-hidden print:overflow-visible selection:bg-[#3b82f6]/30">
      
      {/* Background inspired by the reference image */}
      <div className="fixed inset-0 pointer-events-none z-0 print:hidden overflow-hidden bg-[#030718]">
        {/* Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        {/* Sweeping Light Rays */}
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[150%] max-w-[1200px] h-[60%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d4ed8]/30 via-transparent to-transparent opacity-80 blur-[80px]"></div>
        <div className="absolute bottom-[-30%] left-1/2 -translate-x-1/2 w-[150%] max-w-[1200px] h-[60%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#2563eb]/20 via-transparent to-transparent opacity-80 blur-[80px]"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: auto; margin: 10mm; }
          .break-after-page { page-break-after: always; break-after: page; }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 6px; }
        ::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}} />

      <div id="report-container" className="relative z-10 w-full min-h-screen flex flex-col items-center pt-2 pb-12 print:block">
        
        {/* Top Header - Tightened margins so everything fits perfectly */}
        <div className="w-full max-w-[1400px] flex flex-col items-center justify-center mb-2 px-6 relative print:hidden">
          <div className="flex items-center gap-2 mb-2 text-[#93c5fd]">
            <Target className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-widest uppercase">NeuralPath Profiler</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white text-center tracking-tight leading-tight max-w-3xl drop-shadow-lg">
            Intelligence Overview <br/>
            for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#3b82f6]">{data.domain || 'Professional'}</span> Readiness
          </h1>
          <button onClick={handleExport} className="mt-4 px-6 py-2 bg-[#1e3a8a]/40 hover:bg-[#1d4ed8]/60 border border-[#3b82f6]/50 text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]">
             <Download className="w-4 h-4" /> Export Report
          </button>
        </div>

        <div className="w-full max-w-[1400px] mx-auto mt-2 print:hidden">
          <AnimatePresence mode="wait">
            {!activeCard ? (
            /* ======================================= */
            /* MAP VIEW - HEIGHT OPTIMIZED TO FIT VIEW */
            /* ======================================= */
            <motion.div 
              key="map-view"
              variants={containerVariants}
              initial={hasAnimated ? false : "hidden"}
              animate="show"
              exit="exit"
              className="relative w-full h-[500px] hidden md:flex items-center justify-center mx-auto"
            >
              {/* SVG Connecting Lines - Adapted for 500px height */}
              <svg viewBox="0 0 1200 500" className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                <defs>
                  <filter id="glowLine">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="lineGradLeft" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="lineGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                
                <motion.g fill="none" strokeWidth="2.5" filter="url(#glowLine)">
                  {/* Left Side Lines */}
                  {/* Center is 600,250. Left cards anchor at x=400 */}
                  <motion.path variants={lineVariants} stroke="url(#lineGradLeft)" d="M 600 250 L 480 250 L 480 120 L 400 120" />
                  <motion.path variants={lineVariants} stroke="url(#lineGradLeft)" d="M 600 250 L 480 250 L 480 380 L 400 380" />
                  
                  {/* Right Side Lines */}
                  {/* Right cards anchor at x=800 */}
                  <motion.path variants={lineVariants} stroke="url(#lineGradRight)" d="M 600 250 L 720 250 L 720 120 L 800 120" />
                  <motion.path variants={lineVariants} stroke="url(#lineGradRight)" d="M 600 250 L 720 250 L 720 380 L 800 380" />
                </motion.g>

                <g fill="#60a5fa" filter="url(#glowLine)">
                  <motion.circle variants={dotVariants} cx="400" cy="120" r="4" />
                  <motion.circle variants={dotVariants} cx="400" cy="380" r="4" />
                  <motion.circle variants={dotVariants} cx="800" cy="120" r="4" />
                  <motion.circle variants={dotVariants} cx="800" cy="380" r="4" />
                  
                  <motion.circle variants={dotVariants} cx="480" cy="250" r="3" />
                  <motion.circle variants={dotVariants} cx="720" cy="250" r="3" />
                </g>
              </svg>

              {/* PREMIUM GLASS ORB SCORE */}
              <motion.div 
                initial={hasAnimated ? false : { scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] z-20 flex items-center justify-center"
              >
                 {/* Intense Backdrop Glow */}
                 <div className={`absolute inset-0 rounded-full blur-[50px] transition-all duration-1000 ${data.score >= 80 ? 'bg-emerald-500/30' : 'bg-[#3b82f6]/40'}`}></div>
                 
                 {/* Solid Glass Orb */}
                 <div className="relative w-full h-full rounded-full bg-gradient-to-b from-[#ffffff10] to-[#00000040] backdrop-blur-2xl border border-white/10 shadow-[inset_0_4px_30px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center overflow-hidden">
                    
                    {/* Animated Scanning Laser inside the glass */}
                    <motion.div 
                      animate={{ top: ['-20%', '120%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-[1px] bg-white/30 shadow-[0_0_15px_rgba(255,255,255,0.8)] z-0"
                    ></motion.div>

                    {/* Subtle Rotating Inner HUD Rings */}
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-[15px] rounded-full border border-dashed border-white/10 z-0"
                    ></motion.div>
                    <motion.div 
                      animate={{ rotate: -360 }} 
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-[25px] rounded-full border-[2px] border-dotted border-white/5 z-0"
                    ></motion.div>

                    {/* SVG Progress Arc */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(96,165,250,0.6)] pointer-events-none z-10">
                       {/* Background Track */}
                       <circle cx="130" cy="130" r="115" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                       
                       {/* Dynamic Progress Ring */}
                       <motion.circle 
                         cx="130" cy="130" r="115" 
                         stroke={data.score >= 80 ? '#10b981' : '#60a5fa'}
                         strokeWidth="6" fill="none"
                         strokeDasharray="723" 
                         initial={hasAnimated ? false : { strokeDashoffset: 723 }}
                         animate={{ strokeDashoffset: 723 - (723 * (displayScore / 100)) }}
                         transition={{ duration: 1, ease: "easeOut", delay: hasAnimated ? 0 : 0.5 }}
                         strokeLinecap="round"
                       />
                    </svg>

                    {/* The Score */}
                    <div className="z-20 flex flex-col items-center justify-center pt-2">
                       <div className="text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-start leading-none tracking-tighter">
                         {displayScore}
                         <span className="text-3xl text-white/50 mt-2 ml-1">%</span>
                       </div>
                       
                       {/* Sleek Pill Badge */}
                       <div className={`mt-5 px-4 py-1.5 rounded-full border backdrop-blur-md flex items-center gap-2
                         ${data.score >= 80 
                           ? 'border-emerald-400/30 bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                           : 'border-[#60a5fa]/30 bg-[#2563eb]/20 text-[#93c5fd] shadow-[0_0_20px_rgba(96,165,250,0.3)]'
                         }`}
                       >
                         <div className={`w-2 h-2 rounded-full ${data.score >= 80 ? 'bg-emerald-400' : 'bg-[#60a5fa]'} animate-pulse`}></div>
                         <span className="text-[10px] font-bold uppercase tracking-[0.1em] pt-0.5">
                           {data.score >= 80 ? 'Market Ready' : 'Dev Required'}
                         </span>
                       </div>
                    </div>
                 </div>
              </motion.div>

              {/* 4 CARDS - Tightly bound in the 500px height */}
              {/* Top Y is 120 (card center). Card height 80 -> top=[80px] */}
              {/* Bottom Y is 380 (card center). Card height 80 -> bottom=[80px] */}
              {/* Left cards right edge is at 400. 600-400=200 -> mr-[200px] */}
              {/* Right cards left edge is at 800. 800-600=200 -> ml-[200px] */}
              <NodeButton id="ats" icon={Search} title="ATS Intelligence" onClick={handleCardClick} positionClass="top-[80px] right-[50%] mr-[200px]" delay={0} />
              <NodeButton id="skills" icon={Zap} title="Skill Proficiency Matrix" onClick={handleCardClick} positionClass="bottom-[80px] right-[50%] mr-[200px]" delay={0} />
              <NodeButton id="projects" icon={Sparkles} title="Strategic Projects Lab" onClick={handleCardClick} positionClass="top-[80px] left-[50%] ml-[200px]" delay={0} />
              <NodeButton id="roadmap" icon={Briefcase} title="Career & Job Alignment" onClick={handleCardClick} positionClass="bottom-[80px] left-[50%] ml-[200px]" delay={0} />
              
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
              className="w-full max-w-[1200px] mx-auto min-h-[600px] bg-[#041033]/80 backdrop-blur-xl border border-[#2563eb]/30 rounded-[2rem] p-8 md:p-12 relative flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <button 
                onClick={() => setActiveCard(null)}
                className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-[#1e3a8a]/40 hover:bg-[#2563eb]/50 border border-[#3b82f6]/30 hover:border-[#60a5fa] rounded-lg text-xs font-bold uppercase tracking-widest text-[#93c5fd] hover:text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Overview
              </button>

              <div className="mt-16 w-full">
                
                {activeCard === 'ats' && (
                  <div className="w-full">
                     <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 mb-10">
                       <Search className="w-10 h-10 text-[#60a5fa]" /> ATS Intelligence Breakdown
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="bg-[#0a1536]/80 border border-[#3b82f6]/30 rounded-3xl p-8 shadow-inner">
                          <h3 className="text-base font-semibold text-[#60a5fa] mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6" /> Detected Strengths
                          </h3>
                          <div className="flex flex-col gap-3">
                            {data.keywordsDetected?.map((kw, i) => {
                              const keyword = typeof kw === 'object' ? kw.keyword : kw;
                              const context = typeof kw === 'object' ? kw.context : null;
                              return (
                              <div key={i} className="p-4 bg-[#030718] border border-[#1e3a8a] rounded-xl">
                                <span className="text-white text-base font-semibold">{keyword}</span>
                                {context && <p className="text-sm text-blue-200/60 mt-1">{context}</p>}
                              </div>
                              );
                            })}
                            {(!data.keywordsDetected || data.keywordsDetected.length === 0) && (
                              <span className="text-slate-500 text-sm italic">None detected</span>
                            )}
                          </div>
                       </div>
                       <div className="bg-[#0a1536]/80 border border-[#ef4444]/20 rounded-3xl p-8 shadow-inner">
                          <h3 className="text-base font-semibold text-[#f87171] mb-6 flex items-center gap-2">
                            <AlertCircle className="w-6 h-6" /> Critical Misses
                          </h3>
                          <div className="flex flex-col gap-3">
                            {data.keywordsMissing?.map((kw, i) => {
                              const keyword = typeof kw === 'object' ? kw.keyword : kw;
                              const context = typeof kw === 'object' ? kw.context : null;
                              return (
                              <div key={i} className="p-4 bg-[#030718] border border-[#7f1d1d]/50 rounded-xl">
                                <span className="text-[#fca5a5] text-base font-semibold">{keyword}</span>
                                {context && <p className="text-sm text-red-200/50 mt-1">{context}</p>}
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
                     <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 mb-10">
                       <Zap className="w-10 h-10 text-[#60a5fa]" /> Skill Proficiency Matrix
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                       <div>
                         <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-6">Validated Expertise</h3>
                         <div className="space-y-8">
                            {data.foundSkills?.map((item, i) => {
                              const skillName = typeof item === 'object' ? item.skill : item;
                              const skillScore = typeof item === 'object' ? item.score : 85;
                              return (
                              <div key={`found-${i}`}>
                                <div className="flex justify-between items-end mb-2">
                                  <span className="text-base font-semibold text-white">{skillName}</span>
                                  <span className="text-base font-bold text-[#60a5fa]">{skillScore}%</span>
                                </div>
                                <div className="h-2 w-full bg-[#030718] rounded-full overflow-hidden border border-[#1e3a8a] mb-2">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${skillScore}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa]"></motion.div>
                                </div>
                                {typeof item === 'object' && item.description && (
                                  <p className="text-sm text-blue-200/60 leading-relaxed">{item.description}</p>
                                )}
                              </div>
                              );
                            })}
                         </div>
                       </div>
                       <div>
                         <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-6">Action Required</h3>
                         <div className="space-y-8">
                            {data.missingSkills?.map((item, i) => {
                              const skillName = typeof item === 'object' ? item.skill : item;
                              const skillScore = typeof item === 'object' ? item.score : 90;
                              return (
                              <div key={`miss-${i}`}>
                                <div className="flex justify-between items-end mb-2">
                                  <span className="text-base font-semibold text-slate-300">{skillName}</span>
                                  <span className="text-base font-bold text-[#f87171]">{skillScore}%</span>
                                </div>
                                <div className="h-2 w-full bg-[#030718] rounded-full overflow-hidden border border-[#7f1d1d] mb-2">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${skillScore}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full bg-[#ef4444]/80"></motion.div>
                                </div>
                                {typeof item === 'object' && item.description && (
                                  <p className="text-sm text-blue-200/60 leading-relaxed">{item.description}</p>
                                )}
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
                     <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 mb-10">
                       <Sparkles className="w-10 h-10 text-[#60a5fa]" /> Strategic Projects Lab
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {projectStage?.projectList?.map((proj, i) => (
                          <div key={i} className="bg-[#0a1536]/80 border border-[#2563eb]/30 rounded-3xl p-8 hover:border-[#60a5fa] transition-colors flex flex-col h-full shadow-lg">
                            <h4 className="text-lg font-bold text-white mb-3">{proj.name}</h4>
                            {proj.desc && <p className="text-sm text-blue-200/70 mb-6 leading-relaxed">{proj.desc}</p>}
                            <ul className="space-y-4 flex-1 bg-[#030718]/50 p-5 rounded-2xl border border-[#1e3a8a]/50">
                              {proj.points?.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <div className="w-2 h-2 rounded-full bg-[#60a5fa] mt-1.5 shrink-0"></div>
                                  <p className="text-sm text-slate-300 font-medium leading-relaxed">{point}</p>
                                </li>
                              ))}
                            </ul>
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
                     <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 mb-10">
                       <Briefcase className="w-10 h-10 text-[#60a5fa]" /> Career & Job Alignment
                     </h2>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                       
                       {/* Roadmap */}
                       <div>
                         <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-8 flex items-center gap-2">
                           <BookOpen className="w-5 h-5 text-[#60a5fa]" /> Phased Curriculum
                         </h3>
                         <div className="space-y-8 relative pl-6 border-l-2 border-[#2563eb]/30">
                            {data.phasedCurriculum?.filter(step => !step.isProject).map((item, i) => (
                              <div key={i} className="relative pl-6">
                                <div className="absolute left-[-31px] top-1 w-3.5 h-3.5 rounded-full bg-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                                <div className="text-xs font-bold text-[#60a5fa] uppercase tracking-widest mb-2">Phase {item.id}</div>
                                <h4 className="text-lg font-semibold text-white tracking-tight mb-3">
                                  {item.title.replace(/_/g, ' ')}
                                </h4>
                                <p className="text-base text-blue-200/60 mb-6 leading-relaxed">{item.primaryGoal}</p>
                                
                                <div className="flex flex-wrap gap-4 mt-2">
                                  {item.title && (
                                    <a href={`https://google.com/search?q=${encodeURIComponent(item.title.replace(/_/g, ' ').replace(/^(LEARN|MASTER|IMPLEMENT)\s+/i, '').trim().toLowerCase())}+learning+roadmap`} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-[#030718] border border-[#1e3a8a] hover:border-[#3b82f6] rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-white uppercase transition-colors whitespace-nowrap shadow-md">
                                      Docs <ExternalLink className="w-4 h-4"/>
                                    </a>
                                  )}
                                  {item.title && (
                                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.title.replace(/_/g, ' ').replace(/^(LEARN|MASTER|IMPLEMENT)\s+/i, '').trim().toLowerCase())}+tutorial+2026`} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-[#1e3a8a]/40 border border-[#2563eb]/50 hover:bg-[#2563eb]/50 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-white uppercase transition-colors whitespace-nowrap shadow-md">
                                      Video <Youtube className="w-4 h-4"/>
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                         </div>
                       </div>

                       {/* Jobs */}
                       <div>
                         <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#60a5fa]" /> Job Search Hub
                          </h3>
                          <div className="space-y-6">
                            {data.liveJobs && data.liveJobs.length > 0 ? data.liveJobs.map((job, i) => (
                              <a key={i} href={getJobSearchUrl(job)} target="_blank" rel="noreferrer" className="block bg-[#0a1536]/80 border border-[#1e3a8a] hover:border-[#3b82f6] rounded-2xl p-6 transition-all group shadow-lg">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="text-base font-semibold text-white group-hover:text-[#60a5fa] transition-colors">{cleanJobTitle(job.title)}</h4>
                                  <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-[#60a5fa] transition-colors" />
                                </div>
                                <div className="text-sm text-blue-200/70 mb-4">{job.company} • {job.location}</div>
                                {job.description && (
                                  <p className="text-xs text-blue-200/40 mb-4 leading-relaxed line-clamp-3">{job.description}</p>
                                )}
                                <div className="flex flex-wrap gap-3">
                                  <span className="px-3 py-1.5 bg-[#1e3a8a]/40 border border-[#2563eb]/30 rounded-md text-xs text-[#93c5fd] font-semibold">{job.type}</span>
                                </div>
                              </a>
                           )) : (
                             <div className="bg-[#0a1536]/80 border border-[#1e3a8a] rounded-2xl p-10 text-center flex flex-col items-center">
                               <Briefcase className="w-10 h-10 text-blue-200/30 mb-4" />
                               <p className="text-blue-200/60 text-base">No live jobs found matching this profile yet.</p>
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

        {/* Scoring Breakdown (Only show in Map View) */}
        <AnimatePresence>
          {!activeCard && (
            <motion.div 
              initial={hasAnimated ? false : { opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ delay: hasAnimated ? 0 : 2, duration: hasAnimated ? 0.4 : 1 }}
              className="w-full max-w-[1400px] mx-auto mt-12 bg-[#041033]/60 backdrop-blur-xl border border-[#1e3a8a] rounded-[2rem] p-8 md:p-14 mb-10 shadow-[0_0_50px_rgba(0,0,0,0.3)] print:hidden relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-50"></div>
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                    <Activity className="w-7 h-7 text-[#60a5fa]" /> Scoring Algorithm Breakdown
                  </h2>
                  <p className="text-sm text-blue-200/60 mt-3 max-w-2xl leading-relaxed">
                    The overall Readiness score is deterministic and strictly computed by evaluating five core vectors, weighted by their industry standard importance.
                  </p>
                </div>
                <div className="text-sm text-[#60a5fa] font-mono bg-[#030718] px-8 py-5 rounded-2xl border border-[#1e3a8a] shadow-inner">
                  Score = 0.30(S) + 0.25(P) + 0.20(E) + 0.15(C) + 0.10(A)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                  { label: "Skills (S)", weight: "30%", weightVal: 0.30, val: data.scoringComponents?.skills || 0 },
                  { label: "Projects (P)", weight: "25%", weightVal: 0.25, val: data.scoringComponents?.projects || 0 },
                  { label: "Experience (E)", weight: "20%", weightVal: 0.20, val: data.scoringComponents?.experience || 0 },
                  { label: "Certifications (C)", weight: "15%", weightVal: 0.15, val: data.scoringComponents?.certifications || 0 },
                  { label: "ATS Formatting (A)", weight: "10%", weightVal: 0.10, val: data.scoringComponents?.atsFormatting || 0 }
                ].map((comp, idx) => {
                  const contribution = (comp.val * comp.weightVal).toFixed(1);
                  return (
                  <div key={idx} className="bg-[#030718]/80 border border-[#1e3a8a] rounded-2xl p-6 flex flex-col items-center justify-center text-center relative group hover:border-[#3b82f6]/50 transition-colors shadow-lg">
                    <span className="text-xs font-semibold text-blue-200/60 uppercase tracking-widest mb-2">{comp.label}</span>
                    <div className="text-4xl font-black text-white my-3">{comp.val}<span className="text-xl text-[#60a5fa]">%</span></div>
                    
                    <div className="w-full flex flex-col gap-2 mt-2">
                      <span className="text-[11px] font-bold text-[#93c5fd] bg-[#1e3a8a]/40 px-3 py-1.5 rounded-lg border border-[#1e3a8a]">
                        Weight: {comp.weight}
                      </span>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-2 rounded-lg shadow-[0_0_15px_rgba(52,211,153,0.15)] uppercase tracking-wider">
                        Contrib: +{contribution}%
                      </span>
                    </div>
                  </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile Fallback for the Nodes */}
        <div className="w-full px-4 flex flex-col gap-4 md:hidden mt-12 print:hidden">
          <NodeButton id="ats" icon={Search} title="ATS Intelligence" onClick={handleCardClick} positionClass="relative w-full !h-[90px]" delay={0} />
          <NodeButton id="skills" icon={Zap} title="Skill Proficiency Matrix" onClick={handleCardClick} positionClass="relative w-full !h-[90px]" delay={0} />
          <NodeButton id="projects" icon={Sparkles} title="Strategic Projects Lab" onClick={handleCardClick} positionClass="relative w-full !h-[90px]" delay={0} />
          <NodeButton id="roadmap" icon={Briefcase} title="Career & Job Alignment" onClick={handleCardClick} positionClass="relative w-full !h-[90px]" delay={0} />
        </div>

        {/* Print View Component */}
        <div className="hidden print:block w-full bg-white">
          <PrintView data={data} projectStage={projectStage} />
        </div>
      </div>
    </div>
  );
};

export default ResultPage;