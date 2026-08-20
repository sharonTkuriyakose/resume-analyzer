import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Youtube } from 'lucide-react';

export function OptimizationRoadmap({ data }) {
  const curriculum = data?.phasedCurriculum?.filter(step => !step.isProject) || [];
  
  if (curriculum.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 p-8 relative z-20">
      <h3 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-16 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
        Phased Curriculum Optimization
      </h3>
      
      <div className="relative flex justify-between items-start pt-8">
        {/* Connecting Energy Line */}
        <div className="absolute top-12 left-0 w-full h-[2px] bg-slate-800 -z-10 -translate-y-1/2">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-transparent w-1/3 animate-pulse"></div>
        </div>

        {/* Start State */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-cyan-900 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <span className="font-black text-cyan-50 text-sm">Now</span>
          </div>
        </div>

        {/* Steps */}
        {curriculum.map((item, index) => (
          <div key={index} className="flex flex-col items-center group w-48 -mt-4 relative">
            <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-blue-400 flex items-center justify-center transition-colors cursor-pointer mb-4 shadow-[0_0_10px_rgba(0,0,0,0.5)] relative z-10">
              <span className="text-xs font-bold text-slate-500 group-hover:text-blue-400">{item.id}</span>
            </div>
            
            {/* Content Box (always visible) */}
            <div className="bg-[#0f172a]/80 backdrop-blur-md border border-[#3b82f6]/30 p-4 rounded-xl text-center w-full shadow-lg group-hover:border-cyan-400 transition-colors">
              <h4 className="text-[11px] font-bold text-white uppercase tracking-tight mb-2 line-clamp-2">
                {item.title?.replace(/_/g, ' ')}
              </h4>
              <p className="text-[9px] text-blue-100/60 leading-relaxed mb-3 line-clamp-3">
                {item.primaryGoal}
              </p>
              
              <div className="flex flex-col gap-2 mt-auto">
                {item.title && (
                  <a href={`https://google.com/search?q=${encodeURIComponent(item.title.replace(/_/g, ' ').replace(/^(LEARN|MASTER|IMPLEMENT)\s+/i, '').trim().toLowerCase())}+learning+roadmap`} target="_blank" rel="noreferrer" className="px-2 py-1.5 bg-[#020617] border border-[#3b82f6]/30 hover:border-cyan-400 rounded flex items-center justify-center gap-1 text-[8px] font-bold text-white uppercase transition-colors">
                    Doc <ExternalLink className="w-2.5 h-2.5"/>
                  </a>
                )}
                {item.title && (
                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.title.replace(/_/g, ' ').replace(/^(LEARN|MASTER|IMPLEMENT)\s+/i, '').trim().toLowerCase())}+tutorial+2026`} target="_blank" rel="noreferrer" className="px-2 py-1.5 bg-[#3b82f6]/10 border border-[#3b82f6]/30 hover:bg-cyan-500/20 hover:border-cyan-400 rounded flex items-center justify-center gap-1 text-[8px] font-bold text-[#60a5fa] hover:text-cyan-400 uppercase transition-colors">
                    Video <Youtube className="w-2.5 h-2.5"/>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Goal State */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-violet-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <span className="font-black text-slate-400 text-sm">100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
