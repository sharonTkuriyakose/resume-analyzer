import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, AlertCircle } from 'lucide-react';

export function SkillChamber({ data, onBack }) {
  const score = data?.scoringComponents?.skills || 71;
  const foundSkills = data?.foundSkills || [];
  const missingSkills = data?.missingSkills || [];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-[#020617]/80 backdrop-blur-md overflow-y-auto"
    >
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-violet-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold flex items-center gap-2"
      >
        ← Return to Core
      </button>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 md:mt-0 pb-12">
        <div className="col-span-1 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-600 mb-2">Skill Proficiency</h2>
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Holographic glowing ring */}
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/30 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full border-2 border-fuchsia-500/50 animate-[spin_12s_linear_infinite_reverse]"></div>
            <span className="text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]">{score}%</span>
          </div>
          <p className="mt-4 text-violet-200 uppercase tracking-widest text-sm font-semibold">
             {score >= 80 ? 'Advanced Level' : 'Intermediate Level'}
          </p>
        </div>

        <div className="col-span-2 space-y-6">
          
          {/* Found Skills */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="text-violet-400" />
              Validated Expertise
            </h3>
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {foundSkills.map((item, i) => {
                const skillName = typeof item === 'object' ? item.skill : item;
                const skillScore = typeof item === 'object' ? item.score : 85;
                return (
                  <div key={`found-${i}`}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{skillName}</span>
                      <span className="text-xs font-black text-[#60a5fa]">{skillScore}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#020617] rounded-full overflow-hidden border border-[#3b82f6]/20 mb-1">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${skillScore}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500"></motion.div>
                    </div>
                    {typeof item === 'object' && item.description && (
                      <p className="text-[10px] text-blue-100/60 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 text-rose-400">
              <AlertCircle className="text-rose-400" />
              Action Required
            </h3>
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {missingSkills.map((item, i) => {
                const skillName = typeof item === 'object' ? item.skill : item;
                const skillScore = typeof item === 'object' ? item.score : 90;
                return (
                  <div key={`miss-${i}`}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{skillName}</span>
                      <span className="text-xs font-black text-[#f87171]">{skillScore}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#020617] rounded-full overflow-hidden border border-[#ef4444]/20 mb-1">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${skillScore}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full bg-[#ef4444]/80"></motion.div>
                    </div>
                    {typeof item === 'object' && item.description && (
                      <p className="text-[10px] text-blue-100/60 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
