import React from 'react';
import { ExternalLink, CheckCircle2, Circle, Youtube } from 'lucide-react';

const RoadmapView = ({ roadmap }) => {
  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">You're Career Ready!</h3>
        <p className="text-slate-500 max-w-sm">No significant skill gaps were detected.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-[11px] w-[2px] bg-slate-100 -z-0"></div>

      <div className="space-y-16">
        {roadmap.map((item, index) => (
          <div key={index} className="relative flex items-start gap-10 group animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 150}ms` }}>
            <div className="relative z-10">
              <div className="bg-white border-4 border-indigo-600 w-6 h-6 rounded-full mt-1.5 shadow-sm group-hover:scale-125 transition-transform duration-300"></div>
            </div>

            <div className="flex-grow pb-12 border-b border-slate-50 last:border-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Master {item.skill}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Phase {index + 1} • Specialization</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-100 w-fit">
                  <Circle className="w-2.5 h-2.5 fill-current animate-pulse" />
                  {item.status}
                </div>
              </div>
              
              <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-3xl">{item.task}</p>

              {/* DUAL LINK ACTION: Documentation and YouTube */}
              <div className="flex flex-wrap gap-4">
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.15em] text-white bg-indigo-600 hover:bg-slate-900 px-8 py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all duration-300 active:scale-95 group/btn"
                >
                  Start Learning
                  <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>

                {/* NEW: YouTube Link */}
                <a 
                  href={item.youtubeLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.15em] text-slate-700 bg-white hover:bg-red-50 hover:text-red-600 px-8 py-4 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 active:scale-95 group/yt"
                >
                  Watch Tutorials
                  <Youtube className="w-4 h-4 group-hover/yt:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapView;