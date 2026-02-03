import React from 'react';

const SkillSummary = ({ found = [], missing = [] }) => {
  return (
    <div className="space-y-6">
      {/* Found Skills */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Detected Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {found.map((skill, i) => (
            <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-full border border-emerald-100">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Skill Gaps */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          Critical Gaps
        </h4>
        <div className="flex flex-wrap gap-2">
          {missing.map((skill, i) => (
            <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full border border-indigo-100">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillSummary;