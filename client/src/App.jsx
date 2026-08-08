import React, { useState, useEffect } from 'react';
import { ScanSearch, Activity, RotateCcw, Cpu } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const API_URL = isLocal 
    ? 'http://localhost:5000' 
    : 'https://resume-analyzer-na6o.onrender.com';

  useEffect(() => {
    console.log(`🌐 System Environment: ${isLocal ? 'LOCAL_DEVELOPMENT' : 'PRODUCTION'}`);
    console.log(`📡 Targeting Backend: ${API_URL}`);
    
    // Intro sequence timing
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [isLocal, API_URL]);

  const handleAnalysisComplete = (data) => {
    console.log(`🚀 Neural Link Established. Analysis Received.`);
    setAnalysisData(data); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAnalysisData(null);
  };

  return (
    <div className="min-h-screen print:min-h-0 flex flex-col bg-[#050505] print:bg-white text-slate-200 print:text-black print:block selection:bg-[#10b981]/30 overflow-x-hidden relative font-sans">
      
      {/* 0. CINEMATIC INTRO ANIMATION */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
          >
            {/* Background sweeping lines */}
            <div className="absolute inset-0 pointer-events-none z-0">
               <svg viewBox="0 0 1200 800" className="w-full h-full opacity-30">
                 <defs>
                   <filter id="glow-intro" x="-20%" y="-20%" width="140%" height="140%">
                     <feGaussianBlur stdDeviation="15" result="blur" />
                     <feComposite in="SourceGraphic" in2="blur" operator="over" />
                   </filter>
                 </defs>
                 <motion.path 
                   d="M 100,800 Q 600,400 1100,800" 
                   fill="none" 
                   stroke="#10b981" 
                   strokeWidth="2" 
                   filter="url(#glow-intro)"
                   initial={{ pathLength: 0, opacity: 0 }}
                   animate={{ pathLength: 1, opacity: 0.5 }}
                   transition={{ duration: 2, ease: "easeOut" }}
                 />
                 <motion.path 
                   d="M 100,0 Q 600,400 1100,0" 
                   fill="none" 
                   stroke="#10b981" 
                   strokeWidth="2" 
                   filter="url(#glow-intro)"
                   initial={{ pathLength: 0, opacity: 0 }}
                   animate={{ pathLength: 1, opacity: 0.5 }}
                   transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                 />
               </svg>
            </div>

            <div className="relative flex flex-col items-center justify-center z-10">
              {/* Chip appearance */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative flex items-center justify-center w-24 h-24 mb-6"
              >
                <div className="absolute inset-0 bg-[#10b981]/20 rounded-xl blur-[20px] animate-pulse"></div>
                <div className="w-20 h-20 bg-black border border-[#10b981]/50 shadow-[0_0_30px_rgba(16,185,129,0.3)] rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                  <Cpu className="w-10 h-10 text-[#10b981]" strokeWidth={1.5} />
                  {/* Grid lines on chip */}
                  <div className="absolute top-0 left-1/2 w-[1px] h-3 bg-[#10b981]/40 -translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-1/2 w-[1px] h-3 bg-[#10b981]/40 -translate-x-1/2"></div>
                  <div className="absolute left-0 top-1/2 w-3 h-[1px] bg-[#10b981]/40 -translate-y-1/2"></div>
                  <div className="absolute right-0 top-1/2 w-3 h-[1px] bg-[#10b981]/40 -translate-y-1/2"></div>
                </div>
              </motion.div>
              
              {/* Text appearance */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center leading-none"
              >
                <span className="font-black text-3xl md:text-5xl tracking-tighter text-white text-center drop-shadow-lg">
                  Verify your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Career AI</span>
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. RESPONSIVE NAVIGATION BAR */}
      <motion.nav 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? -50 : 0 }}
        transition={{ delay: showIntro ? 0 : 0.5, duration: 1 }}
        className="fixed top-0 z-50 w-full bg-[#050505]/70 backdrop-blur-2xl border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center print:hidden"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col items-start leading-none min-w-0 overflow-hidden cursor-pointer">
            <span className="font-black text-xl md:text-2xl tracking-tighter text-white whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#10b981]" /> NeuralPath
            </span>
          </div>
        </div>

        {/* Center links */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          {[
            { name: "Performance", href: "#performance" },
            { name: "Architecture", href: "#architecture" },
            { name: "Scope", href: "#scope" }
          ].map((item, idx) => (
            <motion.a 
              key={idx} 
              href={item.href}
              onClick={(e) => {
                // Only prevent default if we are on the UploadPage and the element exists
                if (!analysisData) {
                  const el = document.querySelector(item.href);
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: showIntro ? 0 : 0.6 + (idx * 0.1) }}
              whileHover={{ scale: 1.05, color: '#10b981' }}
              whileTap={{ scale: 0.95 }}
              className="hover:text-white transition-colors relative group"
            >
              {item.name}
              {/* Animated underline */}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#10b981] transition-all duration-300 group-hover:w-full"></span>
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {analysisData && (
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-black bg-white hover:bg-slate-200 px-4 py-2 md:py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Start New Analysis</span>
              <span className="sm:hidden">Reset</span>
            </button>
          )}
        </div>
      </motion.nav>

      {/* 2. MAIN APPLICATION STAGE */}
      <main className="flex-grow flex flex-col print:block relative w-full pt-[80px] md:pt-[100px] print:pt-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: showIntro ? 0 : 1 }}
          transition={{ delay: showIntro ? 0 : 0.8, duration: 1.5 }}
          className="w-full transition-all duration-700"
        >
          {!analysisData ? (
            <UploadPage onAnalysisComplete={handleAnalysisComplete} apiUrl={API_URL} />
          ) : (
            <ResultPage data={analysisData} apiUrl={API_URL} />
          )}
        </motion.div>
      </main>

      {/* 3. UNIVERSAL FOOTER */}
      <footer className="py-8 md:py-12 bg-[#050505] relative z-40 border-t border-white/5 print:hidden">
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-[9px] md:text-xs uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <Activity className="w-3 h-3 md:w-4 md:h-4" /> 
            Skill Intelligence Engine 
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[8px] md:text-[10px] text-slate-500 uppercase tracking-widest">
              Engineered by Sharon T Kuriyakose
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;