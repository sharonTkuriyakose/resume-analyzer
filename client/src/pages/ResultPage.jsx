import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Target, Zap, BookOpen, Activity, Download, 
  Sparkles, Award, ExternalLink, Youtube, Search, 
  CheckCircle2, AlertCircle, User, Briefcase, MapPin, 
  Mail, Calendar, GraduationCap
} from 'lucide-react';

const ResultPage = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleExport = () => window.print();

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-white bg-[#050505]">
        <Activity className="w-12 h-12 text-[#FF6A00] animate-pulse mb-4" />
        <h2 className="text-xl font-black uppercase tracking-widest italic text-slate-300">Neural Lab Synchronizing...</h2>
      </div>
    );
  }

  const projectStage = data.phasedCurriculum?.find(step => step.id === 4 || step.isProject);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-slate-200 font-sans p-4 md:p-8 lg:p-12 selection:bg-[#FF6A00]/30 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#FF6A00]/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#FF6A00]/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .card-bg { border: 1px solid #ddd !important; background: transparent !important; color: black !important; break-inside: avoid; }
        }
        /* Custom scrollbar for webkit */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #FF6A00; }
      `}} />

      <div className="max-w-[1600px] mx-auto relative z-10">
        <motion.main 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col lg:flex-row gap-6 lg:gap-10 h-auto lg:h-[calc(100vh-6rem)]"
        >
          
          {/* ==================================================== */}
          {/* LEFT SIDEBAR (Sticky/Fixed height on Desktop) */}
          {/* ==================================================== */}
          <motion.aside 
            variants={itemVariants}
            className="w-full lg:w-[320px] xl:w-[380px] shrink-0 bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 flex flex-col relative overflow-hidden card-bg shadow-[0_0_50px_rgba(0,0,0,0.8)] h-auto lg:h-full no-print group"
          >
            {/* Sidebar Glow Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6A00]/0 via-transparent to-[#FF6A00]/0 group-hover:from-[#FF6A00]/5 transition-all duration-700 pointer-events-none" />

            {/* Avatar Section */}
            <div className="flex flex-col items-center mt-4">
              <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-[#FF6A00] to-[#FFA040] p-1 mb-6 rotate-3 hover:rotate-0 transition-all duration-300 shadow-[0_0_40px_rgba(255,106,0,0.4)]">
                <div className="w-full h-full bg-[#1A1A1A] rounded-[1.8rem] flex items-center justify-center overflow-hidden">
                  <User className="w-12 h-12 text-[#FF6A00] opacity-90" />
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-md">Analyzed Profile</h2>
              
              {/* Domain Pill */}
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 mb-8 shadow-inner">
                <Briefcase className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{data.domain || 'Professional'}</span>
              </div>
            </div>

            {/* Score Section */}
            <div className="mt-4 mb-8 bg-[#050505] rounded-[1.5rem] p-6 border border-white/10 flex flex-col items-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-[#FF6A00]/5 blur-[20px]"></div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 relative z-10">Market Readiness</div>
              <div className="relative w-32 h-32 flex items-center justify-center z-10">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(255,106,0,0.5)]" viewBox="0 0 320 320">
                  <circle cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="24" fill="transparent" className="text-white/5" />
                  <circle cx="160" cy="160" r="145" stroke="url(#orangeGradient)" strokeWidth="24" fill="transparent" 
                    strokeDasharray={911} strokeDashoffset={911 - (911 * (data.score || 0)) / 100}
                    strokeLinecap="round" className="transition-all duration-1500 ease-out" 
                  />
                  <defs>
                    <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF6A00" />
                      <stop offset="100%" stopColor="#FFA040" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute text-4xl font-black text-white">{data.score || 0}<span className="text-lg text-[#FF6A00]">%</span></span>
              </div>
            </div>

            {/* Download Button */}
            <div className="mt-auto pt-6">
              <button onClick={handleExport} className="w-full py-4 bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] hover:from-[#E65C00] hover:to-[#FF7A00] text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(255,106,0,0.4)] flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download Report
              </button>
            </div>
          </motion.aside>

          {/* ==================================================== */}
          {/* RIGHT CONTENT AREA (Scrollable) */}
          {/* ==================================================== */}
          <motion.div 
            variants={itemVariants}
            className="flex-1 bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] flex flex-col overflow-hidden card-bg shadow-[0_0_50px_rgba(0,0,0,0.8)] h-auto lg:h-full relative"
          >
            {/* Top Border Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF6A00]/50 to-transparent"></div>

            {/* Top Tab Navigation */}
            <div className="flex items-center gap-8 px-8 lg:px-12 pt-8 border-b border-white/5 overflow-x-auto no-print scrollbar-hide">
              {[
                { id: 'overview', label: 'Analysis Overview', icon: Target },
                { id: 'projects', label: 'Projects Lab', icon: Sparkles },
                { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
                { id: 'jobs', label: 'Live Opportunities', icon: Briefcase }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-6 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 relative ${
                    activeTab === tab.id 
                      ? 'border-[#FF6A00] text-[#FF6A00]' 
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-8 h-1 bg-[#FF6A00] blur-[4px]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative z-10">
              
              <AnimatePresence mode="wait">
                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <motion.div 
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-12"
                  >
                    
                    {/* ATS Intelligence */}
                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <Search className="w-4 h-4 text-[#FF6A00]" /> ATS Keyword Intelligence
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* High Impact */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#FF6A00]/30 transition-colors">
                          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> High-Impact Detected
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {data.keywordsDetected?.map((kw, i) => (
                              <span key={i} className="px-3 py-1.5 bg-[#050505] border border-white/10 rounded-lg text-slate-300 text-[10px] font-bold uppercase tracking-wider shadow-inner">{kw}</span>
                            ))}
                            {(!data.keywordsDetected || data.keywordsDetected.length === 0) && (
                              <span className="text-slate-500 text-xs italic">None detected</span>
                            )}
                          </div>
                        </div>

                        {/* Critical Misses */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#FF6A00]/30 transition-colors">
                          <div className="text-[11px] font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> Critical Misses
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {data.keywordsMissing?.map((kw, i) => (
                              <span key={i} className="px-3 py-1.5 bg-[#050505] border border-amber-500/30 rounded-lg text-amber-500 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.1)]">{kw}</span>
                            ))}
                             {(!data.keywordsMissing || data.keywordsMissing.length === 0) && (
                              <span className="text-slate-500 text-xs italic">None missing</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Skills Section */}
                    <section>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#FF6A00]" /> Skill Assessment
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        {/* Validated Expertise */}
                        <div>
                          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-6">Validated Expertise</div>
                          <div className="space-y-5">
                            {data.foundSkills?.map((skill, i) => (
                              <div key={i} className="group">
                                <div className="flex justify-between items-end mb-2">
                                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{skill}</span>
                                  <span className="text-[10px] font-black text-[#FF6A00]">95%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "95%" }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className="h-full bg-gradient-to-r from-[#FF6A00] to-[#FFA040] rounded-full shadow-[0_0_15px_rgba(255,106,0,0.8)]"
                                  ></motion.div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Strategy Gaps */}
                        <div>
                           <div className="text-[11px] font-bold text-amber-500 uppercase tracking-widest mb-6">Strategy Gaps</div>
                           <div className="space-y-5">
                            {data.missingSkills?.map((skill, i) => (
                              <div key={i} className="group">
                                <div className="flex justify-between items-end mb-2">
                                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{skill}</span>
                                  <span className="text-[10px] font-black text-amber-500/80">0%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500/50 w-[5%] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  </motion.div>
                )}

                {/* TAB 2: PROJECTS LAB */}
                {activeTab === 'projects' && (
                  <motion.div 
                    key="projects"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 xl:grid-cols-2 gap-6"
                  >
                    {projectStage?.projectList?.map((proj, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-[1.5rem] p-8 hover:border-[#FF6A00]/50 transition-all duration-300 group flex flex-col h-full shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,106,0,0.15)] relative overflow-hidden">
                        
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6A00]/0 to-transparent group-hover:from-[#FF6A00]/5 transition-colors duration-500"></div>

                        <div className="w-10 h-10 rounded-xl bg-[#050505] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#FF6A00]/50 transition-all relative z-10 shadow-inner">
                          <Sparkles className="w-5 h-5 text-[#FF6A00]" />
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight leading-snug mb-6 group-hover:text-[#FF6A00] transition-colors relative z-10">
                          {proj.name}
                        </h4>
                        <div className="space-y-4 mt-auto relative z-10">
                          {proj.points?.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(255,106,0,0.8)]"></div>
                              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                {point}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {(!projectStage?.projectList || projectStage.projectList.length === 0) && (
                      <div className="text-slate-500 text-sm italic">No project recommendations generated.</div>
                    )}
                  </motion.div>
                )}

                {/* TAB 3: CURRICULUM */}
                {activeTab === 'curriculum' && (
                  <motion.div 
                    key="curriculum"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-3xl"
                  >
                     <div className="relative pl-4 md:pl-8">
                       {/* Vertical Timeline Line */}
                       <div className="absolute left-[11px] md:left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-[#FF6A00]/50 via-white/10 to-transparent"></div>
                       
                       <div className="space-y-12">
                        {data.phasedCurriculum?.map((item, i) => (
                          <div key={i} className="relative pl-8 md:pl-12 group">
                            {/* Timeline Dot */}
                            <div className={`absolute left-[-16px] md:left-[-12px] top-1.5 w-3 h-3 rounded-full border-2 border-[#111] z-10 transition-all
                              ${item.id === 2 ? 'bg-[#FF6A00] shadow-[0_0_15px_rgba(255,106,0,1)] scale-125' : 'bg-white/20 group-hover:bg-[#FF6A00]'}
                            `}></div>
                            
                            <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 md:p-8 hover:border-[#FF6A00]/40 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(255,106,0,0.1)] relative overflow-hidden">
                              
                              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6A00]/5 blur-[50px] pointer-events-none"></div>

                              <div className="text-[10px] font-black text-[#FF6A00] uppercase tracking-widest mb-2 relative z-10">Phase {item.id}</div>
                              <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-3 relative z-10">{item.title}</h4>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-6 pb-6 border-b border-white/5 relative z-10">{item.primaryGoal}</p>
                              
                              {!item.isProject && (
                                <ul className="mb-6 space-y-3 relative z-10">
                                  {item.points?.map((p, idx) => (
                                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-3">
                                      <span className="text-[#FF6A00] mt-[-1px] font-black opacity-80">›</span> {p}
                                    </li>
                                  ))}
                                </ul>
                              )}

                              <div className="flex flex-col sm:flex-row gap-3 pt-2 relative z-10">
                                {item.docLink && (
                                  <a href={item.docLink} target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-[#050505] border border-white/10 hover:border-[#FF6A00]/50 hover:bg-[#FF6A00]/10 rounded-xl text-[10px] font-black uppercase text-white flex items-center justify-center gap-2 transition-all shadow-inner">
                                    Documentation <ExternalLink className="w-3 h-3"/>
                                  </a>
                                )}
                                {item.videoLink && (
                                  <a href={item.videoLink} target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-[#FF6A00]/10 hover:bg-[#FF6A00]/20 text-[#FF6A00] rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all border border-[#FF6A00]/20">
                                    Video Guide <Youtube className="w-3 h-3"/>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                       </div>
                     </div>
                  </motion.div>
                )}

                {/* TAB 4: LIVE OPPORTUNITIES */}
                {activeTab === 'jobs' && (
                  <motion.div 
                    key="jobs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 xl:grid-cols-2 gap-6"
                  >
                    {data.liveJobs?.map((job, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-[1.5rem] p-8 hover:border-[#FF6A00]/50 transition-all duration-300 group flex flex-col h-full shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,106,0,0.15)] relative overflow-hidden">
                        
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6A00]/0 to-transparent group-hover:from-[#FF6A00]/5 transition-colors duration-500"></div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-[#050505] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-[#FF6A00]/50 transition-all shadow-inner">
                            <Briefcase className="w-5 h-5 text-[#FF6A00]" />
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-300 text-[9px] font-bold uppercase tracking-wider">{job.type}</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.location}</span>
                            </div>
                        </div>
                        
                        <h4 className="text-xl font-black text-white uppercase tracking-tight leading-snug mb-2 group-hover:text-[#FF6A00] transition-colors relative z-10">
                          {job.title}
                        </h4>
                        <div className="text-[11px] font-bold text-[#FF6A00] uppercase tracking-widest mb-4 relative z-10">{job.company}</div>

                        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6 relative z-10">
                          {job.description}
                        </p>

                        <div className="mt-auto relative z-10">
                            <a href={job.url} target="_blank" rel="noreferrer" className="w-full py-3 bg-[#050505] border border-white/10 hover:border-[#FF6A00]/50 hover:bg-[#FF6A00]/10 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all shadow-inner group-hover:shadow-[0_0_15px_rgba(255,106,0,0.3)]">
                                Apply Now <ExternalLink className="w-4 h-4"/>
                            </a>
                        </div>
                      </div>
                    ))}
                    {(!data.liveJobs || data.liveJobs.length === 0) && (
                      <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-500">
                        <Activity className="w-8 h-8 text-[#FF6A00]/50 mb-4 opacity-50" />
                        <p className="text-sm italic text-center max-w-sm">No exact matching remote jobs found on the live board for this specific domain at this moment.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

export default ResultPage;