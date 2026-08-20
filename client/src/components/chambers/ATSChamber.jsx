import React from 'react';
import { motion } from 'framer-motion';
import { ScanSearch, CheckCircle, AlertTriangle } from 'lucide-react';

export function ATSChamber({ data, onBack }) {
  const score = data?.scoringComponents?.atsFormatting || 82;
  const keywordsDetected = data?.keywordsDetected || [];
  const keywordsMissing = data?.keywordsMissing || [];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-[#020617]/80 backdrop-blur-md overflow-y-auto"
    >
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-cyan-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold flex items-center gap-2"
      >
        ← Return to Core
      </button>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 md:mt-0 pb-12">
        <div className="col-span-1 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">ATS Intelligence</h2>
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Holographic glowing ring */}
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full border-2 border-blue-500/50 animate-[spin_10s_linear_infinite]"></div>
            <span className="text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">{score}%</span>
          </div>
          <p className="mt-4 text-cyan-200 uppercase tracking-widest text-sm font-semibold">
            {score >= 80 ? 'Strong Match' : 'Needs Optimization'}
          </p>
        </div>

        <div className="col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-[0_0_30px_rgba(14,165,233,0.1)]">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ScanSearch className="text-cyan-400" />
              Detected Strengths
            </h3>
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {keywordsDetected.length > 0 ? keywordsDetected.map((kw, i) => {
                const keyword = typeof kw === 'object' ? kw.keyword : kw;
                const context = typeof kw === 'object' ? kw.context : null;
                return (
                  <div key={i} className="p-3 bg-[#020617] border border-cyan-500/30 rounded-lg shadow-inner">
                    <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-cyan-400" /> {keyword}
                    </span>
                    {context && <p className="text-[10px] text-blue-100/60 mt-2 leading-relaxed">{context}</p>}
                  </div>
                );
              }) : (
                <span className="text-slate-500 text-sm italic">None detected</span>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 text-rose-400">
              <AlertTriangle className="text-rose-400" />
              Critical Misses
            </h3>
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {keywordsMissing.length > 0 ? keywordsMissing.map((kw, i) => {
                const keyword = typeof kw === 'object' ? kw.keyword : kw;
                const context = typeof kw === 'object' ? kw.context : null;
                return (
                  <div key={i} className="p-3 bg-[#020617] border border-rose-500/30 rounded-lg">
                    <span className="text-rose-400 text-xs font-bold uppercase tracking-wider">{keyword}</span>
                    {context && <p className="text-[10px] text-blue-100/60 mt-2 leading-relaxed">{context}</p>}
                  </div>
                );
              }) : (
                <span className="text-slate-500 text-sm italic">None missing</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
