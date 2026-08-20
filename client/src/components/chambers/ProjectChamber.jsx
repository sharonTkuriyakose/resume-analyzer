import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, LayoutGrid, Zap } from 'lucide-react';

export function ProjectChamber({ data, onBack }) {
  const score = data?.scoringComponents?.projects || 58;
  const projectStage = data?.phasedCurriculum?.find(step => step.id === 4 || step.isProject);
  const projects = projectStage?.projectList || [];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-[#020617]/80 backdrop-blur-md overflow-y-auto"
    >
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-emerald-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold flex items-center gap-2"
      >
        ← Return to Core
      </button>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 gap-8 mt-24 md:mt-0 pb-12">
        <div className="col-span-1 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600 mb-2">Projects Lab</h2>
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Holographic glowing ring */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-pulse"></div>
            <div className="absolute inset-4 rounded-[30%] border-2 border-teal-500/50 animate-[spin_15s_linear_infinite]"></div>
            <span className="text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]">{score}%</span>
          </div>
          <p className="mt-4 text-emerald-200 uppercase tracking-widest text-sm font-semibold">
            {projects.length > 0 ? 'Recommendations Ready' : 'Needs Diversification'}
          </p>
        </div>

        <div className="col-span-3 space-y-6">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3 mb-6">
            <FlaskConical className="w-8 h-8 text-[#60a5fa]" /> Strategic Projects Lab
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {projects.length > 0 ? projects.map((proj, i) => (
              <div key={i} className="bg-[#020617]/50 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-400/50 transition-colors flex flex-col h-full shadow-[0_0_20px_rgba(52,211,153,0.05)]">
                <h4 className="text-sm font-black text-emerald-400 uppercase tracking-tight mb-2">{proj.name}</h4>
                {proj.desc && <p className="text-[10px] text-emerald-100/60 mb-4 leading-relaxed">{proj.desc}</p>}
                <ul className="space-y-3 flex-1">
                  {proj.points?.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                      <p className="text-xs text-blue-100/80 font-medium leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                  Start Project
                </button>
              </div>
            )) : (
              <div className="col-span-3 text-slate-500 text-sm italic bg-slate-900/50 p-8 rounded-2xl text-center border border-slate-800">
                No project recommendations available for this profile.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
