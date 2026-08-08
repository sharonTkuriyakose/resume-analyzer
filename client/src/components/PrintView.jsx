import React from 'react';
import { Search, CheckCircle2, AlertCircle, Zap, Sparkles, Briefcase, BookOpen, MapPin, ExternalLink, Youtube, ArrowUpRight } from 'lucide-react';

const PrintView = ({ data, projectStage }) => {
  return (
    <div className="hidden print:block w-full max-w-[1200px] mx-auto text-black">
      {/* ATS Breakdown */}
      <div className="break-after-page break-inside-avoid py-8 w-full">
        <h2 className="text-3xl font-black text-black uppercase tracking-tight flex items-center gap-3 mb-10 border-b-2 border-emerald-500 pb-4">
          <Search className="w-10 h-10 text-emerald-600" /> ATS Intelligence Breakdown
        </h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-black text-emerald-700 uppercase tracking-widest mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" /> Detected Strengths
            </h3>
            <div className="flex flex-col gap-4">
              {data.keywordsDetected?.slice(0, 4).map((kw, i) => {
                const keyword = typeof kw === 'object' ? kw.keyword : kw;
                const context = typeof kw === 'object' ? kw.context : null;
                return (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm break-inside-avoid">
                    <span className="text-slate-800 text-sm font-bold uppercase tracking-wider">{keyword}</span>
                    {context && <p className="text-xs text-slate-600 mt-2 leading-relaxed">{context}</p>}
                  </div>
                );
              })}
              {(!data.keywordsDetected || data.keywordsDetected.length === 0) && (
                <span className="text-slate-500 text-sm italic">None detected</span>
              )}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-black text-rose-600 uppercase tracking-widest mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" /> Critical Misses
            </h3>
            <div className="flex flex-col gap-4">
              {data.keywordsMissing?.slice(0, 4).map((kw, i) => {
                const keyword = typeof kw === 'object' ? kw.keyword : kw;
                const context = typeof kw === 'object' ? kw.context : null;
                return (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm break-inside-avoid">
                    <span className="text-rose-700 text-sm font-bold uppercase tracking-wider">{keyword}</span>
                    {context && <p className="text-xs text-slate-600 mt-2 leading-relaxed">{context}</p>}
                  </div>
                );
              })}
              {(!data.keywordsMissing || data.keywordsMissing.length === 0) && (
                <span className="text-slate-500 text-sm italic">None missing</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="break-after-page break-inside-avoid py-8 w-full">
        <h2 className="text-3xl font-black text-black uppercase tracking-tight flex items-center gap-3 mb-10 border-b-2 border-emerald-500 pb-4">
          <Zap className="w-10 h-10 text-emerald-600" /> Skill Proficiency Matrix
        </h2>
        <div className="grid grid-cols-2 gap-12">
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-8">Validated Expertise</h3>
            <div className="space-y-6">
              {data.foundSkills?.slice(0, 6).map((item, i) => {
                const skillName = typeof item === 'object' ? item.skill : item;
                const skillScore = typeof item === 'object' ? item.score : 85;
                return (
                  <div key={`found-${i}`} className="break-inside-avoid">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">{skillName}</span>
                      <span className="text-sm font-black text-emerald-600">{skillScore}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div style={{ width: `${skillScore}%` }} className="h-full bg-emerald-500"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-8">Action Required (Gaps)</h3>
            <div className="space-y-6">
              {data.missingSkills?.slice(0, 6).map((item, i) => {
                const skillName = typeof item === 'object' ? item.skill : item;
                const skillScore = typeof item === 'object' ? item.score : 90;
                return (
                  <div key={`miss-${i}`} className="break-inside-avoid">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">{skillName}</span>
                      <span className="text-sm font-black text-rose-500">Importance: {skillScore}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div style={{ width: `${skillScore}%` }} className="h-full bg-rose-400"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="break-after-page break-inside-avoid py-8 w-full">
        <h2 className="text-3xl font-black text-black uppercase tracking-tight flex items-center gap-3 mb-10 border-b-2 border-emerald-500 pb-4">
          <Sparkles className="w-10 h-10 text-emerald-600" /> Strategic Projects Lab
        </h2>
        <div className="grid grid-cols-2 gap-8">
          {projectStage?.projectList?.slice(0, 2).map((proj, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col h-full break-inside-avoid">
              <h4 className="text-lg font-black text-emerald-700 uppercase tracking-tight mb-3">{proj.name}</h4>
              {proj.desc && <p className="text-sm text-slate-700 mb-6 leading-relaxed">{proj.desc}</p>}
              <ul className="space-y-4 flex-1">
                {proj.points?.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                    <p className="text-sm text-slate-800 font-medium leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {(!projectStage?.projectList || projectStage.projectList.length === 0) && (
            <div className="text-slate-500 text-sm italic">No project recommendations available.</div>
          )}
        </div>
      </div>

      {/* Roadmap & Jobs */}
      <div className="break-inside-avoid py-8 w-full">
        <h2 className="text-3xl font-black text-black uppercase tracking-tight flex items-center gap-3 mb-10 border-b-2 border-emerald-500 pb-4">
          <Briefcase className="w-10 h-10 text-emerald-600" /> Career & Jobs Center
        </h2>
        <div className="grid grid-cols-2 gap-16">
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-emerald-600" /> Phased Curriculum
            </h3>
            <div className="space-y-8 relative pl-6 border-l-4 border-slate-200">
              {data.phasedCurriculum?.filter(step => !step.isProject).slice(0, 2).map((item, i) => (
                <div key={i} className="relative pl-8 break-inside-avoid">
                  <div className="absolute left-[-37px] top-1 w-6 h-6 rounded-full bg-white border-4 border-emerald-500"></div>
                  <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Phase {item.id}</div>
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight mb-3">
                    {item.title.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.primaryGoal}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-emerald-600" /> Job Portal Search Hub
            </h3>
            <div className="space-y-4">
              {data.liveJobs && data.liveJobs.length > 0 ? data.liveJobs.slice(0, 2).map((job, i) => (
                <div key={i} className="block bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm break-inside-avoid">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-bold text-slate-900">{job.title}</h4>
                  </div>
                  <div className="text-sm text-slate-600 font-medium mb-4">{job.company} • {job.location}</div>
                  {job.description && (
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">{job.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded text-xs font-bold uppercase tracking-wider">{job.type}</span>
                  </div>
                </div>
              )) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center flex flex-col items-center shadow-sm">
                  <Briefcase className="w-10 h-10 text-slate-400 mb-4" />
                  <p className="text-slate-600 text-base font-medium">No live jobs found matching this profile yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintView;
