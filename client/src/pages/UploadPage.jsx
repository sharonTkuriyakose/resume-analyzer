import React from 'react';
import ResumeUpload from '../components/ResumeUpload';
import { motion } from 'framer-motion';
import { 
  Search, Target, Map, Activity, 
  Database, ShieldCheck, Zap, Server,
  FileText, Cpu, BrainCircuit, LayoutDashboard
} from 'lucide-react';

const UploadPage = ({ onAnalysisComplete, apiUrl }) => {
  return (
    <div className="w-full bg-[#050505] font-sans selection:bg-[#10b981]/30">
      
      {/* ========================================================
          SECTION 1: HERO (Dark Theme with Glowing Curves)
          ======================================================== */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden">
        
        {/* Background Sweeping SVG Curves */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg viewBox="0 0 1200 800" className="w-full h-full opacity-60" preserveAspectRatio="xMidYMid slice">
            <defs>
              <filter id="glow-hero" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <motion.path 
              d="M -200,600 Q 600,300 1400,600" 
              fill="none" stroke="#10b981" strokeWidth="2" filter="url(#glow-hero)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
            <motion.path 
              d="M -200,700 Q 600,400 1400,700" 
              fill="none" stroke="#34d399" strokeWidth="1" filter="url(#glow-hero)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.path 
              d="M 200,0 Q 600,300 1000,0" 
              fill="none" stroke="#10b981" strokeWidth="1.5" filter="url(#glow-hero)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 2.5, ease: "easeInOut", delay: 0.4 }}
            />
          </svg>
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10b981]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

        {/* Floating Background Nodes */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <motion.div 
            animate={{ 
              y: [0, -40, 0],
              x: [0, 20, -10, 0],
              rotate: [0, 10, -5, 0],
            }} 
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }} 
            className="absolute top-[20%] left-4 md:left-[15%] w-12 h-12 md:w-16 md:h-16 bg-black/60 backdrop-blur-md border border-[#10b981]/40 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            <Search className="w-6 h-6 md:w-8 md:h-8 text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </motion.div>

          <motion.div 
            animate={{ 
              y: [0, 30, -20, 0],
              x: [0, -30, 15, 0],
              rotate: [0, -10, 5, 0],
            }} 
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1 
            }} 
            className="absolute top-[60%] right-4 md:right-[15%] w-12 h-12 md:w-16 md:h-16 bg-black/60 backdrop-blur-md border border-[#10b981]/40 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            <Target className="w-6 h-6 md:w-8 md:h-8 text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </motion.div>

          <motion.div 
            animate={{ 
              y: [0, -50, 20, 0],
              x: [0, 20, -20, 0],
              rotate: [0, 15, -15, 0],
            }} 
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2 
            }} 
            className="absolute top-[15%] right-[10%] md:right-[30%] w-10 h-10 md:w-12 md:h-12 bg-black/60 backdrop-blur-md border border-[#10b981]/40 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] hidden sm:flex"
          >
            <BrainCircuit className="w-5 h-5 md:w-6 md:h-6 text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
          </motion.div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 relative"
          >
            {/* Center Graphic */}
            <div className="w-24 h-24 bg-black border border-[#10b981]/50 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
               <Activity className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
               <div className="absolute top-0 w-[1px] h-4 bg-[#10b981]"></div>
               <div className="absolute bottom-0 w-[1px] h-4 bg-[#10b981]"></div>
               <div className="absolute left-0 h-[1px] w-4 bg-[#10b981]"></div>
               <div className="absolute right-0 h-[1px] w-4 bg-[#10b981]"></div>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-lg"
          >
            Inference at the Edge.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm md:text-lg max-w-2xl mb-12 font-medium"
          >
            Instantly detect skill gaps in your profile and generate an automated, project-based learning roadmap to reach your career goals.
          </motion.p>

          {/* Upload Component styled as a sleek button */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-sm mb-16"
          >
            <ResumeUpload onResult={onAnalysisComplete} apiUrl={apiUrl} />
          </motion.div>

          {/* Three small feature pills */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-8 mt-8"
          >
            {[
              { icon: <Search/>, title: "Deep Scan" },
              { icon: <Target/>, title: "Gap Detection" },
              { icon: <Map/>, title: "Live Roadmap" }
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-3 bg-black/50 border border-white/10 hover:border-[#10b981]/50 rounded-2xl backdrop-blur-md transition-colors cursor-default shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <div className="w-8 h-8 rounded-full bg-[#10b981]/10 flex items-center justify-center border border-[#10b981]/20">
                   {React.cloneElement(feat.icon, {className: "w-4 h-4 text-[#10b981]"})}
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-widest">{feat.title}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ========================================================
          SECTION 2: DARK THEME STATS & PROCESSING ENGINE
          ======================================================== */}
      <section id="performance" className="w-full bg-[#050505] text-white py-24 md:py-32 relative border-t border-emerald-500/10">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-10">
             <circle cx="50" cy="50" r="40" fill="#10b981" filter="blur(40px)" />
          </svg>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="flex justify-center mb-6">
            <span className="px-4 py-1.5 bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              Processing Pipeline
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-center mb-16 tracking-tight text-white drop-shadow-lg">
            How we analyze your profile
          </h2>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch">
            
            {/* Left Card: Dark Green Visual */}
            <div className="flex-1 bg-black/40 border border-emerald-500/20 rounded-[2rem] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between shadow-[0_0_30px_rgba(16,185,129,0.15)] min-h-[400px]">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute inset-0 pointer-events-none">
                 <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
                    <circle cx="20" cy="80" r="40" fill="#10b981" filter="blur(30px)" />
                 </svg>
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-black/50 border border-[#10b981]/30 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Server className="w-6 h-6 text-[#10b981]" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">Analysis Engine</h3>
              </div>
              <div className="relative z-10 mt-12 text-[#34d399] font-medium text-sm">
                 Explore the seamless workflow of our intelligent engine, designed to evaluate your current skills and provide actionable insights to elevate your career trajectory.
              </div>
            </div>

            {/* Right Side: List of Stats */}
            <div className="flex-1 flex flex-col justify-center gap-6">
              {[
                { title: "Document Parsing", val: "Step 1", desc: "Extracts raw text and structure from your uploaded PDF." },
                { title: "Skill Extraction", val: "Step 2", desc: "Identifies core competencies and technical skills using NLP." },
                { title: "Gap Analysis", val: "Step 3", desc: "Evaluates your profile against target industry standards." },
                { title: "Roadmap Generation", val: "Step 4", desc: "Creates a personalized, project-based learning path." }
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.15, duration: 0.6, type: "spring", stiffness: 100 }}
                  whileHover={{ scale: 1.02, x: -5 }}
                  className="flex items-start gap-4 p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-[#10b981]/50 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all cursor-default group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center shrink-0 mt-1 group-hover:bg-[#10b981]/20 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">{stat.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-sm font-bold text-[#10b981]">{stat.val}</span>
                       <span className="text-xs text-slate-400">{stat.desc}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>
      
      {/* ========================================================
          NEW SECTION: ARCHITECTURE PIPELINE & LIMITATIONS
          ======================================================== */}
      
      {/* Architecture Section */}
      <section id="architecture" className="w-full bg-[#050505] py-24 px-4 sm:px-8 xl:px-0 relative border-t border-white/5">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">System <span className="text-[#10b981]">Architecture</span></h2>
             <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-sm md:text-base">
               A transparent, end-to-end pipeline from document parsing to actionable career roadmaps.
             </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative py-12">
             {/* Animated Connector Line (Horizontal for Desktop) */}
             <div className="hidden md:block absolute top-1/2 left-[5%] w-[90%] h-1 bg-white/5 -translate-y-1/2 z-0 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 w-1/3"
                 animate={{ x: ['-100%', '300%'] }}
                 transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
               />
             </div>

             {/* Animated Connector Line (Vertical for Mobile) */}
             <div className="block md:hidden absolute top-[5%] left-1/2 w-1 h-[90%] bg-white/5 -translate-x-1/2 z-0 rounded-full overflow-hidden">
               <motion.div 
                 className="w-full bg-gradient-to-b from-emerald-500/0 via-emerald-500 to-emerald-500/0 h-1/3"
                 animate={{ y: ['-100%', '300%'] }}
                 transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
               />
             </div>

             {[
               { icon: FileText, label: "Resume PDF" },
               { icon: Cpu, label: "Parsing Engine" },
               { icon: ShieldCheck, label: "Authenticator" },
               { icon: Target, label: "Skill Extraction" },
               { icon: Activity, label: "Deductive Scoring" },
               { icon: BrainCircuit, label: "LLM Gap Analysis" },
               { icon: LayoutDashboard, label: "Dashboard" }
             ].map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="bg-[#111] border border-emerald-500/20 p-4 rounded-xl flex flex-col items-center justify-center gap-3 w-full md:w-[140px] h-32 relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.1)] group hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all cursor-default"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <step.icon className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                  </div>
                  <span className="text-[10px] font-black text-slate-300 text-center uppercase tracking-wider">{step.label}</span>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Limitations Section */}
      <section id="scope" className="w-full bg-[#111] py-16 px-4 sm:px-8 xl:px-0 relative border-t border-emerald-500/10 shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest mb-8 flex items-center justify-center gap-3">
             <ShieldCheck className="w-5 h-5" /> System Scope & Capabilities
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
             {["Multi-Domain Analysis", "Universal Role Detection", "LLM-Dependent Quality", "Requires Standard ATS Formats"].map((lim, i) => (
               <motion.span 
                 key={i}
                 initial={{ opacity: 0, scale: 0.9, y: 10 }}
                 whileInView={{ opacity: 1, scale: 1, y: 0 }}
                 viewport={{ once: true }}
                 whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}
                 transition={{ delay: i * 0.1, duration: 0.3 }}
                 className="px-5 py-2.5 bg-black/50 border border-white/10 text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full hover:border-emerald-500 hover:text-emerald-400 transition-all cursor-default shadow-[0_0_10px_rgba(0,0,0,0.3)]"
               >
                 {lim}
               </motion.span>
             ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default UploadPage;