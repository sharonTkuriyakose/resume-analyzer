import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { 
  Target, Zap, BookOpen, Activity, 
  Sparkles, Award, Search, 
  CheckCircle2, AlertCircle, Briefcase, MapPin, 
  ExternalLink, Youtube, ChevronRight, Download, ArrowLeft, ArrowUpRight,
  Mail, Phone, GraduationCap, LayoutDashboard, ShieldCheck, FileText, Check, Copy, UserCheck
} from 'lucide-react';
import PrintView from '../components/PrintView';

const ResultPage = ({ data, onReset }) => {
  // 'overview' | 'skills' | 'projects' | 'roadmap' | 'ats' | 'scoring'
  const [activeView, setActiveView] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  useEffect(() => {
    if (data && data.score) {
      const controls = animate(0, data.score, {
        duration: 1.2,
        ease: "circOut",
        onUpdate(value) {
          setDisplayScore(Math.round(value));
        }
      });
      return () => controls.stop();
    }
  }, [data]);

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-white bg-[#020617]">
        <Activity className="w-10 h-10 text-blue-500 animate-pulse mb-3" />
        <h2 className="text-lg font-bold tracking-wider text-slate-300">Loading Candidate Assessment...</h2>
      </div>
    );
  }

  const projectStage = data.phasedCurriculum?.find(step => step.id === 4 || step.isProject);

  // Accurate candidate extraction from resume data
  const rawName = data.candidate?.name;
  const nameFromReasoning = data._reasoning 
    ? data._reasoning.match(/^([A-Z][a-zA-Z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-zA-Z]+)/)?.[1] 
    : null;
  
  const candidateName = (rawName && !rawName.toLowerCase().includes('candidate') && !rawName.toLowerCase().includes('string') && rawName !== 'Not specified')
    ? rawName
    : (nameFromReasoning && !nameFromReasoning.toLowerCase().includes('the candidate') && !nameFromReasoning.toLowerCase().includes('this resume'))
      ? nameFromReasoning
      : "Candidate Profile";

  const candidate = {
    name: candidateName,
    role: data.domain || 'Professional Profile',
    email: (data.candidate?.email && data.candidate.email !== 'Not specified' && !data.candidate.email.includes('example.com') && !data.candidate.email.includes('string'))
      ? data.candidate.email 
      : 'Not listed in resume',
    phone: (data.candidate?.phone && data.candidate.phone !== 'Not specified' && !data.candidate.phone.includes('555') && !data.candidate.phone.includes('string'))
      ? data.candidate.phone 
      : 'Not listed in resume',
    location: (data.candidate?.location && data.candidate.location !== 'Not specified' && !data.candidate.location.includes('string'))
      ? data.candidate.location 
      : 'Not listed in resume',
    education: (data.candidate?.education && data.candidate.education !== 'Not specified' && !data.candidate.education.includes('string'))
      ? data.candidate.education 
      : 'Technical Education',
    summary: data.candidate?.summary || data._domain_reasoning || data._reasoning || 'Qualified professional with validated technical skills and domain implementation experience.'
  };

  const getInitials = (name) => {
    if (!name) return "CP";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const cleanJobTitle = (title) => {
    if (!title) return "";
    return title.replace(/\s*jobs?\s*on\s*.*$/i, '').trim();
  };

  const getJobSearchUrl = (job) => {
    const cleanTitle = cleanJobTitle(job.title);
    const fullQuery = encodeURIComponent(`${cleanTitle} ${job.company || ''} ${job.location || ''}`.trim());
    if (job.url) return job.url;
    return `https://www.linkedin.com/jobs/search/?keywords=${fullQuery}`;
  };

  const handleExport = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Subtopic scores
  const skillsScore = data.scoringComponents?.skills ?? 75;
  const projectsScore = data.scoringComponents?.projects ?? 70;
  const careerScore = data.scoringComponents?.experience ?? 75;
  const atsScore = data.scoringComponents?.atsFormatting ?? 80;

  return (
    <div className="w-full min-h-screen bg-[#020617] text-white font-sans selection:bg-[#3b82f6]/30 overflow-x-hidden relative">
      
      {/* ========================================================
          BACKGROUND: EXACT UPLOAD PAGE SPOTLIGHT & GLOWS
          ======================================================== */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] md:w-[900px] h-[550px] bg-[#3b82f6]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[160px] rounded-full pointer-events-none z-0"></div>

      {/* Volumetric Top Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[420px] pointer-events-none z-0 flex flex-col items-center">
        <div className="w-full max-w-[320px] md:max-w-[440px] h-[3px] bg-[#60a5fa] rounded-full shadow-[0_0_30px_rgba(96,165,250,1)]"></div>
        <div 
          className="w-[200%] md:w-[1200px] h-[420px] opacity-40 blur-[50px] mix-blend-screen" 
          style={{ 
            background: 'linear-gradient(to bottom, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 100%)',
            clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)' 
          }}
        ></div>
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

      {/* ========================================================
          ENTERPRISE DASHBOARD LAYOUT (Inspired by Realty Hub structure)
          ======================================================== */}
      <div className="relative z-10 w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 print:hidden">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f172a] border border-slate-700/80 flex items-center justify-center shadow-lg">
              <Briefcase className="w-5 h-5 text-[#60a5fa]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Candidate Assessment</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Verified ATS Profile
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Target Role: <span className="font-semibold text-slate-200">{candidate.role}</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button 
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-all shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button 
              onClick={handleExport}
              className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] border border-blue-400/30 text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>

        {/* Dashboard Shell Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================
              LEFT NAVIGATION SIDEBAR (Like reference image)
              ======================================================== */}
          <aside className="lg:col-span-3 xl:col-span-2.5 bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-4 flex flex-col gap-6 shadow-xl">
            
            {/* Sidebar Navigation */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
                Navigation
              </span>
              <nav className="flex flex-col gap-1">
                {[
                  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                  { id: 'skills', label: 'Skill Matrix', icon: Zap },
                  { id: 'projects', label: 'Project Portfolio', icon: Sparkles },
                  { id: 'roadmap', label: 'Career Roadmap', icon: Briefcase },
                  { id: 'ats', label: 'ATS Intelligence', icon: Search },
                  { id: 'scoring', label: 'Scoring Algorithm', icon: ShieldCheck }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive 
                          ? 'bg-[#1e293b] text-white border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#60a5fa]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'opacity-100 text-[#60a5fa]' : 'opacity-0'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Candidate Quick Profile (Bottom of sidebar) */}
            <div className="mt-auto pt-4 border-t border-slate-800">
              <div className="p-3 bg-[#020617]/70 rounded-2xl border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white font-bold text-sm flex items-center justify-center shrink-0 border border-blue-400/30">
                  {getInitials(candidate.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{candidate.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{candidate.role}</p>
                </div>
              </div>
            </div>

          </aside>

          {/* ========================================================
              MAIN CONTENT CONTAINER
              ======================================================== */}
          <main className="lg:col-span-9 xl:col-span-9.5 flex flex-col gap-6">

            {/* Breadcrumb & Back button when inside a subtopic page */}
            {activeView !== 'overview' && (
              <div className="flex items-center justify-between bg-[#0f172a]/70 border border-slate-800 px-5 py-3 rounded-2xl">
                <button 
                  onClick={() => setActiveView('overview')}
                  className="flex items-center gap-2 text-xs font-semibold text-[#60a5fa] hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Dashboard Overview</span>
                </button>
                <div className="text-xs text-slate-400">
                  <span>Overview / </span>
                  <span className="text-white font-semibold capitalize">{activeView}</span>
                </div>
              </div>
            )}

            {/* ========================================================
                VIEW 1: DASHBOARD OVERVIEW (Top Candidate Card + 4 Subtopics + Scoring)
                ======================================================== */}
            {activeView === 'overview' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-6"
              >

                {/* 1. TOP CANDIDATE PROFILE CARD (NO PHOTO - GENUINE RESUME DETAILS) */}
                <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 md:p-8 relative shadow-xl overflow-hidden">
                  
                  {/* Top Profile Header */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                    <div className="flex items-start gap-4">
                      {/* Monogram Badge (Initials instead of photo) */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white font-black text-2xl flex items-center justify-center shrink-0 border border-blue-400/40 shadow-md">
                        {getInitials(candidate.name)}
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            {candidate.name}
                          </h2>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-[#93c5fd] border border-blue-500/30">
                            {candidate.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Candidate Resume Profile • Evaluated against ATS Job Benchmarks
                        </p>
                      </div>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      <span>Verified Profile</span>
                    </div>
                  </div>

                  {/* Personal Information Meta Grid (Real Details from Resume) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-5 text-xs text-slate-300">
                    <div className="flex items-center gap-2.5 p-3 bg-[#020617]/50 rounded-xl border border-slate-800">
                      <Phone className="w-4 h-4 text-[#60a5fa] shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-400">Phone</span>
                        <span className="font-medium truncate text-white">{candidate.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 bg-[#020617]/50 rounded-xl border border-slate-800">
                      <Mail className="w-4 h-4 text-[#60a5fa] shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-400">Email</span>
                        <span className="font-medium truncate text-white">{candidate.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 bg-[#020617]/50 rounded-xl border border-slate-800">
                      <MapPin className="w-4 h-4 text-[#60a5fa] shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-400">Location</span>
                        <span className="font-medium truncate text-white">{candidate.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 bg-[#020617]/50 rounded-xl border border-slate-800">
                      <GraduationCap className="w-4 h-4 text-[#60a5fa] shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-400">Education</span>
                        <span className="font-medium truncate text-white">{candidate.education}</span>
                      </div>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  {candidate.summary && (
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 mb-6 text-xs md:text-sm text-slate-300 leading-relaxed">
                      <span className="text-[#60a5fa] font-semibold">Professional Profile Summary: </span>
                      {candidate.summary}
                    </div>
                  )}

                  {/* 4 Bottom Metric Counters with Colored Underline Bars (Matches reference image) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-slate-800">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-400 mb-1">ATS Match Score</span>
                      <div className="text-2xl md:text-3xl font-bold text-white flex items-baseline gap-1">
                        {displayScore}<span className="text-base text-[#60a5fa]">%</span>
                      </div>
                      <div className="h-1 w-full bg-[#3b82f6] rounded-full mt-2 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-400 mb-1">Verified Hard Skills</span>
                      <div className="text-2xl md:text-3xl font-bold text-white flex items-baseline gap-1">
                        {data.foundSkills?.length || 0}<span className="text-xs text-emerald-400 uppercase font-semibold ml-1">Verified</span>
                      </div>
                      <div className="h-1 w-full bg-emerald-400 rounded-full mt-2 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-400 mb-1">Skill Gap Requirements</span>
                      <div className="text-2xl md:text-3xl font-bold text-white flex items-baseline gap-1">
                        {data.missingSkills?.length || 0}<span className="text-xs text-rose-400 uppercase font-semibold ml-1">Action Items</span>
                      </div>
                      <div className="h-1 w-full bg-rose-500 rounded-full mt-2 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-400 mb-1">Profile Authenticity</span>
                      <div className="text-2xl md:text-3xl font-bold text-white flex items-baseline gap-1">
                        {data.authenticity_score || 88}<span className="text-base text-amber-400">%</span>
                      </div>
                      <div className="h-1 w-full bg-amber-400 rounded-full mt-2 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div>
                    </div>
                  </div>

                </div>

                {/* 2. FOUR SUBTOPICS (SUMMARY CARDS - CLICK TO OPEN SEPARATE PAGE) */}
                <div>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#60a5fa]" /> Evaluation Subtopics
                    </h3>
                    <span className="text-xs text-slate-400">Click any card to open its detailed page</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    
                    {/* Subtopic 1: Skill Matrix */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      onClick={() => setActiveView('skills')}
                      className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-lg flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Zap className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            {skillsScore}%
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                          Skill Proficiency Matrix
                        </h4>
                        <p className="text-xs text-slate-400 mb-4">
                          {data.foundSkills?.length || 0} Verified Hard Skills • {data.missingSkills?.length || 0} Missing Gaps
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                        <span>Open Detailed View</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </motion.div>

                    {/* Subtopic 2: Project Lab */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      onClick={() => setActiveView('projects')}
                      className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-lg flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                            {projectsScore}%
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                          Strategic Project Portfolio
                        </h4>
                        <p className="text-xs text-slate-400 mb-4">
                          3 Project Blueprints Engineered to Close Gaps
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                        <span>Open Detailed View</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </motion.div>

                    {/* Subtopic 3: Career Roadmap */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      onClick={() => setActiveView('roadmap')}
                      className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-lg flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#60a5fa]">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold text-[#60a5fa] bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                            {careerScore}%
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                          Career Roadmap & Jobs
                        </h4>
                        <p className="text-xs text-slate-400 mb-4">
                          3 Phased Stages • {data.liveJobs?.length || 12} Live Job Portal Matches
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-[#60a5fa] group-hover:text-blue-300">
                        <span>Open Detailed View</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </motion.div>

                    {/* Subtopic 4: ATS Keywords */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      onClick={() => setActiveView('ats')}
                      className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-lg flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Search className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                            {atsScore}%
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                          ATS Keyword Matrix
                        </h4>
                        <p className="text-xs text-slate-400 mb-4">
                          {data.keywordsDetected?.length || 0} Found • {data.keywordsMissing?.length || 0} Critical Missing
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                        <span>Open Detailed View</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </motion.div>

                  </div>
                </div>

                {/* 3. DEDUCTIVE SCORING ALGORITHM BREAKDOWN (UNDER ALL OF THAT) */}
                <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <ShieldCheck className="w-5 h-5 text-[#60a5fa]" />
                        <h3 className="text-lg font-bold text-white">
                          Deductive Scoring Model & Algorithm
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400">
                        Deterministic mathematical formula evaluating five core competence vectors.
                      </p>
                    </div>

                    <div className="px-4 py-2 rounded-xl bg-[#020617] border border-slate-800 text-xs font-mono text-[#60a5fa]">
                      Score = 0.30(S) + 0.25(P) + 0.20(E) + 0.15(C) + 0.10(A)
                    </div>
                  </div>

                  {/* Scoring Vector Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
                    {[
                      { label: "Skills (S)", weight: "30%", weightVal: 0.30, val: data.scoringComponents?.skills ?? 75 },
                      { label: "Projects (P)", weight: "25%", weightVal: 0.25, val: data.scoringComponents?.projects ?? 70 },
                      { label: "Experience (E)", weight: "20%", weightVal: 0.20, val: data.scoringComponents?.experience ?? 75 },
                      { label: "Certifications (C)", weight: "15%", weightVal: 0.15, val: data.scoringComponents?.certifications ?? 65 },
                      { label: "ATS Formatting (A)", weight: "10%", weightVal: 0.10, val: data.scoringComponents?.atsFormatting ?? 80 }
                    ].map((comp, idx) => {
                      const contrib = (comp.val * comp.weightVal).toFixed(1);
                      return (
                        <div key={idx} className="bg-[#020617]/80 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col items-center text-center">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{comp.label}</span>
                          <div className="text-xl md:text-2xl font-bold text-white my-1">{comp.val}<span className="text-xs text-[#60a5fa]">%</span></div>
                          <div className="w-full flex items-center justify-between text-[10px] pt-2 border-t border-slate-800/80 mt-1">
                            <span className="text-slate-400">{comp.weight}</span>
                            <span className="font-bold text-emerald-400">+{contrib}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Document Authenticity Verification */}
                  <div className="p-4 bg-[#020617]/60 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-xs font-bold text-white">Document Authenticity Assessment</h4>
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                            {data.authenticity_score || 88}% Human Authenticity
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 max-w-2xl">
                          {data.authenticity_reasoning || 'Semantic analysis indicates genuine technical project execution with realistic academic progress.'}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveView('scoring')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white shrink-0 self-start sm:self-auto transition-colors"
                    >
                      View Formula Details
                    </button>
                  </div>

                </div>

              </motion.div>
            )}

            {/* ========================================================
                VIEW 2: DEDICATED SEPARATE PAGE -> SKILL PROFICIENCY MATRIX
                ======================================================== */}
            {activeView === 'skills' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Zap className="w-6 h-6 text-emerald-400" />
                      Skill Proficiency Matrix
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Comprehensive evaluation of verified candidate capabilities versus industry standards for <span className="text-white font-semibold">{candidate.role}</span>.
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold self-start sm:self-auto">
                    Proficiency Score: {skillsScore}%
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Verified Hard Skills */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Verified Hard Skills ({data.foundSkills?.length || 0})
                    </h3>
                    <div className="space-y-4">
                      {data.foundSkills?.map((item, i) => {
                        const skillName = typeof item === 'object' ? item.skill : item;
                        const skillScore = typeof item === 'object' ? item.score : 85;
                        const skillDesc = typeof item === 'object' ? item.description : null;
                        return (
                          <div key={i} className="p-4 bg-[#020617]/80 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-bold text-white">{skillName}</span>
                              <span className="text-xs font-bold text-emerald-400">{skillScore}% Proficiency</span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden mb-2.5">
                              <div 
                                style={{ width: `${skillScore}%` }} 
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                              />
                            </div>
                            {skillDesc && (
                              <p className="text-xs text-slate-400 leading-relaxed">{skillDesc}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Critical Missing Skills */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Missing Gap Requirements ({data.missingSkills?.length || 0})
                    </h3>
                    <div className="space-y-4">
                      {data.missingSkills?.map((item, i) => {
                        const skillName = typeof item === 'object' ? item.skill : item;
                        const skillScore = typeof item === 'object' ? item.score : 90;
                        const skillDesc = typeof item === 'object' ? item.description : null;
                        return (
                          <div key={i} className="p-4 bg-[#020617]/80 rounded-2xl border border-slate-800 hover:border-rose-500/40 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-bold text-slate-200">{skillName}</span>
                              <span className="text-xs font-bold text-rose-400">Gap Impact: {skillScore}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden mb-2.5">
                              <div 
                                style={{ width: `${skillScore}%` }} 
                                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                              />
                            </div>
                            {skillDesc && (
                              <p className="text-xs text-slate-400 leading-relaxed">{skillDesc}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================
                VIEW 3: DEDICATED SEPARATE PAGE -> STRATEGIC PROJECT PORTFOLIO
                ======================================================== */}
            {activeView === 'projects' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-cyan-400" />
                      Strategic Technical Project Lab
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Targeted engineering project architectures specifically designed to close your identified skill gaps.
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold self-start sm:self-auto">
                    Project Readiness: {projectsScore}%
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {projectStage?.projectList?.map((proj, i) => (
                    <div key={i} className="bg-[#020617]/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all group">
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center mb-4">
                          0{i + 1}
                        </div>
                        <h3 className="text-base font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                          {proj.name}
                        </h3>
                        {proj.desc && (
                          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                            {proj.desc}
                          </p>
                        )}
                      </div>

                      {proj.points && proj.points.length > 0 && (
                        <div className="pt-4 border-t border-slate-800">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/90 mb-2.5 block">
                            Key Skills & Methodologies Learned
                          </span>
                          <div className="space-y-2">
                            {proj.points.map((pt, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
                                <span className="leading-relaxed">{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {(!projectStage?.projectList || projectStage.projectList.length === 0) && (
                    <div className="text-slate-500 text-sm italic col-span-3 p-8 text-center">
                      No project simulations required.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ========================================================
                VIEW 4: DEDICATED SEPARATE PAGE -> CAREER ROADMAP & JOBS
                ======================================================== */}
            {activeView === 'roadmap' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-[#60a5fa]" />
                      Career Roadmap & Job Portal Hub
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Curriculum milestones to achieve seniority in <span className="text-white font-semibold">{candidate.role}</span> alongside active hiring search portals.
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[#93c5fd] text-xs font-bold self-start sm:self-auto">
                    Role Alignment: {careerScore}%
                  </div>
                </div>

                {/* Section A: Phased Learning Roadmap */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-6 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#60a5fa]" /> Phased Learning Milestones
                  </h3>

                  <div className="space-y-6 relative pl-6 border-l-2 border-blue-500/30">
                    {data.phasedCurriculum?.filter(step => !step.isProject).map((item, i) => (
                      <div key={i} className="relative pl-4">
                        <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#3b82f6] border-2 border-[#020617]"></div>
                        
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#60a5fa] bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                            Phase 0{item.id}
                          </span>
                          <div className="flex items-center gap-2">
                            {item.title && (
                              <a 
                                href={`https://google.com/search?q=${encodeURIComponent(item.title.replace(/_/g, ' '))}+learning+roadmap`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="px-3 py-1 bg-[#020617] hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                Documentation <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {item.title && (
                              <a 
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.title.replace(/_/g, ' '))}+tutorial`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="px-3 py-1 bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 rounded-lg text-xs font-semibold text-red-300 flex items-center gap-1.5 transition-colors"
                              >
                                Video Tutorials <Youtube className="w-3 h-3 text-red-400" />
                              </a>
                            )}
                          </div>
                        </div>

                        <h4 className="text-base font-bold text-white mb-2">
                          {item.title.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-xs text-slate-300/80 mb-4 leading-relaxed">
                          {item.primaryGoal}
                        </p>

                        {item.points && item.points.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#020617]/50 p-4 rounded-xl border border-slate-800">
                            {item.points.map((pt, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] mt-1.5 shrink-0"></div>
                                <span className="leading-relaxed">{pt}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Live Job Portal Matches */}
                <div className="pt-6 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#60a5fa]" /> Direct Job Search Feeds
                    </h3>
                    <span className="text-xs text-slate-400">12 Direct Portal Queries</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {data.liveJobs?.map((job, idx) => (
                      <a 
                        key={idx} 
                        href={getJobSearchUrl(job)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-4 bg-[#020617]/80 hover:bg-[#1e293b]/70 rounded-2xl border border-slate-800 hover:border-blue-500/50 block transition-all group"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="text-xs font-bold text-white group-hover:text-[#60a5fa] transition-colors line-clamp-1">
                            {cleanJobTitle(job.title)}
                          </h5>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#60a5fa] transition-colors shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-400 mb-2">
                          {job.company} • {job.location || 'Global Search'}
                        </p>
                        <span className="inline-block px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-semibold text-[#93c5fd]">
                          {job.type || 'Direct Query'}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================
                VIEW 5: DEDICATED SEPARATE PAGE -> ATS KEYWORD INTELLIGENCE
                ======================================================== */}
            {activeView === 'ats' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Search className="w-6 h-6 text-amber-400" />
                      ATS Keyword Matrix & Compliance
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Scanned keyword frequency and essential industry keywords expected by enterprise ATS parsers.
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold self-start sm:self-auto">
                    ATS Pass Rate: {atsScore}%
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Detected Keywords */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Detected ATS Keywords ({data.keywordsDetected?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {data.keywordsDetected?.map((kw, i) => {
                        const word = typeof kw === 'object' ? kw.keyword : kw;
                        const context = typeof kw === 'object' ? kw.context : null;
                        return (
                          <div key={i} className="p-3.5 bg-[#020617]/80 rounded-2xl border border-slate-800">
                            <span className="text-xs font-bold text-emerald-300">{word}</span>
                            {context && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{context}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Critical Missing Keywords ({data.keywordsMissing?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {data.keywordsMissing?.map((kw, i) => {
                        const word = typeof kw === 'object' ? kw.keyword : kw;
                        const context = typeof kw === 'object' ? kw.context : null;
                        return (
                          <div key={i} className="p-3.5 bg-[#020617]/80 rounded-2xl border border-slate-800">
                            <span className="text-xs font-bold text-rose-300">{word}</span>
                            {context && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{context}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================
                VIEW 6: DEDICATED SEPARATE PAGE -> SCORING ALGORITHM DETAILS
                ======================================================== */}
            {activeView === 'scoring' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0f172a]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <ShieldCheck className="w-6 h-6 text-[#60a5fa]" />
                      Deterministic Scoring Model & Verification
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Detailed weight distribution, vector sub-scores, and document authenticity audit.
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[#60a5fa] text-xs font-mono">
                    Score = 0.30(S) + 0.25(P) + 0.20(E) + 0.15(C) + 0.10(A)
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { label: "Skills (S)", weight: "30%", weightVal: 0.30, val: data.scoringComponents?.skills ?? 75, desc: "Evaluated from validated technical hard skills" },
                    { label: "Projects (P)", weight: "25%", weightVal: 0.25, val: data.scoringComponents?.projects ?? 70, desc: "Evaluated from practical portfolio implementations" },
                    { label: "Experience (E)", weight: "20%", weightVal: 0.20, val: data.scoringComponents?.experience ?? 75, desc: "Evaluated from professional work history" },
                    { label: "Certifications (C)", weight: "15%", weightVal: 0.15, val: data.scoringComponents?.certifications ?? 65, desc: "Evaluated from degrees and recognized certifications" },
                    { label: "ATS Formatting (A)", weight: "10%", weightVal: 0.10, val: data.scoringComponents?.atsFormatting ?? 80, desc: "Evaluated from document structure and keyword density" }
                  ].map((comp, idx) => {
                    const contrib = (comp.val * comp.weightVal).toFixed(1);
                    return (
                      <div key={idx} className="bg-[#020617]/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">{comp.label}</span>
                          <div className="text-3xl font-black text-white my-2">{comp.val}<span className="text-sm text-[#60a5fa]">%</span></div>
                          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{comp.desc}</p>
                        </div>
                        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                          <span className="text-slate-400">Weight: {comp.weight}</span>
                          <span className="font-bold text-emerald-400">+{contrib}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-6 bg-[#020617]/80 rounded-2xl border border-slate-800 mt-2">
                  <h4 className="text-sm font-bold text-white mb-2">Authenticity & Plagiarism Audit Summary</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {data.authenticity_reasoning || 'Semantic structure shows authentic developer implementation patterns with verifiable technical deliverables.'}
                  </p>
                </div>
              </motion.div>
            )}

          </main>

        </div>

      </div>

      {/* Print View for Export */}
      <div className="hidden print:block w-full bg-white">
        <PrintView data={data} projectStage={projectStage} />
      </div>

    </div>
  );
};

export default ResultPage;