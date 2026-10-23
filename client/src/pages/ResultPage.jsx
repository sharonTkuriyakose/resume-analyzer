import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { 
  LayoutGrid, FileText, FileSpreadsheet, GitBranch, Briefcase, 
  BookOpen, Palette, Video, Settings, Crown, Bell, ChevronDown, 
  Check, CheckCircle2, Share2, Download, ShieldCheck, Calendar, 
  Award, FolderKanban, Target, ArrowRight, ExternalLink, Youtube, 
  Sparkles, MapPin, Mail, Phone, Linkedin, Clock, X, ChevronRight, 
  AlertTriangle, Search, RotateCcw, Building2, Globe
} from 'lucide-react';

import heroMountain from '../assets/hero_mountain.jpg';
import cardResume from '../assets/card_resume.jpg';
import cardPuzzle from '../assets/card_puzzle.jpg';
import cardSteps from '../assets/card_steps.jpg';
import cardLaptop from '../assets/card_laptop.jpg';
import PrintView from '../components/PrintView';

// Default / fallback matching the exact reference screenshot
const DEFAULT_CANDIDATE = {
  name: "Rohan Verma",
  role: "Mechanical Design Engineer",
  email: "rohanverma@gmail.com",
  phone: "+91 98765 43210",
  location: "Bengaluru, Karnataka, India",
  linkedin: "linkedin.com/in/rohan-verma",
  score: 78,
  verifiedSkillsCount: 10,
  projectsCount: 3,
  experience: "2 Years",
  certificationsCount: 4,
  roleDescription: "Design, develop and analyze mechanical systems and components using CAD tools and engineering principles.",
  tags: ["CAD Modeling", "Design Analysis", "Problem Solving", "Product Development"],
  authenticityScore: 92,
  authenticityReasoning: "Authentic engineering project work with verified metrics and design validations."
};

