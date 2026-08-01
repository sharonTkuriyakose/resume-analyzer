import React from 'react';
import ResumeUpload from '../components/ResumeUpload';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Map, Cpu, Zap, 
  Search, BarChart3, Globe, Sparkles,
  Award, Target, ArrowRight, CheckCircle2, Activity
} from 'lucide-react';

const UploadPage = ({ onAnalysisComplete }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div className="w-full bg-[#050505] text-slate-200 font-sans selection:bg-[#06b6d4]/30 overflow-x-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        html, body, #root { 
          margin: 0 !important; 
          padding: 0 !important; 
          background-color: #050505 !important; 
          width: 100%;
          min-height: 100%;
          scroll-behavior: smooth;
        }
        /* Hide scrollbar for clean cinematic look */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #050505; 
        }
        ::-webkit-scrollbar-thumb {
          background: #333; 
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555; 
        }
      `}} />

      <main className="relative w-full flex flex-col items-center">
        
        {/* ========================================================
            SECTION 1: DASHBOARD HERO (Circuit Animation)
            ======================================================== */}
        <section className="w-full flex flex-col items-center justify-start pt-4 md:pt-12 min-h-screen relative overflow-hidden">
          {/* BACKGROUND NOISE / AMBIENT */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0"></div>

          {/* HEADER AREA */}
          <div className="text-center space-y-6 flex flex-col items-center relative z-20 px-4 mt-8 md:mt-0 w-full max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="inline-flex items-center gap-3 px-4 md:px-6 py-2 md:py-3 bg-[#111] border border-[#333] rounded-full shadow-lg backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#06b6d4]" />
              <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-300">
                Neural Architecture
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="text-4xl sm:text-6xl lg:text-[5rem] font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl"
            >
              Inference at the Edge.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="text-sm md:text-xl text-slate-400 max-w-3xl text-center leading-relaxed font-medium px-4"
            >
               Instantly detect skill gaps in your profile and generate an automated, project-based learning roadmap to reach your career goals. Enjoy unparalleled performance with our best-in-class analysis engine.
            </motion.p>
          </div>

          {/* NEURAL CIRCUIT DASHBOARD */}
          <div className="relative w-full max-w-7xl h-[600px] md:h-[700px] mt-12 md:mt-16 flex items-center justify-center">
            
            {/* SVG Circuit Lines */}
            <div className="absolute inset-0 hidden md:block z-10">
              <svg viewBox="0 0 1200 800" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                     <feGaussianBlur stdDeviation="6" result="blur" />
                     <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Dim Background Lines */}
                <g fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2">
                  <path d="M 600 400 L 600 150 L 200 150" />
                  <path d="M 600 400 L 600 150 L 1000 150" />
                  <path d="M 600 400 L 600 650 L 200 650" />
                  <path d="M 600 400 L 600 650 L 1000 650" />
                </g>

                {/* Glowing Animated Lines */}
                <motion.g fill="none" stroke="#06b6d4" strokeWidth="3" filter="url(#glow)">
                  <motion.path initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration: 2.5, delay: 1, ease: "easeOut"}} d="M 600 400 L 600 150 L 200 150" />
                  <motion.path initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration: 2.5, delay: 1, ease: "easeOut"}} d="M 600 400 L 600 150 L 1000 150" />
                  <motion.path initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration: 2.5, delay: 1.2, ease: "easeOut"}} d="M 600 400 L 600 650 L 200 650" />
                  <motion.path initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration: 2.5, delay: 1.2, ease: "easeOut"}} d="M 600 400 L 600 650 L 1000 650" />
                </motion.g>
              </svg>
            </div>

            {/* FLOATING NODES */}
            <div className="absolute inset-0 hidden md:block pointer-events-none z-20">
               {/* Top Left */}
               <motion.div initial={{opacity:0, scale:0}} animate={{opacity:1, scale:1}} transition={{delay: 3, type: "spring"}} className="absolute top-[18.75%] left-[16.66%] -translate-x-1/2 -translate-y-1/2">
                 <div className="w-16 h-16 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-xl">
                   <Cpu className="w-8 h-8 text-white/70" />
                 </div>
               </motion.div>
               {/* Top Right */}
               <motion.div initial={{opacity:0, scale:0}} animate={{opacity:1, scale:1}} transition={{delay: 3.1, type: "spring"}} className="absolute top-[18.75%] left-[83.33%] -translate-x-1/2 -translate-y-1/2">
                 <div className="w-16 h-16 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-xl">
                   <Zap className="w-8 h-8 text-white/70" />
                 </div>
               </motion.div>
               {/* Bottom Left */}
               <motion.div initial={{opacity:0, scale:0}} animate={{opacity:1, scale:1}} transition={{delay: 3.2, type: "spring"}} className="absolute top-[81.25%] left-[16.66%] -translate-x-1/2 -translate-y-1/2">
                 <div className="w-16 h-16 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-xl">
                   <Target className="w-8 h-8 text-white/70" />
                 </div>
               </motion.div>
               {/* Bottom Right */}
               <motion.div initial={{opacity:0, scale:0}} animate={{opacity:1, scale:1}} transition={{delay: 3.3, type: "spring"}} className="absolute top-[81.25%] left-[83.33%] -translate-x-1/2 -translate-y-1/2">
                 <div className="w-16 h-16 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-xl">
                   <Globe className="w-8 h-8 text-white/70" />
                 </div>
               </motion.div>
            </div>

            {/* UPLOAD CARD (CENTER ENGINE) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="relative z-30 w-full max-w-xl px-4 md:px-0"
            >
              <div className="absolute inset-0 bg-[#06b6d4]/20 blur-[100px] rounded-full -z-10 animate-pulse"></div>
              
              <div className="bg-[#0A0C10]/95 backdrop-blur-3xl p-6 md:p-12 rounded-[2.5rem] border border-[#06b6d4]/30 shadow-[0_0_80px_rgba(6,182,212,0.15)] relative w-full flex flex-col items-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#06b6d4] to-transparent opacity-50"></div>
                
                {/* Core Node Icon */}
                <motion.div 
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 2, delay: 1 }}
                  className="w-16 h-16 md:w-20 md:h-20 bg-[#06b6d4]/10 border border-[#06b6d4]/40 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                >
                   <Activity className="w-8 h-8 md:w-10 md:h-10 text-[#06b6d4]" />
                </motion.div>

                <div className="w-full pointer-events-auto">
                  <ResumeUpload onResult={onAnalysisComplete} apiUrl={API_BASE_URL} />
                </div>
              </div>
            </motion.div>

          </div>
        </section>


        {/* ========================================================
            SECTION 2: FEATURES GRID (Smooth Scroll Reveal)
            ======================================================== */}
        <motion.section 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[1700px] mx-auto px-6 md:px-12 space-y-12 md:space-y-20 py-24 md:py-32 relative z-20"
        >
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-8">
            <div className="px-6 md:px-8 py-2 md:py-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.4em]">
              System Architecture
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-white tracking-tight uppercase text-center">Unleash your AI application's full potential</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: <Search/>, title: "Deep Scan", desc: "Scanning competencies with high-precision parsing logic." },
              { icon: <Target/>, title: "Gap Detection", desc: "Identifying exactly which tools and frameworks are missing." },
              { icon: <Map/>, title: "Live Roadmap", desc: "Personalized learning paths with documentation and resources." }
            ].map((feature, i) => (
              <div key={i} className="group bg-[#111111]/90 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 hover:border-[#06b6d4]/40 transition-all duration-500 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#06b6d4]/0 via-transparent to-[#06b6d4]/0 group-hover:from-[#06b6d4]/10 transition-all duration-700 pointer-events-none" />
                
                <div className="w-14 h-14 md:w-20 md:h-20 bg-[#1A1A1A] text-[#06b6d4] rounded-2xl md:rounded-3xl flex items-center justify-center mb-8 md:mb-10 shadow-[0_0_15px_rgba(6,182,212,0.1)] border border-white/5 group-hover:-translate-y-2 transition-transform duration-500">
                  {React.cloneElement(feature.icon, {className: "w-7 h-7 md:w-9 md:h-9"})}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-4 md:mb-6 uppercase tracking-tight relative z-10">{feature.title}</h3>
                <p className="text-sm md:text-lg text-slate-400 leading-relaxed font-medium relative z-10">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ========================================================
            SECTION 3: SYSTEM STATS (The Glowing Globe)
            ======================================================== */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full relative py-32 md:py-48 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* THE GIANT GLOWING GLOBE */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
             {/* Halo Glow */}
             <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#06b6d4]/50 rounded-full blur-[100px] md:blur-[120px]"></div>
             
             {/* The Sphere */}
             <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full border border-[#06b6d4]/30 bg-[radial-gradient(circle_at_30%_30%,_rgba(6,182,212,0.4)_0%,_rgba(5,5,5,1)_80%)] shadow-[inset_0_0_100px_rgba(6,182,212,0.8),0_0_40px_rgba(6,182,212,0.3)] relative overflow-hidden flex items-center justify-center">
                {/* Dotted Grid / Lat Long Lines */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center"
                >
                  <div className="absolute w-[200%] h-[2px] bg-[#06b6d4]/60 rotate-45 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                  <div className="absolute w-[200%] h-[2px] bg-[#06b6d4]/60 -rotate-45 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                  <div className="absolute w-[200%] h-[2px] bg-[#06b6d4]/60 rotate-12 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                  <div className="absolute w-[200%] h-[2px] bg-[#06b6d4]/60 -rotate-12 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                </motion.div>
                {/* Fake rotation animation on texture */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
             </div>
          </div>

          <div className="relative z-10 w-full max-w-[1700px] mx-auto px-6 md:px-12 flex flex-col items-center">
            
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase text-center mb-16 md:mb-24 drop-shadow-2xl max-w-4xl">
              A truly global network for lightning-fast inference
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 text-center w-full max-w-5xl bg-[#050505]/60 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl">
              {[
                { label: "Analyzed", val: "50+", icon: <Cpu /> },
                { label: "Accuracy", val: "99%", icon: <Award /> },
                { label: "Time", val: "1.2s", icon: <Zap /> },
                { label: "Global", val: "24/7", icon: <Globe /> }
              ].map((stat, i) => (
                <div key={i} className="space-y-4 md:space-y-6 flex flex-col items-center">
                  <div className="flex items-center justify-center gap-2 md:gap-3 text-slate-400">
                     {React.cloneElement(stat.icon, {className: "w-4 h-4 md:w-5 md:h-5 text-[#06b6d4]"})}
                     <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">{stat.label}</span>
                  </div>
                  <h4 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    {stat.val}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

      </main>
    </div>
  );
};

export default UploadPage;