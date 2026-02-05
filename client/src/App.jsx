import React, { useState } from 'react';
import { ScanSearch, Activity } from 'lucide-react'; 
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';

function App() {
  const [analysisData, setAnalysisData] = useState(null);

  const handleAnalysisComplete = (data) => {
    console.log("Analysis Data Received:", data);
    setAnalysisData(data); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0C10] text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* 1. RESPONSIVE DARK NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-[#0A0C10]/80 backdrop-blur-2xl border-b border-white/5 py-4 md:py-6 px-4 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-4 group cursor-default">
          {/* LOGO BOX */}
          <div className="bg-indigo-600 text-white p-2 md:p-2.5 rounded-xl md:rounded-2xl shadow-2xl shadow-indigo-500/20 group-hover:rotate-12 transition-all duration-500">
            <ScanSearch className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </div>
          
          <span className="font-black text-lg md:text-2xl tracking-tighter text-white uppercase whitespace-nowrap">
            Resume Analyzer
          </span>
        </div>

        {/* Action Button: Stays readable on Mobile */}
        {analysisData && (
          <button 
            onClick={() => setAnalysisData(null)}
            className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transition-all"
          >
            <span className="hidden sm:inline">← New Analysis</span>
            <span className="sm:hidden">Reset</span>
          </button>
        )}
      </nav>

      {/* 2. MAIN STAGE - Fluid Width */}
      <main className="flex-grow flex flex-col relative w-full">
        {/* Ambient background glow to fill visual voids */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

        <div className="w-full transition-all duration-700">
          {!analysisData ? (
            <UploadPage onAnalysisComplete={handleAnalysisComplete} />
          ) : (
            <ResultPage data={analysisData} />
          )}
        </div>
      </main>

      {/* 3. REFINED DARK FOOTER */}
      <footer className="py-8 md:py-12 border-t border-white/5 bg-[#0A0C10]/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-[9px] md:text-xs uppercase tracking-[0.3em]">
            <Activity className="w-3 h-3 md:w-4 md:h-4 text-indigo-500" /> 
            Skill Intelligence Engine • MERN Stack
          </div>
          <p className="text-[8px] md:text-[10px] text-slate-600 uppercase tracking-widest">
            Developed by Sharon T Kuriyakose
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;