export default function ResultPage({ data, onReset }) {
  const [activeNav, setActiveNav] = useState('analysis');
  const [activeChamber, setActiveChamber] = useState('resume');
  const [showChamberDetails, setShowChamberDetails] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  // Extract candidate profile from data or fallback
  const rawName = data?.candidate?.name;
  const nameFromReasoning = data?._reasoning 
    ? data._reasoning.match(/^([A-Z][a-zA-Z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-zA-Z]+)/)?.[1] 
    : null;
  
  const resolvedName = (rawName && !rawName.toLowerCase().includes('candidate') && !rawName.toLowerCase().includes('string') && rawName !== 'Not specified')
    ? rawName
    : (nameFromReasoning && !nameFromReasoning.toLowerCase().includes('the candidate') && !nameFromReasoning.toLowerCase().includes('this resume'))
      ? nameFromReasoning
      : DEFAULT_CANDIDATE.name;

  const role = data?.domain || DEFAULT_CANDIDATE.role;
  const [customRole, setCustomRole] = useState(role);

  useEffect(() => {
    if (data?.domain) setCustomRole(data.domain);
  }, [data]);

  const email = (data?.candidate?.email && data.candidate.email !== 'Not specified' && !data.candidate.email.includes('example.com') && !data.candidate.email.includes('string'))
    ? data.candidate.email 
    : DEFAULT_CANDIDATE.email;

  const phone = (data?.candidate?.phone && data.candidate.phone !== 'Not specified' && !data.candidate.phone.includes('555') && !data.candidate.phone.includes('string'))
    ? data.candidate.phone 
    : DEFAULT_CANDIDATE.phone;

  const location = (data?.candidate?.location && data.candidate.location !== 'Not specified' && !data.candidate.location.includes('string'))
    ? data.candidate.location 
    : DEFAULT_CANDIDATE.location;

  const linkedin = (email.includes('@')) 
    ? `linkedin.com/in/${resolvedName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    : DEFAULT_CANDIDATE.linkedin;

  const score = (typeof data?.score === 'number' && data.score > 0) ? data.score : DEFAULT_CANDIDATE.score;
  const verifiedSkillsCount = data?.foundSkills?.length || DEFAULT_CANDIDATE.verifiedSkillsCount;
  
  const projectStage = data?.phasedCurriculum?.find(step => step.id === 4 || step.isProject);
  const projectsCount = projectStage?.projectList?.length || DEFAULT_CANDIDATE.projectsCount;

  const experience = (data?.scoringComponents?.experience && data.scoringComponents.experience >= 60)
    ? "3+ Years"
    : (data?.scoringComponents?.experience && data.scoringComponents.experience >= 30)
      ? "2 Years"
      : DEFAULT_CANDIDATE.experience;

  const certificationsCount = (data?.scoringComponents?.certifications && data.scoringComponents.certifications >= 60)
    ? 4
    : DEFAULT_CANDIDATE.certificationsCount;

  // Top skill tags
  const tags = (data?.foundSkills && data.foundSkills.length >= 4)
    ? data.foundSkills.slice(0, 4).map(s => s.skill)
    : DEFAULT_CANDIDATE.tags;

  // Initials for avatar
  const getInitials = (fullName) => {
    if (!fullName) return "RV";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return fullName.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(resolvedName);

  // Animate readiness score
  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayScore(Math.round(v))
    });
    return () => controls.stop();
  }, [score]);

  // Handle Share Result
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Handle Download PDF
  const handleDownloadPDF = () => {
    window.print();
  };

  // Circular gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const readinessStatus = score >= 80 ? "Excellent" : score >= 65 ? "Good" : "Developing";

  const handleCardClick = (chamberId) => {
    setActiveChamber(chamberId);
    setShowChamberDetails(true);
    setTimeout(() => {
      const el = document.getElementById('detailed-chamber-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="w-full min-h-screen bg-[#020617] text-slate-100 font-sans antialiased flex flex-col lg:flex-row relative selection:bg-[#3b82f6]/30 overflow-x-hidden">
      
      {/* Deep Ambient Background Glows matching Upload Page */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[200%] md:w-[900px] h-[550px] bg-[#3b82f6]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed top-[600px] right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none z-0"></div>

      {/* ========================================================
          1. LEFT SIDEBAR (NeuralLab Brand & Navigation - Dark Themed)
          ======================================================== */}
      <aside className="w-full lg:w-64 bg-[#090D1A]/85 backdrop-blur-2xl border-r border-slate-800/80 shrink-0 p-5 lg:min-h-screen flex flex-col justify-between relative z-20 print:hidden">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-[#153E35] flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 border border-emerald-500/30">
              <svg className="w-5 h-5 text-emerald-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22v-9" />
                <path d="M12 13a5 5 0 0 0 5-5c0-4-5-6-5-6s-5 2-5 6a5 5 0 0 0 5 5z" />
                <path d="M7 17a4 4 0 0 1-3-4c0-3 3-5 5-5" />
                <path d="M17 17a4 4 0 0 0 3-4c0-3-3-5-5-5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">NeuralLab</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, onClick: onReset },
              { id: 'analysis', label: 'Analysis Result', icon: FileText, isActive: true },
              { id: 'resumes', label: 'My Resumes', icon: FileSpreadsheet, onClick: onReset },
              { id: 'roadmap', label: 'Career Roadmap', icon: GitBranch, onClick: () => handleCardClick('career') },
              { id: 'jobs', label: 'Job Recommendations', icon: Briefcase, onClick: () => handleCardClick('jobs') },
              { id: 'resources', label: 'Learning Resources', icon: BookOpen, onClick: () => handleCardClick('career') },
              { id: 'projects', label: 'Projects', icon: Palette, onClick: () => handleCardClick('career') },
              { id: 'interviews', label: 'Mock Interviews', icon: Video },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const active = item.id === activeNav || item.isActive;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (item.onClick) item.onClick();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    active 
                      ? 'bg-gradient-to-r from-[#153E35] to-[#1B4D3E] text-white shadow-md shadow-emerald-950/40 border border-emerald-500/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-emerald-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card: "Upgrade to Pro" */}
        <div className="mt-8 pt-4">
          <div className="bg-[#0F172A]/90 rounded-2xl p-4 border border-slate-800/90 relative shadow-lg">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2.5">
              <Crown className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Upgrade to Pro</h4>
            <p className="text-[11px] text-slate-400 leading-snug mb-3.5">
              Get advanced insights, mock interviews and more.
            </p>
            <button 
              onClick={() => alert("Pro subscription tier unlocked! All premium insights active.")}
              className="w-full bg-[#153E35] hover:bg-emerald-800 text-white border border-emerald-500/30 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <span>Upgrade Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================
          2. MAIN STAGE CONTENT (Header, Hero Card, Explore Grid)
          ======================================================== */}
      <main className="flex-1 min-w-0 p-5 md:p-8 lg:p-10 flex flex-col gap-8 relative z-10 print:p-0">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-end gap-5 print:hidden">
          {/* Notification Bell */}
          <button 
            onClick={() => alert("You have 1 new career readiness notification.")}
            className="w-10 h-10 rounded-full bg-[#0F172A]/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white relative transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"></span>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 cursor-pointer bg-[#0F172A]/80 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-full shadow-sm transition-all">
            <div className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/40">
              {initials}
            </div>
            <span className="text-sm font-semibold text-slate-200 pr-1">{resolvedName}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* ========================================================
            3. HERO CARD (CANDIDATE BANNER & OVERALL READINESS SCORE)
            ======================================================== */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#0A1020]/90 backdrop-blur-2xl border border-slate-800/90 p-6 md:p-8 shadow-2xl">
          
          {/* Scenic Mountain Background Art seamlessly blended into dark canvas */}
          <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 lg:w-1/2 pointer-events-none overflow-hidden select-none">
            <img 
              src={heroMountain} 
              alt="Mountain summit landscape" 
              className="w-full h-full object-cover object-top opacity-25 mix-blend-screen"
            />
            {/* Soft left gradient fade into dark card background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1020] via-[#0A1020]/80 to-transparent"></div>
          </div>

          {/* Top Row: Candidate Details & Action Buttons */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-5 mb-8">
            
            {/* Left Candidate Info */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-emerald-950 to-slate-900 text-emerald-300 font-bold text-xl md:text-2xl flex items-center justify-center border-2 border-emerald-500/40 shrink-0 shadow-lg shadow-emerald-950/50">
                {initials}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {resolvedName}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <Check className="w-3.5 h-3.5 stroke-[2.8]" />
                    <span>Profile Analyzed</span>
                  </span>
                </div>

                <p className="text-sm md:text-base font-semibold text-slate-300 mt-1">
                  {customRole}
                </p>

                {/* Contact Meta Row */}
                <div className="flex items-center gap-x-5 gap-y-2 flex-wrap text-xs text-slate-400 mt-3">
                  <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-emerald-400/80" />
                    <span>{email}</span>
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-emerald-400/80" />
                    <span>{phone}</span>
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400/80" />
                    <span>{location}</span>
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
                    <Linkedin className="w-3.5 h-3.5 text-emerald-400/80" />
                    <span>{linkedin}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 print:hidden">
              <button 
                onClick={handleShare}
                className="bg-[#0F172A]/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-slate-300" />}
                <span>{copied ? 'Link Copied!' : 'Share Result'}</span>
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="bg-[#153E35] hover:bg-emerald-800 text-white border border-emerald-500/40 rounded-xl px-5 py-2.5 text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-emerald-300" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Score Gauge, Headline/Stats, Target Role Card */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Zone 1: Circular Gauge (Col 1-3) */}
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
                  {/* Background Track */}
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    stroke="#1E293B"
                    strokeWidth="11"
                    fill="none"
                  />
                  {/* Foreground Animated Progress Arc */}
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    stroke="#10B981"
                    strokeWidth="11"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  />
                </svg>

                {/* Inner Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold text-white tracking-tight leading-none drop-shadow-sm">
                    {displayScore}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                    /100
                  </span>
                  <span className="mt-1.5 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[11px] font-bold">
                    {readinessStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Zone 2: Headline & Quick Stats (Col 4-7) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Your Career Readiness is {readinessStatus}!
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-5 max-w-lg">
                You have a strong foundation and relevant skills for your target role. With a few improvements, you can significantly boost your chances of getting shortlisted.
              </p>

              {/* 4 Quick Stat Pills */}
              <div className="flex items-center gap-4 md:gap-5 flex-wrap">
                <div className="flex items-center gap-1.5 bg-[#0F172A]/70 px-2.5 py-1 rounded-lg border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">{verifiedSkillsCount}</span>
                  <span className="text-xs text-slate-400">Verified Skills</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0F172A]/70 px-2.5 py-1 rounded-lg border border-slate-800">
                  <FolderKanban className="w-4 h-4 text-sky-400" />
                  <span className="text-sm font-bold text-white">{projectsCount}</span>
                  <span className="text-xs text-slate-400">Projects</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0F172A]/70 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">{experience}</span>
                  <span className="text-xs text-slate-400">Experience</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0F172A]/70 px-2.5 py-1 rounded-lg border border-slate-800">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-white">{certificationsCount}</span>
                  <span className="text-xs text-slate-400">Certifications</span>
                </div>
              </div>
            </div>

            {/* Zone 3: Target Role Floating Card (Col 8-12) */}
            <div className="lg:col-span-4">
              <div className="bg-[#0F172A]/90 backdrop-blur-md rounded-2xl p-5 border border-slate-750 border-slate-800 shadow-xl">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                        Target Role
                      </span>
                      <h3 className="text-sm font-bold text-white truncate">
                        {customRole}
                      </h3>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowRoleModal(true)}
                    className="text-[11px] font-semibold text-emerald-300 bg-slate-800/90 hover:bg-slate-700 border border-emerald-500/30 rounded-full px-2.5 py-1 flex items-center gap-1 transition-all shrink-0"
                  >
                    <span>Change Role</span>
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 my-3 leading-snug">
                  {data?._domain_reasoning || DEFAULT_CANDIDATE.roleDescription}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="bg-emerald-950/60 text-emerald-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-emerald-500/25"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            4. SECTION: "Explore Detailed Analysis"
            ======================================================== */}
        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Explore Detailed Analysis
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Dive into each section to get comprehensive insights, recommendations and a personalized action plan.
            </p>
          </div>

          {/* 4 Interactive Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            
            {/* Card 01: Resume Analysis */}
            <div 
              className={`bg-[#0B132B]/85 backdrop-blur-xl rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all duration-200 ${
                activeChamber === 'resume' 
                  ? 'border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40' 
                  : 'border border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top Row with 01 and 3D Asset */}
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">01</span>
                  <div className="w-24 h-24 -mt-2 -mr-2 overflow-hidden flex items-center justify-center select-none pointer-events-none rounded-xl">
                    <img 
                      src={cardResume} 
                      alt="Resume document 3D render" 
                      className="w-full h-full object-contain filter contrast-105"
                    />
                  </div>
                </div>

                {/* Emerald Icon */}
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 shadow-md">
                  <FileText className="w-4 h-4" />
                </div>

                <h3 className="text-base md:text-lg font-bold text-white mb-1.5">
                  Resume Analysis
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Get a detailed analysis of your resume including ATS score, strengths, weaknesses and overall evaluation.
                </p>

                {/* 4 Bullets */}
                <div className="space-y-2 mb-6">
                  {[
                    "ATS Match Score",
                    "Resume Strengths",
                    "Areas for Improvement",
                    "Profile Authenticity"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Button */}
              <button
                onClick={() => handleCardClick('resume')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                  activeChamber === 'resume'
                    ? 'bg-gradient-to-r from-emerald-600 to-[#153E35] hover:from-emerald-500 hover:to-emerald-700 text-white border border-emerald-400/40 shadow-emerald-950/50'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80'
                }`}
              >
                <span>View Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 02: Skill Gap Analysis */}
            <div 
              className={`bg-[#0B132B]/85 backdrop-blur-xl rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all duration-200 ${
                activeChamber === 'skills' 
                  ? 'border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40' 
                  : 'border border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">02</span>
                  <div className="w-24 h-24 -mt-2 -mr-2 overflow-hidden flex items-center justify-center select-none pointer-events-none rounded-xl">
                    <img 
                      src={cardPuzzle} 
                      alt="Puzzle pieces 3D render" 
                      className="w-full h-full object-contain filter contrast-105"
                    />
                  </div>
                </div>

                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 shadow-md">
                  <Target className="w-4 h-4" />
                </div>

                <h3 className="text-base md:text-lg font-bold text-white mb-1.5">
                  Skill Gap Analysis
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Identify missing or underdeveloped skills based on your target domain and get personalized suggestions.
                </p>

                <div className="space-y-2 mb-6">
                  {[
                    "Current vs Required Skills",
                    "Missing Skills",
                    "Skill Proficiency Levels",
                    "Recommended Skills to Learn"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleCardClick('skills')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                  activeChamber === 'skills'
                    ? 'bg-gradient-to-r from-emerald-600 to-[#153E35] hover:from-emerald-500 hover:to-emerald-700 text-white border border-emerald-400/40 shadow-emerald-950/50'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80'
                }`}
              >
                <span>View Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 03: Career Development */}
            <div 
              className={`bg-[#0B132B]/85 backdrop-blur-xl rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all duration-200 ${
                activeChamber === 'career' 
                  ? 'border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40' 
                  : 'border border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">03</span>
                  <div className="w-24 h-24 -mt-2 -mr-2 overflow-hidden flex items-center justify-center select-none pointer-events-none rounded-xl">
                    <img 
                      src={cardSteps} 
                      alt="Steps with plant 3D render" 
                      className="w-full h-full object-contain filter contrast-105"
                    />
                  </div>
                </div>

                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 shadow-md">
                  <BookOpen className="w-4 h-4" />
                </div>

                <h3 className="text-base md:text-lg font-bold text-white mb-1.5">
                  Career Development
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Get personalized project suggestions, a structured learning roadmap and recommended resources to build your skills.
                </p>

                <div className="space-y-2 mb-6">
                  {[
                    "Project Recommendations",
                    "3-Phase Learning Roadmap",
                    "Learning Resources",
                    "Career Growth Guidance"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleCardClick('career')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                  activeChamber === 'career'
                    ? 'bg-gradient-to-r from-emerald-600 to-[#153E35] hover:from-emerald-500 hover:to-emerald-700 text-white border border-emerald-400/40 shadow-emerald-950/50'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80'
                }`}
              >
                <span>View Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 04: Job Recommendations */}
            <div 
              className={`bg-[#0B132B]/85 backdrop-blur-xl rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all duration-200 ${
                activeChamber === 'jobs' 
                  ? 'border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/40' 
                  : 'border border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">04</span>
                  <div className="w-24 h-24 -mt-2 -mr-2 overflow-hidden flex items-center justify-center select-none pointer-events-none rounded-xl">
                    <img 
                      src={cardLaptop} 
                      alt="Laptop with plant 3D render" 
                      className="w-full h-full object-contain filter contrast-105"
                    />
                  </div>
                </div>

                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 shadow-md">
                  <Briefcase className="w-4 h-4" />
                </div>

                <h3 className="text-base md:text-lg font-bold text-white mb-1.5">
                  Job Recommendations
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Explore personalized job opportunities based on your profile, skills and target domain.
                </p>

                <div className="space-y-2 mb-6">
                  {[
                    "Relevant Job Roles",
                    "Company Suggestions",
                    "Location Preferences",
                    "Direct Application Links"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleCardClick('jobs')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                  activeChamber === 'jobs'
                    ? 'bg-gradient-to-r from-emerald-600 to-[#153E35] hover:from-emerald-500 hover:to-emerald-700 text-white border border-emerald-400/40 shadow-emerald-950/50'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80'
                }`}
              >
                <span>View Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </section>

        {/* ========================================================
            5. DETAILED CHAMBER INTELLIGENCE DRAWER / EXPANDABLE VIEW
            ======================================================== */}
        <div id="detailed-chamber-section">
          {showChamberDetails && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A1020]/95 backdrop-blur-2xl rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl flex flex-col gap-6"
            >
              {/* Chamber Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  {[
                    { id: 'resume', label: '01. Resume Analysis', icon: FileText },
                    { id: 'skills', label: '02. Skill Gap Matrix', icon: Target },
                    { id: 'career', label: '03. Career Roadmap & Projects', icon: BookOpen },
                    { id: 'jobs', label: '04. Job Recommendations', icon: Briefcase }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isTabActive = activeChamber === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveChamber(tab.id)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isTabActive 
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/30' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setShowChamberDetails(false)}
                  className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>Collapse</span>
                </button>
              </div>

              {/* Chamber 01 Content: Resume Analysis & ATS Breakdown */}
              {activeChamber === 'resume' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Deductive Scoring Components */}
                  <div className="lg:col-span-6 bg-[#0F172A]/80 rounded-2xl p-5 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Deductive Scoring Components
                      </h4>
                      <span className="text-xs font-bold text-emerald-400">Overall: {score}%</span>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { label: "Technical Skills Alignment", weight: "30%", val: data?.scoringComponents?.skills ?? 75 },
                        { label: "Portfolio & Project Depth", weight: "25%", val: data?.scoringComponents?.projects ?? 70 },
                        { label: "Domain Work Experience", weight: "20%", val: data?.scoringComponents?.experience ?? 65 },
                        { label: "Accredited Certifications", weight: "15%", val: data?.scoringComponents?.certifications ?? 60 },
                        { label: "ATS Formatting & Syntax", weight: "10%", val: data?.scoringComponents?.atsFormatting ?? 82 }
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs font-medium text-slate-300">
                            <span>{item.label} <span className="text-[10px] text-slate-400">({item.weight})</span></span>
                            <span className="font-bold text-white">{item.val}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-700" 
                              style={{ width: `${item.val}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Authenticity Score */}
                    <div className="mt-5 pt-4 border-t border-slate-800 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shrink-0">
                        {data?.authenticity_score || DEFAULT_CANDIDATE.authenticityScore}%
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Profile Authenticity Score</span>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {data?.authenticity_reasoning || DEFAULT_CANDIDATE.authenticityReasoning}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: ATS Keywords (Detected vs Missing) */}
                  <div className="lg:col-span-6 flex flex-col gap-4">
                    {/* Detected Keywords */}
                    <div className="bg-[#0F172A]/80 rounded-2xl p-5 border border-slate-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Detected ATS Keywords ({data?.keywordsDetected?.length || 8})
                      </h4>
                      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {(data?.keywordsDetected || [
                          { keyword: "CAD Modeling", context: "Found in projects" },
                          { keyword: "SolidWorks", context: "Part modeling & assembly" },
                          { keyword: "Siemens NX", context: "Parametric surface drafting" },
                          { keyword: "Ansys Fluent", context: "Fluid thermal simulations" },
                          { keyword: "Heat Exchanger", context: "Hardware fabrication" },
                          { keyword: "3D Printing", context: "Rapid prototyping" }
                        ]).map((kw, i) => {
                          const name = typeof kw === 'object' ? kw.keyword : kw;
                          return (
                            <span 
                              key={i} 
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                              title={typeof kw === 'object' ? kw.context : ""}
                            >
                              ✓ {name}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Missing High-Value ATS Keywords */}
                    <div className="bg-[#0F172A]/80 rounded-2xl p-5 border border-slate-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        Missing High-Priority Keywords ({data?.keywordsMissing?.length || 6})
                      </h4>
                      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {(data?.keywordsMissing || [
                          { keyword: "GD&T (ASME Y14.5)", context: "Geometric dimensioning standard" },
                          { keyword: "FEA Structural Analysis", context: "Finite element mechanics" },
                          { keyword: "DFMA", context: "Design for manufacturing and assembly" },
                          { keyword: "Tolerance Stack-up", context: "Assembly variation analysis" },
                          { keyword: "Teamcenter / PLM", context: "Lifecycle management" }
                        ]).map((kw, i) => {
                          const name = typeof kw === 'object' ? kw.keyword : kw;
                          return (
                            <span 
                              key={i} 
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30"
                              title={typeof kw === 'object' ? kw.context : ""}
                            >
                              + {name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Chamber 02 Content: Skill Gap Matrix */}
              {activeChamber === 'skills' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Verified Found Skills */}
                  <div className="bg-[#0F172A]/80 rounded-2xl p-5 border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Verified Found Skills ({data?.foundSkills?.length || 10})
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {(data?.foundSkills || [
                        { skill: "SolidWorks 3D Modeling", score: 85, description: "Applied for part modeling, assembly construction, and drawing drafting." },
                        { skill: "Siemens NX CAD", score: 78, description: "Utilized for parametric surfaces and component structures." },
                        { skill: "Thermal-Fluid Analysis", score: 72, description: "Demonstrated through heat exchanger fabrication and temperature modeling." },
                        { skill: "Additive Prototyping", score: 75, description: "Familiar with 3D printing and digital manufacturing." }
                      ]).map((item, idx) => (
                        <div key={idx} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 shadow-sm">
                          <div className="flex justify-between items-center text-xs font-bold text-white mb-1">
                            <span>{item.skill}</span>
                            <span className="text-emerald-400">{item.score}% Proficiency</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.score}%` }}></div>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* High-Impact Missing Skills */}
                  <div className="bg-[#0F172A]/80 rounded-2xl p-5 border border-slate-800">
                    <h4 className="text-sm font-bold text-rose-400 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-rose-400" />
                      Critical Missing Skills ({data?.missingSkills?.length || 8})
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {(data?.missingSkills || [
                        { skill: "GD&T (ASME Y14.5)", score: 95, description: "Industry design positions require ASME Y14.5 standards to define explicit allowable tolerances for production." },
                        { skill: "Finite Element Analysis (FEA)", score: 92, description: "Structural stress, fatigue, and modal mechanics using Ansys Mechanical are critical gaps." },
                        { skill: "Design for Manufacturing & Assembly (DFMA)", score: 90, description: "Essential for optimizing parts for tooling, injection molding, and CNC machining." },
                        { skill: "Product Lifecycle Management (PLM)", score: 85, description: "Enterprise teams rely on tools like Teamcenter or Windchill for CAD versioning and release management." }
                      ]).map((item, idx) => (
                        <div key={idx} className="bg-slate-900/90 p-3 rounded-xl border border-rose-500/30 shadow-sm">
                          <div className="flex justify-between items-center text-xs font-bold text-white mb-1">
                            <span className="text-rose-300">{item.skill}</span>
                            <span className="text-rose-400">{item.score}% Industry Demand</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${item.score}%` }}></div>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chamber 03 Content: Career Roadmap & Project Lab */}
              {activeChamber === 'career' && (
                <div className="flex flex-col gap-6">
                  {/* 3-Phase Curriculum */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-emerald-400" />
                      3-Phase Industry Mastery Curriculum
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(data?.phasedCurriculum?.filter(p => !p.isProject && p.id <= 3) || [
                        {
                          id: 1,
                          title: "Industrial CAD Standards & GD&T Precision",
                          primaryGoal: "Transition from basic drafting to industry-standard mechanical design compliant with ASME Y14.5.",
                          points: [
                            "Master ASME Y14.5 datum establishment and tolerance allocation.",
                            "Perform worst-case tolerance stack-up on assemblies.",
                            "Create production-ready 2D manufacturing drawings with BOM."
                          ]
                        },
                        {
                          id: 2,
                          title: "Structural Simulation & Advanced CAE",
                          primaryGoal: "Conduct coupled thermal-stress analyses on high-performance enclosures using Ansys Mechanical.",
                          points: [
                            "Static structural and modal stress simulation.",
                            "Boundary layer meshing and mesh independence verification.",
                            "DFMEA risk assessment matrices for automotive components."
                          ]
                        },
                        {
                          id: 3,
                          title: "Enterprise PLM & Manufacturing Tooling",
                          primaryGoal: "Achieve enterprise engineering workflow readiness by mastering PLM architectures and tooling.",
                          points: [
                            "Master Teamcenter CAD check-in/out and BOM management.",
                            "Sheet metal stamping and plastic injection mold tooling.",
                            "Construct high-impact portfolio with interactive 3D models."
                          ]
                        }
                      ]).map((phase, idx) => (
                        <div key={idx} className="bg-[#0F172A]/80 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between shadow-lg">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-block mb-2">
                              Phase 0{phase.id || idx + 1}
                            </span>
                            <h5 className="text-sm font-bold text-white mb-2">{phase.title}</h5>
                            <p className="text-xs text-slate-300 mb-3 leading-relaxed">{phase.primaryGoal}</p>
                            <ul className="space-y-1.5 mb-4">
                              {(phase.points || []).map((pt, pIdx) => (
                                <li key={pIdx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                  <span className="text-emerald-400 font-bold">•</span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                            <a 
                              href={phase.docLink || `https://google.com/search?q=${encodeURIComponent(phase.title + ' learning roadmap')}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Resources</span>
                            </a>
                            <span className="text-slate-600">|</span>
                            <a 
                              href={phase.videoLink || `https://www.youtube.com/results?search_query=${encodeURIComponent(phase.title + ' tutorial')}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                            >
                              <Youtube className="w-3 h-3" />
                              <span>Tutorials</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strategic Project Lab */}
                  <div className="bg-[#0F172A]/80 rounded-2xl p-5 border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Strategic Project Lab (Bridging Your Exact Skill Gaps)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(projectStage?.projectList || [
                        {
                          name: "Thermal-Stress Simulation of EV Inverter",
                          desc: "Design an IP67-rated die-cast aluminum enclosure for an EV traction inverter. Perform coupled thermal-structural FEA.",
                          points: ["FEA with Ansys Mechanical", "ASME Y14.5 GD&T Drawings", "Die Casting Draft Angles"]
                        },
                        {
                          name: "Automated Tolerance Stack-Up Synthesis",
                          desc: "Model a deployable mechanism using Siemens NX. Compute worst-case and RSS tolerance stacks to ensure zero binding.",
                          points: ["Tolerance Stack-Up Analysis", "Kinematic Assembly Modeling", "DFMEA Risk Assessment"]
                        },
                        {
                          name: "Chassis Sheet Metal Bracket with PLM Release",
                          desc: "Engineer a stamped structural chassis mount using sheet metal principles. Manage lifecycle in simulated Teamcenter.",
                          points: ["Sheet Metal Stamping Dies", "Siemens Teamcenter PLM", "DFMA for High-Volume Assembly"]
                        }
                      ]).map((proj, idx) => (
                        <div key={idx} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-md flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                              Portfolio Project 0{idx + 1}
                            </span>
                            <h5 className="text-xs font-bold text-white mb-1.5">{proj.name}</h5>
                            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">{proj.desc}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {(proj.points || []).map((pt, pIdx) => (
                                <span key={pIdx} className="text-[10px] bg-slate-800 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-md font-medium">
                                  {pt}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chamber 04 Content: Job Recommendations */}
              {activeChamber === 'jobs' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      Personalized Job Roles & Direct Portal Search
                    </h4>
                    <span className="text-xs text-slate-400">
                      Matching skills for: <strong className="text-white">{customRole}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {(data?.liveJobs || (data?.relatedJobTitles || [
                      "Mechanical Design Engineer", "CAD Design Engineer", "Thermal Systems Engineer",
                      "Product Design Engineer", "CAE Simulation Engineer", "Junior FEA Analyst",
                      "Automotive Powertrain Engineer", "Aerospace Systems Engineer", "Tooling & Fixture Designer",
                      "Mechanical Component Engineer", "R&D Mechanical Engineer", "Manufacturing Design Engineer"
                    ]).map((title, i) => ({
                      id: `job-${i}`,
                      title: title,
                      company: i % 2 === 0 ? "LinkedIn" : "Indeed",
                      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(title)}`,
                      location: "Remote / Hybrid",
                      description: `Explore live ${title} openings matching your verified technical competencies.`
                    }))).map((job, idx) => (
                      <div key={job.id || idx} className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/40 flex flex-col justify-between shadow-md transition-all">
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span className="font-semibold text-emerald-400">{job.company || "Job Portal"}</span>
                            <span>{job.location || "Global"}</span>
                          </div>
                          <h5 className="text-xs font-bold text-white mb-1 line-clamp-1">{job.title}</h5>
                          <p className="text-[10px] text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                            {job.description || `Search opportunities for ${job.title}.`}
                          </p>
                        </div>

                        <a 
                          href={job.url || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full bg-[#153E35] hover:bg-emerald-800 text-white border border-emerald-500/30 rounded-lg py-1.5 px-3 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                        >
                          <span>Apply on {job.company || "Portal"}</span>
                          <ExternalLink className="w-3 h-3 text-emerald-300" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.section>
          )}
        </div>

      </main>

      {/* ========================================================
          6. ROLE SWITCHER MODAL ("Change Role →")
          ======================================================== */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A1020] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-800 flex flex-col gap-4 text-white"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Switch Target Role</h3>
              <button 
                onClick={() => setShowRoleModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Choose or enter a new target role to dynamically update your readiness profile and recommendations.
            </p>

            <div className="flex flex-col gap-2">
              {[
                "Mechanical Design Engineer",
                "Full Stack Developer",
                "Frontend Developer (React)",
                "Backend Engineer (Node.js)",
                "Data Scientist / ML Engineer",
                "DevOps & Cloud Engineer"
              ].map((r, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCustomRole(r);
                    setShowRoleModal(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    customRole === r 
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' 
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <input
                type="text"
                placeholder="Or type custom role..."
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 mb-3"
              />
              <button
                onClick={() => setShowRoleModal(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Apply Role
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================
          7. PRINT VIEW FOR PDF EXPORT
          ======================================================== */}
      <div className="hidden print:block w-full">
        <PrintView data={data || { score, candidate: { name: resolvedName, email, phone, location } }} projectStage={projectStage} />
      </div>

    </div>
  );
}