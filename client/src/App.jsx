import React, { useState } from 'react';
import { ScanSearch } from 'lucide-react'; // Professional "Reality" Logo
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';

/**
 * App Component: The primary controller for the Resume Analyzer.
 * Now featuring a professional SVG-based logo to eliminate placeholder text.
 */
function App() {
  const [analysisData, setAnalysisData] = useState(null);

  /**
   * handleAnalysisComplete: Swaps the view once the Node.js backend
   * successfully identifies skill gaps.
   */
  const handleAnalysisComplete = (data) => {
    console.log("Analysis Data Received:", data);
    setAnalysisData(data); 
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
      
      {/* PREMIUM NAVBAR
        Replaced the "RA" text with a high-fidelity ScanSearch icon.
      */}
      <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 py-5 px-8 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-default">
          {/* THE REALITY LOGO: SVG-based icon for professional branding */}
          <div className="bg-indigo-600 text-white p-2.5 rounded-2xl shadow-xl shadow-indigo-100 group-hover:rotate-12 transition-all duration-500">
            <ScanSearch className="w-6 h-6" strokeWidth={2.5} />
          </div>
          
          <span className="font-black text-2xl tracking-tighter text-slate-800 uppercase">
            Resume Analyzer
          </span>
        </div>

        {analysisData && (
          <button 
            onClick={() => setAnalysisData(null)}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> New Analysis
          </button>
        )}
      </nav>

      {/* MAIN STAGE
        Expanded layout to ensure no "gaps" remain on the edges.
      */}
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-6 md:px-12 relative">
        {/* Ambient background glow to fill visual voids */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

        <div className="w-full max-w-[1600px] transition-all duration-700">
          {!analysisData ? (
            <UploadPage onAnalysisComplete={handleAnalysisComplete} />
          ) : (
            <ResultPage data={analysisData} onBack={() => setAnalysisData(null)} />
          )}
        </div>
      </main>

      {/* REFINED FOOTER */}
      <footer className="py-10 border-t border-slate-100/80 bg-white/30 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">
            Skill Intelligence Engine • MERN Stack
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;