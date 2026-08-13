import React, { useState, useEffect } from 'react';
import { ScanSearch, Activity, RotateCcw, Cpu } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';

function App() {
  const [analysisData, setAnalysisData] = useState(null);

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const API_URL = isLocal 
    ? 'http://localhost:5000' 
    : 'https://resume-analyzer-na6o.onrender.com';

  useEffect(() => {
    console.log(`🌐 System Environment: ${isLocal ? 'LOCAL_DEVELOPMENT' : 'PRODUCTION'}`);
    console.log(`📡 Targeting Backend: ${API_URL}`);
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
    <div className="min-h-screen print:min-h-0 flex flex-col bg-[#020617] print:bg-white text-slate-200 print:text-black print:block selection:bg-white/30 overflow-x-hidden relative font-sans">
      
      {/* 1. RESPONSIVE NAVIGATION BAR */}
      <motion.nav 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="fixed top-0 z-50 w-full bg-transparent py-6 px-6 md:px-12 flex justify-between items-center print:hidden"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col items-start leading-none min-w-0 overflow-hidden cursor-pointer">
            <span className="font-bold text-xl md:text-2xl text-white flex items-center gap-2">
              <Cpu className="w-6 h-6 text-white" /> NeuralPath
            </span>
          </div>
        </div>

        {/* Center links */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-base font-medium text-slate-300">
          {(!analysisData ? [
            { name: "Home", href: "#" },
            { name: "Features", href: "#features" },
            { name: "How it Works", href: "#how-it-works" }
          ] : [
            { name: "Performance", href: "#performance" },
            { name: "Architecture", href: "#architecture" },
            { name: "Scope", href: "#scope" }
          ]).map((item, idx) => (
            <motion.a 
              key={idx} 
              href={item.href}
              onClick={(e) => {
                if (!analysisData && item.href.startsWith('#')) {
                  const el = document.querySelector(item.href);
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              whileHover={{ color: '#ffffff' }}
              className="hover:text-white transition-colors relative"
            >
              <span>{item.name}</span>
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!analysisData ? (
            <button className="px-6 py-2.5 bg-white text-black hover:bg-slate-200 rounded-full text-sm font-bold transition-colors hidden sm:block">
              Get Started
            </button>
          ) : (
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-white bg-[#3b82f6] hover:bg-[#2563eb] px-4 py-2 md:py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]"
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
        <div className="w-full">
          {!analysisData ? (
            <UploadPage onAnalysisComplete={handleAnalysisComplete} apiUrl={API_URL} />
          ) : (
            <ResultPage data={analysisData} apiUrl={API_URL} />
          )}
        </div>
      </main>

      {/* 3. UNIVERSAL FOOTER */}
      <footer className="py-8 md:py-12 bg-[#020617] relative z-40 print:hidden">
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <div className="flex items-center gap-2 text-white font-bold text-[9px] md:text-xs uppercase tracking-[0.3em]">
            <Activity className="w-3 h-3 md:w-4 md:h-4 text-slate-500" /> 
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