import React from 'react';
import { Search, CheckCircle2, AlertCircle, Zap, Sparkles, Briefcase, BookOpen, MapPin, ExternalLink, Youtube, ArrowUpRight, Activity, Target } from 'lucide-react';

const PrintView = ({ data, projectStage }) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto text-[#000000] dark:text-[#ffffff] bg-[#ffffff] dark:bg-[#050505] p-8">
      {/* Market Readiness & Scoring */}
      <div className="break-after-page break-inside-avoid py-8 w-full">
        <h2 className="text-3xl font-black text-[#000000] dark:text-[#ffffff] uppercase tracking-tight flex items-center gap-3 mb-10 border-b-2 border-[#10b981] pb-4">
          <Target className="w-10 h-10 text-[#059669] dark:text-[#10b981]" /> Market Readiness Profile
        </h2>
        
        <div className="flex flex-col md:flex-row gap-12 items-center justify-between mb-12">
          {/* Main Score Circle */}
          <div className="relative w-64 h-64 shrink-0 flex items-center justify-center bg-[#f8fafc] dark:bg-[#111111] border-[6px] border-[#10b981] rounded-full shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <div className="flex flex-col items-center">
              <div className="text-xs font-black text-[#64748b] dark:text-[#94a3b8] uppercase tracking-[0.2em] mb-2">Readiness</div>
              <div className="text-7xl font-black text-[#0f172a] dark:text-[#ffffff] flex items-start">
                {data.score || 0}<span className="text-3xl text-[#10b981] mt-2">%</span>
              </div>
              <div className="mt-4 px-4 py-1.5 bg-[#e2e8f0] dark:bg-[#1e293b] rounded-full text-xs font-bold text-[#059669] dark:text-[#10b981] tracking-widest uppercase">
                {data.score >= 80 ? 'Market Ready' : 'Development Needed'}
              </div>
            </div>
          </div>
          
          {/* Algorithm Breakdown */}
          <div className="flex-1 w-full bg-[#f8fafc] dark:bg-[#111111] border border-[#e2e8f0] dark:border-[#334155] rounded-2xl p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <Activity className="w-6 h-6 text-[#059669] dark:text-[#10b981]" />
               <h3 className="text-xl font-black text-[#1e293b] dark:text-[#e2e8f0] uppercase tracking-widest">Deductive Scoring Algorithm</h3>
             </div>
             
             <div className="space-y-6">
                {[
                  { label: "Skills Matrix", weight: "30%", val: data.scoringComponents?.skills || 0 },
                  { label: "Projects Lab", weight: "25%", val: data.scoringComponents?.projects || 0 },
                  { label: "Experience", weight: "20%", val: data.scoringComponents?.experience || 0 },
                  { label: "Certifications", weight: "15%", val: data.scoringComponents?.certifications || 0 },
                  { label: "ATS Formatting", weight: "10%", val: data.scoringComponents?.atsFormatting || 0 }
                ].map((comp, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3">
                         <span className="text-sm font-bold text-[#0f172a] dark:text-[#ffffff] uppercase tracking-wider">{comp.label}</span>
                         <span className="text-[10px] font-black text-[#059669] dark:text-[#10b981] bg-[#e2e8f0] dark:bg-[#334155] px-2 py-0.5 rounded-full uppercase">Weight: {comp.weight}</span>
                      </div>
                      <span className="text-sm font-black text-[#0f172a] dark:text-[#ffffff]">{comp.val}%</span>
                    </div>
                    <div className="h-3 w-full bg-[#e2e8f0] dark:bg-[#334155] rounded-full overflow-hidden">
                      <div style={{ width: `${comp.val}%` }} className="h-full bg-[#10b981]"></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* ATS Breakdown */}
      <div className="break-after-page break-inside-avoid py-8 w-full">
        <h2 className="text-3xl font-black text-[#000000] dark:text-[#ffffff] uppercase tracking-tight flex items-center gap-3 mb-10 border-b-2 border-[#10b981] pb-4">
          <Search className="w-10 h-10 text-[#059669] dark:text-[#10b981]" /> ATS Intelligence Breakdown
        </h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-[#f8fafc] dark:bg-[#111111] border border-[#e2e8f0] dark:border-[#334155] rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-black text-[#047857] dark:text-[#34d399] uppercase tracking-widest mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" /> Detected Strengths
            </h3>
            <div className="flex flex-col gap-4">
              {data.keywordsDetected?.map((kw, i) => {
                const keyword = typeof kw === 'object' ? kw.keyword : kw;
                const context = typeof kw === 'object' ? kw.context : null;
                return (
                  <div key={i} className="p-4 bg-[#ffffff] dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#475569] rounded-xl shadow-sm break-inside-avoid">
                    <span className="text-[#1e293b] dark:text-[#e2e8f0] text-sm font-bold uppercase tracking-wider">{keyword}</span>
                    {context && <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-2 leading-relaxed">{context}</p>}
                  </div>
                );
              })}
              {(!data.keywordsDetected || data.keywordsDetected.length === 0) && (
                <span className="text-[#64748b] dark:text-[#94a3b8] text-sm italic">None detected</span>
              )}
            </div>
          </div>
          <div className="bg-[#f8fafc] dark:bg-[#111111] border border-[#e2e8f0] dark:border-[#334155] rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-black text-[#e11d48] dark:text-[#fb7185] uppercase tracking-widest mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" /> Critical Misses
            </h3>
            <div className="flex flex-col gap-4">
              {data.keywordsMissing?.map((kw, i) => {
                const keyword = typeof kw === 'object' ? kw.keyword : kw;
                const context = typeof kw === 'object' ? kw.context : null;
                return (
                  <div key={i} className="p-4 bg-[#ffffff] dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#475569] rounded-xl shadow-sm break-inside-avoid">
                    <span className="text-[#be123c] dark:text-[#f43f5e] text-sm font-bold uppercase tracking-wider">{keyword}</span>
                    {context && <p className="text-xs text-[#475569] dark:text-[#94a3b8] mt-2 leading-relaxed">{context}</p>}
                  </div>
                );
              })}
              {(!data.keywordsMissing || data.keywordsMissing.length === 0) && (
                <span className="text-[#64748b] dark:text-[#94a3b8] text-sm italic">None missing</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="break-after-page break-inside-avoid py-8 w-full">
        <h2 className="text-3xl font-black text-[#000000] dark:text-[#ffffff] uppercase tracking-tight flex items-center gap-3 mb-10 border-b-2 border-[#10b981] pb-4">
          <Zap className="w-10 h-10 text-[#059669] dark:text-[#10b981]" /> Skill Proficiency Matrix
        </h2>
        <div className="grid grid-cols-2 gap-12">
          <div className="bg-[#f8fafc] dark:bg-[#111111] p-8 rounded-2xl border border-[#e2e8f0] dark:border-[#334155] shadow-sm">
            <h3 className="text-lg font-black text-[#1e293b] dark:text-[#e2e8f0] uppercase tracking-widest mb-8">Validated Expertise</h3>
            <div className="space-y-6">
              {data.foundSkills?.map((item, i) => {
                const skillName = typeof item === 'object' ? item.skill : item;
                const skillScore = typeof item === 'object' ? item.score : 85;
                return (
                  <div key={`found-${i}`} className="break-inside-avoid">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-[#0f172a] dark:text-[#ffffff] uppercase tracking-wider">{skillName}</span>
                      <span className="text-sm font-black text-[#059669] dark:text-[#10b981]">{skillScore}%</span>
                    </div>
                    <div className="h-3 w-full bg-[#e2e8f0] dark:bg-[#334155] rounded-full overflow-hidden">
                      <div style={{ width: `${skillScore}%` }} className="h-full bg-[#10b981]"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-[#f8fafc] dark:bg-[#111111] p-8 rounded-2xl border border-[#e2e8f0] dark:border-[#334155] shadow-sm">
            <h3 className="text-lg font-black text-[#1e293b] dark:text-[#e2e8f0] uppercase tracking-widest mb-8">Action Required (Gaps)</h3>
            <div className="space-y-6">
              {data.missingSkills?.map((item, i) => {
                const skillName = typeof item === 'object' ? item.skill : item;
                const skillScore = typeof item === 'object' ? item.score : 90;
                return (
                  <div key={`miss-${i}`} className="break-inside-avoid">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-bold text-[#0f172a] dark:text-[#ffffff] uppercase tracking-wider">{skillName}</span>
                      <span className="text-sm font-black text-[#f43f5e] dark:text-[#fb7185]">Importance: {skillScore}%</span>
                    </div>
                    <div className="h-3 w-full bg-[#e2e8f0] dark:bg-[#334155] rounded-full overflow-hidden">
                      <div style={{ width: `${skillScore}%` }} className="h-full bg-[#fb7185] dark:bg-[#f43f5e]"></div>
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
        <h2 className="text-3xl font-black text-[#000000] dark:text-[#ffffff] uppercase tracking-tight flex items-center gap-3 mb-10 border-b-2 border-[#10b981] pb-4">
          <Sparkles className="w-10 h-10 text-[#059669] dark:text-[#10b981]" /> Strategic Projects Lab
        </h2>
        <div className="grid grid-cols-2 gap-8">
          {projectStage?.projectList?.map((proj, i) => (
            <div key={i} className="bg-[#f8fafc] dark:bg-[#111111] border border-[#e2e8f0] dark:border-[#334155] rounded-2xl p-8 shadow-sm flex flex-col h-full break-inside-avoid">
              <h4 className="text-lg font-black text-[#047857] dark:text-[#34d399] uppercase tracking-tight mb-3">{proj.name}</h4>
              {proj.desc && <p className="text-sm text-[#334155] dark:text-[#94a3b8] mb-6 leading-relaxed">{proj.desc}</p>}
              <ul className="space-y-4 flex-1">
                {proj.points?.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#10b981] mt-2 shrink-0"></div>
                    <p className="text-sm text-[#1e293b] dark:text-[#e2e8f0] font-medium leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {(!projectStage?.projectList || projectStage.projectList.length === 0) && (
            <div className="text-[#64748b] dark:text-[#94a3b8] text-sm italic">No project recommendations available.</div>
          )}
        </div>
      </div>

      {/* Roadmap & Jobs */}
      <div className="break-inside-avoid py-8 w-full">
        <h2 className="text-3xl font-black text-[#000000] dark:text-[#ffffff] uppercase tracking-tight flex items-center gap-3 mb-10 border-b-2 border-[#10b981] pb-4">
          <Briefcase className="w-10 h-10 text-[#059669] dark:text-[#10b981]" /> Career & Jobs Center
        </h2>
        <div className="grid grid-cols-2 gap-16">
          <div>
            <h3 className="text-xl font-black text-[#1e293b] dark:text-[#e2e8f0] uppercase tracking-widest mb-8 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#059669] dark:text-[#10b981]" /> Phased Curriculum
            </h3>
            <div className="space-y-8 relative pl-6 border-l-4 border-[#e2e8f0] dark:border-[#334155]">
              {data.phasedCurriculum?.filter(step => !step.isProject).map((item, i) => (
                <div key={i} className="relative pl-8 break-inside-avoid">
                  <div className="absolute left-[-37px] top-1 w-6 h-6 rounded-full bg-[#ffffff] dark:bg-[#050505] border-4 border-[#10b981]"></div>
                  <div className="text-xs font-black text-[#059669] dark:text-[#10b981] uppercase tracking-widest mb-2">Phase {item.id}</div>
                  <h4 className="text-lg font-bold text-[#0f172a] dark:text-[#ffffff] tracking-tight mb-3">
                    {item.title.replace(/_/g, ' ')}
                  </h4>
                  <p className="text-sm text-[#334155] dark:text-[#94a3b8] font-medium leading-relaxed">{item.primaryGoal}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-[#1e293b] dark:text-[#e2e8f0] uppercase tracking-widest mb-8 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-[#059669] dark:text-[#10b981]" /> Job Portal Search Hub
            </h3>
            <div className="space-y-4">
              {data.liveJobs && data.liveJobs.length > 0 ? data.liveJobs.map((job, i) => (
                <div key={i} className="block bg-[#f8fafc] dark:bg-[#111111] border border-[#e2e8f0] dark:border-[#334155] rounded-xl p-6 shadow-sm break-inside-avoid">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-bold text-[#0f172a] dark:text-[#ffffff]">{job.title}</h4>
                  </div>
                  <div className="text-sm text-[#475569] dark:text-[#94a3b8] font-medium mb-4">{job.company} • {job.location}</div>
                  {job.description && (
                    <p className="text-xs text-[#64748b] dark:text-[#cbd5e1] mb-4 leading-relaxed">{job.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-[#e2e8f0] dark:bg-[#334155] text-[#334155] dark:text-[#e2e8f0] rounded text-xs font-bold uppercase tracking-wider">{job.type}</span>
                  </div>
                </div>
              )) : (
                <div className="bg-[#f8fafc] dark:bg-[#111111] border border-[#e2e8f0] dark:border-[#334155] rounded-xl p-8 text-center flex flex-col items-center shadow-sm">
                  <Briefcase className="w-10 h-10 text-[#94a3b8] dark:text-[#475569] mb-4" />
                  <p className="text-[#475569] dark:text-[#94a3b8] text-base font-medium">No live jobs found matching this profile yet.</p>
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
