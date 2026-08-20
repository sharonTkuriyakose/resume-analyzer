import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, TrendingUp, Briefcase, MapPin, ArrowUpRight } from 'lucide-react';

export function CareerChamber({ data, onBack }) {
  const score = data?.scoringComponents?.experience || data?.score || 60;
  const liveJobs = data?.liveJobs || [];

  const cleanJobTitle = (title) => {
    if (!title) return "";
    return title.replace(/\s*jobs?\s*on\s*.*$/i, '').trim();
  };

  const getJobSearchUrl = (job) => {
    const cleanTitle = cleanJobTitle(job.title);
    const query = encodeURIComponent(`${cleanTitle} ${job.location || ''}`.trim());
    const fullQuery = encodeURIComponent(`${cleanTitle} ${job.company || ''} ${job.location || ''}`.trim());
    
    if (!job.url) return `https://www.linkedin.com/jobs/search/?keywords=${fullQuery}`;

    const urlLower = job.url.toLowerCase();
    const titleLower = job.title ? job.title.toLowerCase() : '';
    
    if (urlLower.includes('linkedin') || titleLower.includes('linkedin')) {
      return `https://www.linkedin.com/jobs/search/?keywords=${fullQuery}`;
    } else if (urlLower.includes('indeed') || titleLower.includes('indeed')) {
      return `https://www.indeed.com/jobs?q=${fullQuery}`;
    } else if (urlLower.includes('glassdoor') || titleLower.includes('glassdoor')) {
      return `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${fullQuery}`;
    } else if (urlLower.includes('naukri') || titleLower.includes('naukri')) {
      return `https://www.naukri.com/${cleanTitle.replace(/[^a-zA-Z0-9]/g, '-')}-jobs`;
    } else if (urlLower.includes('wellfound') || urlLower.includes('angel.co') || titleLower.includes('wellfound')) {
      return `https://wellfound.com/jobs?search=${query}`;
    } else if (urlLower.includes('dice') || titleLower.includes('dice')) {
      return `https://www.dice.com/jobs?q=${encodeURIComponent(cleanTitle)}`;
    } else if (urlLower.includes('simplyhired') || titleLower.includes('simplyhired')) {
      return `https://www.simplyhired.com/search?q=${encodeURIComponent(cleanTitle)}`;
    } else if (urlLower.includes('weworkremotely') || titleLower.includes('weworkremotely')) {
      return `https://weworkremotely.com/remote-jobs/search?term=${encodeURIComponent(cleanTitle)}`;
    } else if (urlLower.includes('flexjobs') || titleLower.includes('flexjobs')) {
      return `https://www.flexjobs.com/search?search=${encodeURIComponent(cleanTitle)}`;
    } else if (urlLower.includes('upwork') || titleLower.includes('upwork')) {
      return `https://www.upwork.com/nx/search/jobs/?q=${encodeURIComponent(cleanTitle)}`;
    }
    
    return `https://www.google.com/search?q=${fullQuery}+jobs&ibp=htl;jobs`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-[#020617]/80 backdrop-blur-md overflow-y-auto"
    >
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-orange-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold flex items-center gap-2"
      >
        ← Return to Core
      </button>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 gap-8 mt-24 md:mt-0 pb-12">
        <div className="col-span-1 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-600 mb-2">Career & Jobs</h2>
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Holographic glowing ring */}
            <div className="absolute inset-0 rounded-full border-4 border-orange-500/30 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full border-[1px] border-rose-500/80 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            <span className="text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]">{score}%</span>
          </div>
          <p className="mt-4 text-orange-200 uppercase tracking-widest text-sm font-semibold">
            {score >= 70 ? 'Strong Alignment' : 'Alignment Moderate'}
          </p>
        </div>

        <div className="col-span-3 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MapPin className="text-orange-400" />
              Job Portal Search Hub
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {liveJobs && liveJobs.length > 0 ? liveJobs.map((job, i) => (
                <a key={i} href={getJobSearchUrl(job)} target="_blank" rel="noreferrer" className="block bg-[#020617]/60 border border-orange-500/20 hover:border-orange-500/50 rounded-xl p-5 transition-all group shadow-[0_0_15px_rgba(249,115,22,0.05)]">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">{cleanJobTitle(job.title)}</h4>
                    <ArrowUpRight className="w-4 h-4 text-blue-100/50 group-hover:text-orange-400 transition-colors shrink-0 ml-2" />
                  </div>
                  <div className="text-xs text-orange-200/60 font-medium mb-3 line-clamp-1">{job.company} • {job.location}</div>
                  {job.description && (
                    <p className="text-[10px] text-blue-100/50 mb-3 leading-relaxed line-clamp-2">{job.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-[9px] text-orange-200/80 font-bold uppercase tracking-wider">{job.type || 'Full Time'}</span>
                  </div>
                </a>
              )) : (
                <div className="col-span-2 bg-[#020617]/40 border border-slate-800 rounded-xl p-8 text-center flex flex-col items-center">
                  <Briefcase className="w-8 h-8 text-blue-100/30 mb-3" />
                  <p className="text-blue-100/60 text-sm">No live jobs found matching this profile yet.</p>
                  <button className="mt-4 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded text-xs font-bold text-orange-400 uppercase tracking-widest transition-colors">Scan Market</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
