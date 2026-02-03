import React from 'react';

const ReadinessScore = ({ score }) => {
  const color = score > 75 ? 'text-emerald-500' : score > 50 ? 'text-amber-500' : 'text-indigo-600';
  
  return (
    <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Job Readiness</p>
        <div className={`text-7xl font-black mb-2 tracking-tight ${color}`}>
          {score}%
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-6">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${score > 75 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ReadinessScore;