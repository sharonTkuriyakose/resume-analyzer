import React, { useState, useEffect } from 'react';
import { ScanSearch, Activity, RotateCcw } from 'lucide-react'; 
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
    }, 3500);
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
    <div className="min-h-screen flex flex-col bg-[#050505] text-slate-200 selection:bg-[#06b6d4]/30 overflow-x-hidden relative">
      
      {/* 0. CINEMATIC INTRO ANIMATION */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
          >
            <div className="relative flex items-center justify-center">
              {/* Expanding glowing circle */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute w-32 h-32 rounded-full border-4 border-white shadow-[0_0_40px_rgba(6,182,212,0.8)]"
              />
              
              {/* Logo appearance */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                className="flex items-center gap-4 relative z-10"
              >
                <div className="bg-white text-black p-4 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                  <ScanSearch className="w-12 h-12" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="font-black text-2xl sm:text-4xl tracking-tighter text-white uppercase text-center sm:text-left">
                    Resume Analyzer
                  </span>
                  <span className="text-[10px] sm:text-sm font-black text-[#06b6d4] uppercase tracking-[0.4em] ml-0.5 mt-1 text-center sm:text-left">
                    Neural Lab v2.0
                  </span>
                </div>
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
        className="fixed top-0 z-50 w-full bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 py-4 md:py-6 px-4 md:px-12 flex justify-between items-center"
      >
        <div className="flex items-center gap-2 md:gap-4 group cursor-default min-w-0">
          <div className="bg-white text-black p-2 md:p-2.5 rounded-xl md:rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:rotate-12 transition-all duration-500 shrink-0">
            <ScanSearch className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-start leading-none min-w-0 overflow-hidden">
            <span className="font-black text-sm md:text-2xl tracking-tighter text-white uppercase whitespace-nowrap overflow-hidden text-ellipsis">
              Resume Analyzer
            </span>
            <span className="text-[6px] md:text-[9px] font-black text-[#06b6d4] uppercase tracking-[0.4em] ml-0.5 whitespace-nowrap">
              Neural Lab v2.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {analysisData && (
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 text-[9px] md:text-xs font-black uppercase tracking-widest text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/20 hover:bg-[#06b6d4] hover:text-black px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transition-all shadow-lg shrink-0 ml-2"
            >
              <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Start New Analysis</span>
              <span className="sm:hidden">Reset</span>
            </button>
          )}
        </div>
      </motion.nav>

      {/* 2. MAIN APPLICATION STAGE */}
      <main className="flex-grow flex flex-col relative w-full pt-[80px] md:pt-[100px]">
        {/* Background Ambient Glow (Updated to Orange/Amber) */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-[#06b6d4]/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

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
      <footer className="py-8 md:py-12 border-t border-white/5 bg-[#0B0B0B]/50 backdrop-blur-sm relative z-40">
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-[9px] md:text-xs uppercase tracking-[0.3em]">
            <Activity className="w-3 h-3 md:w-4 md:h-4 text-[#06b6d4]" /> 
            Skill Intelligence Engine 
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[8px] md:text-[10px] text-slate-600 uppercase tracking-widest">
              Engineered by Sharon T Kuriyakose
            </p>
            <p className="text-[7px] md:text-[8px] text-slate-700 uppercase tracking-widest">
              Universal Career Intelligence Suite 
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;