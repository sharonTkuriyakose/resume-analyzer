import React, { useState, useEffect } from 'react';
import { ScanSearch, Activity, RotateCcw } from 'lucide-react'; 
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';

function App() {
  const [analysisData, setAnalysisData] = useState(null);

  // ✅ SMART API CONFIGURATION
  // Automatically switches between local server and Render based on where the app is running
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  
  const API_URL = isLocal 
    ? 'http://localhost:5000' 
    : 'https://resume-analyzer-na6o.onrender.com'; // Updated to match your current Render URL

  // ✅ DEBUG LOGGING
  useEffect(() => {
    console.log(`🌐 System Environment: ${isLocal ? 'LOCAL_DEVELOPMENT' : 'PRODUCTION'}`);
    console.log(`📡 Targeting Backend: ${API_URL}`);
  }, [isLocal, API_URL]);

  // ✅ HANDLING ANALYSIS COMPLETION
  const handleAnalysisComplete = (data) => {
    console.log(`🚀 Neural Link Established. Analysis Received.`);
    setAnalysisData(data); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ RESET LOGIC
  const handleReset = () => {
    setAnalysisData(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0C10] text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* 1. RESPONSIVE NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 w-full bg-[#0A0C10]/80 backdrop-blur-2xl border-b border-white/5 py-4 md:py-6 px-4 md:px-12 flex justify-between items-center transition-all duration-300">
        
        {/* Logo & Title Container */}
        <div className="flex items-center gap-2 md:gap-4 group cursor-default min-w-0">
          <div className="bg-indigo-600 text-white p-2 md:p-2.5 rounded-xl md:rounded-2xl shadow-2xl shadow-indigo-500/20 group-hover:rotate-12 transition-all duration-500 shrink-0">
            <ScanSearch className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </div>
          
          <div className="flex flex-col items-start leading-none min-w-0 overflow-hidden">
            <span className="font-black text-sm md:text-2xl tracking-tighter text-white uppercase whitespace-nowrap overflow-hidden text-ellipsis">
              Resume Analyzer
            </span>
            <span className="text-[6px] md:text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] ml-0.5 whitespace-nowrap">
              Neural Lab v2.0
            </span>
          </div>
        </div>

        {/* Reset Button */}
        {analysisData && (
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 text-[9px] md:text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transition-all shadow-lg shrink-0 ml-2"
          >
            <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Start New Analysis</span>
            <span className="sm:hidden">Reset</span>
          </button>
        )}
      </nav>

      {/* 2. MAIN APPLICATION STAGE */}
      <main className="flex-grow flex flex-col relative w-full">
        {/* Background Ambient Glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

        <div className="w-full transition-all duration-700">
          {!analysisData ? (
            <UploadPage onAnalysisComplete={handleAnalysisComplete} apiUrl={API_URL} />
          ) : (
            <ResultPage data={analysisData} apiUrl={API_URL} />
          )}
        </div>
      </main>

      {/* 3. UNIVERSAL FOOTER */}
      <footer className="py-8 md:py-12 border-t border-white/5 bg-[#0A0C10]/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-[9px] md:text-xs uppercase tracking-[0.3em]">
            <Activity className="w-3 h-3 md:w-4 md:h-4 text-indigo-500" /> 
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