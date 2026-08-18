import React from 'react';
import ResumeUpload from '../components/ResumeUpload';
import { motion } from 'framer-motion';
import { 
  Search, ShieldCheck, Zap, Activity, BrainCircuit, LineChart, FileText, Cpu, LayoutDashboard
} from 'lucide-react';

const UploadPage = ({ onAnalysisComplete, apiUrl }) => {
  return (
    <div className="w-full min-h-screen bg-[#020617] text-white font-sans selection:bg-[#3b82f6]/30 overflow-x-hidden relative">
      
      {/* Deep Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] md:w-[800px] h-[600px] bg-[#3b82f6]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* ========================================================
          HERO SECTION (Light Blue Spotlight Theme)
          ======================================================== */}
      <section className="relative w-full min-h-screen flex flex-col items-center pt-32 pb-0 overflow-hidden z-10">
        
        {/* Volumetric Spotlight Effect */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] pointer-events-none z-0 flex flex-col items-center"
        >
          {/* Top bright bar */}
          <div className="w-full max-w-[300px] md:max-w-[400px] h-[4px] bg-[#60a5fa] rounded-full shadow-[0_0_30px_rgba(96,165,250,1)]"></div>
          {/* Light cone */}
          <div 
            className="w-[200%] md:w-[1200px] h-[600px] opacity-50 blur-[50px] mix-blend-screen" 
            style={{ 
              background: 'linear-gradient(to bottom, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0) 100%)',
              clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)' 
            }}
          ></div>
        </motion.div>

        {/* Glowing Eyes Icon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 1 }}
          className="relative z-10 w-16 h-16 bg-[#0f172a] rounded-2xl border border-[#3b82f6]/30 shadow-[0_20px_40px_rgba(0,0,0,1)] flex items-center justify-center mb-8 overflow-hidden"
        >
           <motion.div 
             animate={{ x: [-6, 6, -6, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             className="flex gap-3"
           >
             <motion.div 
               animate={{ scaleY: [1, 0.1, 1, 1, 1, 0.1, 1] }}
               transition={{ duration: 5, repeat: Infinity, times: [0, 0.05, 0.1, 0.5, 0.9, 0.95, 1] }}
               className="w-2 h-4 bg-[#93c5fd] rounded-full shadow-[0_0_15px_#93c5fd]"
             />
             <motion.div 
               animate={{ scaleY: [1, 0.1, 1, 1, 1, 0.1, 1] }}
               transition={{ duration: 5, repeat: Infinity, times: [0, 0.05, 0.1, 0.5, 0.9, 0.95, 1] }}
               className="w-2 h-4 bg-[#93c5fd] rounded-full shadow-[0_0_15px_#93c5fd]"
             />
           </motion.div>
        </motion.div>

        {/* Main Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="relative z-10 text-center max-w-4xl px-4 mb-6 mt-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.1]">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">Career</span>
          </h1>
        </motion.div>
        
        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1 }}
          className="relative z-10 text-center text-blue-100/60 font-medium max-w-3xl px-4 text-sm md:text-lg leading-relaxed mb-12"
        >
          Instantly analyze your resume, identify critical skill gaps, and generate a personalized roadmap to land your dream job with AI precision.
        </motion.p>

        {/* Animated Resume Scanner Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-3xl mt-12 px-4 flex justify-center mb-12"
        >
          <div className="relative w-full aspect-[4/3] max-w-[600px] flex items-center justify-center">
             
             {/* The Resume Document */}
             <motion.div 
               animate={{ y: [-5, 5, -5] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="relative w-72 md:w-96 h-[400px] md:h-[480px] bg-[#0f172a] rounded-2xl border border-[#3b82f6]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-6 z-20"
             >
                {/* Header (Name & Contact) */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-2/3 h-6 bg-[#3b82f6]/40 rounded-full mb-3"></div>
                  <div className="flex gap-2">
                    <div className="w-16 h-2 bg-[#1e293b] rounded-full"></div>
                    <div className="w-16 h-2 bg-[#1e293b] rounded-full"></div>
                    <div className="w-16 h-2 bg-[#1e293b] rounded-full"></div>
                  </div>
                </div>
                
                {/* Section 1 */}
                <div className="w-1/4 h-3 bg-[#3b82f6]/30 rounded-full mb-3"></div>
                <div className="w-full h-2 bg-[#1e293b] rounded-full mb-2"></div>
                <div className="w-5/6 h-2 bg-[#1e293b] rounded-full mb-2"></div>
                <div className="w-4/6 h-2 bg-[#1e293b] rounded-full mb-6"></div>

                {/* Section 2 */}
                <div className="w-1/3 h-3 bg-[#3b82f6]/30 rounded-full mb-3"></div>
                <div className="w-full h-2 bg-[#1e293b] rounded-full mb-2"></div>
                <div className="w-full h-2 bg-[#1e293b] rounded-full mb-2"></div>
                <div className="w-3/4 h-2 bg-[#1e293b] rounded-full mb-6"></div>

                {/* Section 3 */}
                <div className="w-1/4 h-3 bg-[#3b82f6]/30 rounded-full mb-3"></div>
                <div className="flex flex-wrap gap-2">
                   <div className="w-12 h-2 bg-[#1e293b] rounded-full"></div>
                   <div className="w-20 h-2 bg-[#1e293b] rounded-full"></div>
                   <div className="w-16 h-2 bg-[#1e293b] rounded-full"></div>
                   <div className="w-14 h-2 bg-[#1e293b] rounded-full"></div>
                   <div className="w-24 h-2 bg-[#1e293b] rounded-full"></div>
                </div>
                
                {/* The Scanning Laser */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-[3px] bg-[#60a5fa] shadow-[0_0_30px_#60a5fa] z-30"
                ></motion.div>
                {/* Laser gradient tail */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#60a5fa]/30 z-10 -translate-y-full"
                ></motion.div>
                
                {/* Grid Overlay for tech feel */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xOSAxOUwwIDE5SDBNMCAxOVYwIiBzdHJva2U9InJnYmEoNTksMTMwLDI0NiwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] z-0 pointer-events-none"></div>
             </motion.div>

             {/* Floating Data Chips */}
             <motion.div 
               animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="hidden md:flex absolute top-1/4 -right-24 px-4 py-2 bg-[#020617]/80 backdrop-blur-md border border-[#3b82f6]/40 rounded-lg shadow-xl z-30"
             >
               <span className="text-[#60a5fa] text-xs font-bold font-mono">React.js detected</span>
             </motion.div>

             <motion.div 
               animate={{ y: [0, 15, 0], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="hidden md:flex absolute bottom-1/4 -left-28 px-4 py-2 bg-[#020617]/80 backdrop-blur-md border border-[#ef4444]/40 rounded-lg shadow-xl z-30"
             >
               <span className="text-[#f87171] text-xs font-bold font-mono">Gap: Python</span>
             </motion.div>
             
             <motion.div 
               animate={{ y: [-10, 10, -10], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
               className="hidden md:flex absolute top-1/2 -left-32 px-4 py-2 bg-[#020617]/80 backdrop-blur-md border border-[#10b981]/40 rounded-lg shadow-xl z-30"
             >
               <span className="text-[#34d399] text-xs font-bold font-mono">Strong Communication</span>
             </motion.div>
             
             <motion.div 
               animate={{ y: [10, -10, 10], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
               className="hidden md:flex absolute top-[15%] -left-12 px-4 py-2 bg-[#020617]/80 backdrop-blur-md border border-[#a855f7]/40 rounded-lg shadow-xl z-30 -translate-y-8"
             >
               <span className="text-[#c084fc] text-xs font-bold font-mono">ATS Score: 85</span>
             </motion.div>

             <motion.div 
               animate={{ y: [-15, 0, -15], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
               className="hidden md:flex absolute bottom-1/3 -right-32 px-4 py-2 bg-[#020617]/80 backdrop-blur-md border border-[#f59e0b]/40 rounded-lg shadow-xl z-30"
             >
               <span className="text-[#fbbf24] text-xs font-bold font-mono">+ Team Leadership</span>
             </motion.div>

             <motion.div 
               animate={{ y: [15, -15, 15], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
               className="hidden md:flex absolute bottom-[10%] left-1/4 px-4 py-2 bg-[#020617]/80 backdrop-blur-md border border-[#0ea5e9]/40 rounded-lg shadow-xl z-30"
             >
               <span className="text-[#38bdf8] text-xs font-bold font-mono">Agile Methodology</span>
             </motion.div>

             {/* Background Target Rings */}
             <motion.div 
               animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[300px] md:h-[300px] border border-[#3b82f6]/30 rounded-full z-10 flex items-center justify-center pointer-events-none"
             >
                <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] border border-[#3b82f6]/10 rounded-full"></div>
             </motion.div>

          </div>
        </motion.div>

        {/* Upload Action Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.0, duration: 0.8 }}
          className="relative z-20 w-full max-w-2xl px-4"
        >
          <ResumeUpload onResult={onAnalysisComplete} apiUrl={apiUrl} />
        </motion.div>

      </section>

      {/* ========================================================
          STATS ROW
          ======================================================== */}
      <section className="relative z-20 w-full max-w-4xl mx-auto px-4 mt-8 mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-1 p-1 bg-[#0f172a]/80 border border-[#3b82f6]/20 rounded-[2rem] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
        >
          {[
            { label: "Multidomain Purpose", value: "10,000+" },
            { label: "Parsing Accuracy", value: "95%" },
            { label: "Roadmap Generation", value: "24/7" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-8 px-4 bg-[#020617] rounded-[1.8rem] border border-[#3b82f6]/10 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-white tracking-widest mb-2">{stat.label}</span>
              <span className="text-4xl font-black text-white tracking-tighter">{stat.value}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ========================================================
          FEATURES GRID
          ======================================================== */}
      <section id="features" className="relative z-20 w-full max-w-[1200px] mx-auto px-4 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter drop-shadow-lg">What Is NeuralPath?</h2>
          <p className="text-blue-100/60 font-medium text-sm md:text-base max-w-2xl mx-auto">
            A Tactical Suite Of Tools That Extracts Data Signals And Behavioral
            Patterns Before They Become Market Movements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {[
            {
              icon: FileText,
              title: "Deep Document Parsing",
              desc: "Identify core competencies and technical skills using advanced NLP before major technical interviews."
            },
            {
              icon: Search,
              title: "Intelligent Gap Detection",
              desc: "Evaluates your profile against target industry standards to predict missing skills before they happen."
            },
            {
              icon: LineChart,
              title: "Behavioral Analysis",
              desc: "Advanced AI pattern recognition dissects market trends to align your resume with active job postings."
            },
            {
              icon: ShieldCheck,
              title: "Privacy Protected",
              desc: "All data undergoes heavy encryption, ensuring your personal information and career history remain intact."
            },
            {
              icon: BrainCircuit,
              title: "Live Learning Roadmap",
              desc: "Provides real-time project suggestions and upskilling pathways based on dynamic industry demand."
            },
            {
              icon: Zap,
              title: "Secure The Profits",
              desc: "Lock in high-paying roles and minimize application noise with data-driven strategy and timing."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
              className="bg-[#0f172a]/50 border border-[#3b82f6]/20 rounded-3xl p-8 hover:bg-[#0f172a] hover:border-[#3b82f6]/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all group relative overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#60a5fa]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex justify-center mb-8 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-[#3b82f6]/20 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-[#3b82f6]/10 group-hover:scale-110 transition-transform duration-500 delay-75"></div>
                
                <div className="relative w-12 h-12 bg-[#020617] border border-[#3b82f6]/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(96,165,250,0.3)] transition-all">
                  <feature.icon className="w-5 h-5 text-[#60a5fa]/70 group-hover:text-[#93c5fd] transition-colors" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-3 text-center tracking-tight">{feature.title}</h3>
              <p className="text-sm text-blue-100/50 font-medium text-center leading-relaxed group-hover:text-blue-100/70 transition-colors">
                {feature.desc}
              </p>
            </motion.div>
          ))}
          
        </div>
      </section>

      {/* ========================================================
          ARCHITECTURE PIPELINE (Flow Structure)
          ======================================================== */}
      <section id="how-it-works" className="w-full bg-[#020617] py-24 px-4 sm:px-8 xl:px-0 relative border-t border-[#3b82f6]/10 overflow-hidden">
        
        {/* Faint spotlight in background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-[#3b82f6]/10 to-transparent blur-[80px] pointer-events-none z-0"></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">How It Works</h2>
             <p className="text-blue-100/60 font-medium mt-4 max-w-2xl mx-auto text-sm md:text-base">
               A transparent, end-to-end pipeline from document parsing to actionable career roadmaps.
             </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative py-12">
             {/* Animated Connector Line (Horizontal for Desktop) */}
             <div className="hidden md:block absolute top-1/2 left-[5%] w-[90%] h-[2px] bg-[#0f172a] -translate-y-1/2 z-0 overflow-hidden">
               <motion.div 
                 className="h-full bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent w-1/2"
                 animate={{ x: ['-100%', '200%'] }}
                 transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
               />
             </div>

             {/* Animated Connector Line (Vertical for Mobile) */}
             <div className="block md:hidden absolute top-[5%] left-1/2 w-[2px] h-[90%] bg-[#0f172a] -translate-x-1/2 z-0 overflow-hidden">
               <motion.div 
                 className="w-full bg-gradient-to-b from-transparent via-[#3b82f6] to-transparent h-1/2"
                 animate={{ y: ['-100%', '200%'] }}
                 transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
               />
             </div>

             {[
               { icon: FileText, label: "Resume PDF" },
               { icon: Cpu, label: "Parsing Engine" },
               { icon: ShieldCheck, label: "Authenticator" },
               { icon: Search, label: "Skill Extraction" },
               { icon: Activity, label: "Deductive Scoring" },
               { icon: BrainCircuit, label: "LLM Gap Analysis" },
               { icon: LayoutDashboard, label: "Dashboard" }
             ].map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1, duration: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-[#0f172a] border border-[#3b82f6]/20 p-4 rounded-2xl flex flex-col items-center justify-center gap-4 w-full md:w-[140px] h-36 relative z-10 shadow-lg group hover:bg-[#1e293b] hover:border-[#3b82f6]/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all cursor-default"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#020617] border border-[#3b82f6]/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#3b82f6]/10 transition-all">
                    <step.icon className="w-5 h-5 text-[#60a5fa]/70 group-hover:text-[#93c5fd] transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-200/50 group-hover:text-blue-100/90 text-center uppercase tracking-widest transition-colors">{step.label}</span>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default UploadPage;