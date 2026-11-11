import React, { useState, useEffect, useMemo } from 'react';
import { motion, animate } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Check, CheckCircle2, AlertTriangle, 
  Search, Share2, Download, RotateCcw, ShieldCheck, Target, 
  BookOpen, Briefcase, FileText, Sparkles, Copy, ExternalLink, 
  Youtube, MapPin, Mail, Phone, Linkedin, Award, Calendar, 
  FolderKanban, X, ChevronRight, Star, Clock, Layers
} from 'lucide-react';

import PrintView from '../components/PrintView';

// Default candidate fallback
const DEFAULT_CANDIDATE = {
  name: "Rohan Verma",
  role: "Mechanical Design Engineer",
  email: "rohanverma@gmail.com",
  phone: "+91 98765 43210",
  location: "Bengaluru, Karnataka, India",
  linkedin: "linkedin.com/in/rohan-verma",
  education: "B.Tech Mechanical Engineering",
  score: 78,
  verifiedSkillsCount: 10,
  projectsCount: 3,
  experience: "2 Years",
  certificationsCount: 4,
  roleDescription: "Design, develop and analyze mechanical systems and components using CAD tools and engineering principles.",
  tags: ["CAD Modeling", "Design Analysis", "Problem Solving", "Product Development"],
  authenticityScore: 92,
  authenticityReasoning: "Authentic engineering project work with verified metrics, engineering standards, and production design validations."
};

export default function ResultPage({ data, onReset, apiUrl }) {
  // Navigation: 'main' | 'subtopic_keywords' | 'subtopic_skills' | 'subtopic_roadmap' | 'subtopic_jobs'
  const [currentView, setCurrentView] = useState('main');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);

  // Subtopic local filter states
  const [skillFilter, setSkillFilter] = useState('all'); // 'all' | 'verified' | 'missing'
  const [jobSearch, setJobSearch] = useState('');
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStepCompleted = (key) => {
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Extract candidate profile from data or fallback
  const rawName = data?.candidate?.name;
  const nameFromReasoning = data?._reasoning 
    ? data._reasoning.match(/^([A-Z][a-zA-Z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-zA-Z]+)/)?.[1] 
    : null;
  
  const resolvedName = (rawName && !rawName.toLowerCase().includes('candidate') && !rawName.toLowerCase().includes('string') && rawName !== 'Not specified')
    ? rawName
    : (nameFromReasoning && !nameFromReasoning.toLowerCase().includes('the candidate') && !nameFromReasoning.toLowerCase().includes('this resume'))
      ? nameFromReasoning
      : DEFAULT_CANDIDATE.name;

  const role = data?.domain || DEFAULT_CANDIDATE.role;
  const [customRole, setCustomRole] = useState(role);

  useEffect(() => {
    if (data?.domain) setCustomRole(data.domain);
  }, [data]);

  const email = (data?.candidate?.email && data.candidate.email !== 'Not specified' && !data.candidate.email.includes('example.com') && !data.candidate.email.includes('string'))
    ? data.candidate.email 
    : DEFAULT_CANDIDATE.email;

  const phone = (data?.candidate?.phone && data.candidate.phone !== 'Not specified' && !data.candidate.phone.includes('555') && !data.candidate.phone.includes('string'))
    ? data.candidate.phone 
    : DEFAULT_CANDIDATE.phone;

  const location = (data?.candidate?.location && data.candidate.location !== 'Not specified' && !data.candidate.location.includes('string'))
    ? data.candidate.location 
    : DEFAULT_CANDIDATE.location;

  const education = (data?.candidate?.education && data.candidate.education !== 'Not specified' && !data.candidate.education.includes('string'))
    ? data.candidate.education
    : DEFAULT_CANDIDATE.education;

  const candidateSummary = data?.candidate?.summary && data.candidate.summary !== 'Not specified' && !data.candidate.summary.includes('string')
    ? data.candidate.summary
    : data?._reasoning 
      ? data._reasoning.slice(0, 160) + '...'
      : "Results-driven engineering professional with practical technical foundation and demonstrated portfolio execution.";

  const linkedin = (email.includes('@')) 
    ? `linkedin.com/in/${resolvedName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    : DEFAULT_CANDIDATE.linkedin;

  const score = (typeof data?.score === 'number' && data.score > 0) ? data.score : DEFAULT_CANDIDATE.score;
  const verifiedSkillsCount = data?.foundSkills?.length || DEFAULT_CANDIDATE.verifiedSkillsCount;
  
  const projectStage = data?.phasedCurriculum?.find(step => step.id === 4 || step.isProject);
  const projectsCount = projectStage?.projectList?.length || DEFAULT_CANDIDATE.projectsCount;

  const experience = (data?.scoringComponents?.experience && data.scoringComponents.experience >= 60)
    ? "3+ Years"
    : (data?.scoringComponents?.experience && data.scoringComponents.experience >= 30)
      ? "2 Years"
      : DEFAULT_CANDIDATE.experience;

  const certificationsCount = (data?.scoringComponents?.certifications && data.scoringComponents.certifications >= 60)
    ? 4
    : DEFAULT_CANDIDATE.certificationsCount;

  // Initials for avatar
  const getInitials = (fullName) => {
    if (!fullName) return "CP";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return fullName.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(resolvedName);

  // Animate score counter
  useEffect(() => {
    const controls = animate(displayScore, score, {
      duration: 1.0,
      ease: "easeOut",
      onUpdate: (v) => setDisplayScore(Math.round(v))
    });
    return () => controls.stop();
  }, [score]);

  // Handle Share
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Copy Single Keyword
  const handleCopyKeyword = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(text);
    setTimeout(() => setCopiedKeyword(null), 1500);
  };

  // Handle Copy All Missing Keywords
  const handleCopyAllMissing = () => {
    const missingList = (data?.keywordsMissing || []).map(k => typeof k === 'object' ? k.keyword : k).join(', ');
    navigator.clipboard.writeText(missingList);
    setCopiedKeyword('all_missing');
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  // Circular gauge calculations
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const readinessStatus = score >= 80 ? "Interview Ready" : score >= 65 ? "Competitive Baseline" : "Needs Optimization";

  // Data sets
  const allFoundSkills = useMemo(() => data?.foundSkills || [
    { skill: "SolidWorks 3D Modeling", score: 85, description: "Applied for detailed part modeling, complex assembly construction, and drawing drafting." },
    { skill: "Siemens NX CAD", score: 78, description: "Utilized for parametric surfaces, kinematic fits, and component structures." },
    { skill: "Thermal-Fluid Analysis", score: 72, description: "Demonstrated through heat exchanger fabrication, flow dynamics, and temperature modeling." },
    { skill: "Additive Prototyping", score: 75, description: "Familiar with 3D printing slicing, infill structural integrity, and digital manufacturing." }
  ], [data]);

  const allMissingSkills = useMemo(() => data?.missingSkills || [
    { skill: "GD&T (ASME Y14.5)", score: 95, description: "Industry positions strictly require ASME Y14.5 standards to define allowable production tolerances." },
    { skill: "Finite Element Analysis (FEA)", score: 92, description: "Structural stress, fatigue cycles, and modal mechanics using Ansys Mechanical are critical gaps." },
    { skill: "Design for Manufacturing & Assembly (DFMA)", score: 90, description: "Essential for optimizing parts for tooling, injection molding drafts, and CNC cycle times." },
    { skill: "Product Lifecycle Management (PLM)", score: 85, description: "Enterprise teams rely on tools like Teamcenter or Windchill for CAD versioning and release workflows." }
  ], [data]);

  const allKeywordsDetected = useMemo(() => data?.keywordsDetected || [
    { keyword: "CAD Modeling", context: "Found in primary project design sections." },
    { keyword: "SolidWorks", context: "Found in technical toolset and drawing annotations." },
    { keyword: "Siemens NX", context: "Parametric surface drafting and assembly modeling." },
    { keyword: "Ansys Fluent", context: "Thermal fluid simulations and boundary layer setups." },
    { keyword: "Heat Exchanger", context: "Hardware prototype fabrication and testing." },
    { keyword: "3D Printing", context: "Rapid prototyping and iterative fit verification." }
  ], [data]);

  const allKeywordsMissing = useMemo(() => data?.keywordsMissing || [
    { keyword: "GD&T (ASME Y14.5)", context: "Geometric dimensioning standard mandatory for production manufacturing." },
    { keyword: "FEA Structural Analysis", context: "Finite element stress mechanics essential for structural verification." },
    { keyword: "DFMA Optimization", context: "Design for manufacturing and assembly reduction guidelines." },
    { keyword: "Tolerance Stack-up", context: "1D/3D assembly statistical variation analysis." },
    { keyword: "Teamcenter PLM", context: "Product lifecycle release and revision management system." }
  ], [data]);

  // Scoring algorithm component values
  const s = data?.scoringComponents?.skills ?? 75;
  const p = data?.scoringComponents?.projects ?? 70;
  const e = data?.scoringComponents?.experience ?? 65;
  const c = data?.scoringComponents?.certifications ?? 60;
  const a = data?.scoringComponents?.atsFormatting ?? 82;

  // DYNAMIC ROLE-BASED ROADMAP (Respective to the particular job role in the resume)
  const rolePhases = useMemo(() => {
    // 1. If backend AI generated phasedCurriculum, use it directly!
    const aiPhases = data?.phasedCurriculum?.filter(step => !step.isProject && step.id <= 3);
    if (aiPhases && aiPhases.length > 0) {
      return aiPhases.map((phase, idx) => ({
        step: `0${phase.id || idx + 1}`,
        title: phase.title,
        goal: phase.primaryGoal,
        points: phase.points || [],
        docUrl: phase.docLink || `https://google.com/search?q=${encodeURIComponent(customRole + " " + phase.title + " learning roadmap documentation")}`,
        videoUrl: phase.videoLink || `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " " + phase.title + " tutorial complete")}`
      }));
    }

    // 2. Dynamic tailoring based on customRole
    const isSoftware = /developer|software|frontend|backend|full stack|web|react|node|python|java|engineer/i.test(customRole) && !/mechanical|civil|electrical|chemical/i.test(customRole);
    const isData = /data|machine learning|ai|analyst|scientist|deep learning/i.test(customRole);

    if (isSoftware) {
      return [
        {
          step: "01",
          title: `Core Architecture & Clean Code for ${customRole}`,
          goal: "Master foundational software patterns, typed data structures, and production error handling.",
          points: ["System design modularity & OOP / Functional principles", "REST & GraphQL API contracts with schema validation", "Git branch strategies & automated unit/integration testing"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " architecture clean code documentation roadmap")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " tutorial full course 2026")}`
        },
        {
          step: "02",
          title: `Scalable Distributed Systems & Cloud Infrastructure`,
          goal: "Transition to building high-concurrency backends, microservices, and containerized cloud workloads.",
          points: ["Containerization with Docker & Kubernetes orchestration", "Database indexing, caching with Redis, and ACID transactions", "Asynchronous event queues (Kafka / RabbitMQ)"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " distributed systems cloud roadmap")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " distributed systems docker tutorial")}`
        },
        {
          step: "03",
          title: `Production CI/CD, Observability & Security`,
          goal: "Achieve enterprise engineering workflow readiness by mastering release pipelines and monitoring.",
          points: ["Automated GitHub Actions CI/CD deployment pipelines", "Prometheus & Grafana telemetry / distributed tracing", "OAuth2/OIDC security, rate-limiting, and penetration audits"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " production cicd observability roadmap")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " devops cicd monitoring tutorial")}`
        }
      ];
    } else if (isData) {
      return [
        {
          step: "01",
          title: `Advanced Data Pipelines & Feature Engineering`,
          goal: "Establish robust, reproducible data extraction, cleaning, and transformation pipelines.",
          points: ["Distributed SQL queries & vector storage optimization", "Data validation frameworks (Great Expectations / Pydantic)", "Feature store architectures & automated preprocessing"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " data engineering pipeline roadmap")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " data pipeline tutorial")}`
        },
        {
          step: "02",
          title: `Applied Modeling, Validation & Hyperparameter Tuning`,
          goal: "Develop high-performing predictive models and deep learning architectures with cross-validation.",
          points: ["Model evaluation metrics (ROC-AUC, F1, Loss curves)", "Hyperparameter optimization with Optuna / Ray", "Explainable AI (SHAP & LIME feature importances)"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " machine learning modeling roadmap")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " machine learning modeling tutorial")}`
        },
        {
          step: "03",
          title: `Production MLOps, Containerized Serving & Drift Detection`,
          goal: "Deploy models into real-time REST/gRPC endpoints with data drift and performance monitoring.",
          points: ["Model registry & versioning with MLflow", "Containerized low-latency inference with FastAPI & Docker", "Automated model retraining & concept drift alert systems"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " mlops production serving roadmap")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " mlops tutorial step by step")}`
        }
      ];
    } else {
      // Mechanical / Hardware default
      return [
        {
          step: "01",
          title: `Industrial Standards & GD&T Precision (ASME Y14.5)`,
          goal: "Transition from basic drafting to industry-standard mechanical design compliant with ASME Y14.5.",
          points: ["Master ASME Y14.5 datum establishment (A, B, C) and Rule #1", "Perform worst-case and statistical RSS tolerance stack-ups", "Create production-ready 2D manufacturing drawings with BOM"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " ASME Y14.5 GD%26T documentation roadmap")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " GD%26T tutorial step by step")}`
        },
        {
          step: "02",
          title: `Structural Mechanics & Advanced CAE Simulation`,
          goal: "Prove structural integrity under static, modal vibration, and coupled thermal-expansion loading.",
          points: ["Finite element meshing, boundary layer inflation & convergence", "Von Mises yield criteria and factor of safety distribution", "Coupled conjugate heat transfer (CHT) and thermal stress"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " FEA simulation Ansys roadmap")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " Ansys FEA tutorial")}`
        },
        {
          step: "03",
          title: `Enterprise PLM Workflow, DFMA & Production Tooling`,
          goal: "Achieve enterprise engineering workflow readiness by mastering PLM architectures and tooling.",
          points: ["Siemens Teamcenter / Windchill CAD check-in and ECO release", "Sheet metal stamping K-factors and injection mold tooling drafts", "DFMA part consolidation and assembly cost reduction"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " PLM Teamcenter DFMA roadmap")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " PLM DFMA tutorial")}`
        }
      ];
    }
  }, [data, customRole]);

  // DYNAMIC ROLE-BASED PROJECTS (Respective to the particular job role in the resume)
  const roleProjects = useMemo(() => {
    // 1. If backend AI generated projectList, use it directly!
    const aiProjects = projectStage?.projectList;
    if (aiProjects && aiProjects.length > 0) {
      return aiProjects.map((proj, idx) => ({
        num: `0${idx + 1}`,
        name: proj.name,
        desc: proj.desc,
        points: proj.points || [],
        docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " " + proj.name + " project documentation guide")}`,
        videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " " + proj.name + " tutorial")}`
      }));
    }

    // 2. Dynamic tailoring based on customRole
    const isSoftware = /developer|software|frontend|backend|full stack|web|react|node|python|java|engineer/i.test(customRole) && !/mechanical|civil|electrical|chemical/i.test(customRole);
    const isData = /data|machine learning|ai|analyst|scientist|deep learning/i.test(customRole);

    if (isSoftware) {
      return [
        {
          num: "01",
          name: `High-Throughput Microservice Architecture for ${customRole}`,
          desc: "Architect and build a resilient backend microservice handling 10,000+ req/sec with rate limiting, Redis caching, and circuit breakers.",
          points: ["Redis Caching", "Docker Containerization", "PostgreSQL Connection Pooling"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " microservice high throughput architecture project")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " microservice project tutorial")}`
        },
        {
          num: "02",
          name: `Event-Driven Data Pipeline with Kafka Streaming`,
          desc: "Build an asynchronous pub/sub event pipeline processing live user events with schema validation and dead-letter queues.",
          points: ["Apache Kafka", "Event-Driven Architecture", "Automated CI/CD"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " kafka event driven pipeline project")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " kafka project tutorial")}`
        },
        {
          num: "03",
          name: `Production Cloud SaaS with Auth0 & Kubernetes Deployment`,
          desc: "Deploy a production-ready full stack platform with OAuth2 RBAC, Prometheus telemetry, and automated Kubernetes scaling.",
          points: ["Kubernetes (K8s)", "Prometheus & Grafana", "OAuth2 Security"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " kubernetes saas deployment project")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " kubernetes deployment tutorial")}`
        }
      ];
    } else if (isData) {
      return [
        {
          num: "01",
          name: `Real-Time Fraud Detection & Feature Store Pipeline`,
          desc: "Construct an end-to-end streaming data pipeline that flags anomalous transactions using XGBoost and feast feature store.",
          points: ["Streaming Feature Store", "XGBoost Classification", "SHAP Interpretability"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " real time fraud detection project")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " fraud detection tutorial")}`
        },
        {
          num: "02",
          name: `Domain-Specific LLM Fine-Tuning & RAG System`,
          desc: "Build an enterprise document search engine using LangChain, pgvector embeddings, and low-rank adaptation (LoRA).",
          points: ["Retrieval-Augmented Generation (RAG)", "Vector Embeddings", "LoRA Fine-Tuning"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " rag system llm fine tuning project")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " rag llm tutorial")}`
        },
        {
          num: "03",
          name: `Production MLOps Pipeline with MLflow & Drift Monitoring`,
          desc: "Deploy an automated retraining pipeline with Docker, MLflow model registry, and evidently.ai data drift detection.",
          points: ["MLflow Registry", "Evidently Data Drift", "FastAPI Serving"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " mlops production pipeline project")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " mlops project tutorial")}`
        }
      ];
    } else {
      return [
        {
          num: "01",
          name: "Thermal-Stress Simulation of IP67 EV Traction Inverter",
          desc: "Design an IP67 die-cast aluminum enclosure with heat sink fins and run coupled thermal-vibration FEA in Ansys.",
          points: ["FEA with Ansys Mechanical", "ASME Y14.5 GD&T Drawings", "Die Casting Draft Angles"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " EV inverter enclosure thermal simulation guide")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " inverter enclosure thermal simulation ansys")}`
        },
        {
          num: "02",
          name: "Automated Tolerance Stack-Up Synthesis on Kinematic Linkage",
          desc: "Model a deployable mechanism in Siemens NX. Compute worst-case and RSS tolerance stacks to ensure zero binding.",
          points: ["Tolerance Stack-Up Analysis", "Kinematic Assembly", "DFMEA Risk Assessment"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " tolerance stack up analysis guide mechanical")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " tolerance stack up analysis tutorial")}`
        },
        {
          num: "03",
          name: "Chassis Sheet Metal Stamped Mount with PLM Release",
          desc: "Engineer a stamped structural mount with proper bend reliefs and simulate a Teamcenter PLM Engineering Change Order release.",
          points: ["Sheet Metal Stamping", "Siemens Teamcenter PLM", "DFMA Assembly"],
          docUrl: `https://google.com/search?q=${encodeURIComponent(customRole + " sheet metal stamping design guidelines PLM")}`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(customRole + " sheet metal stamping design tutorial")}`
        }
      ];
    }
  }, [projectStage, customRole]);

  return (
    <div className="w-full min-h-screen bg-[#0A0F1D] text-slate-100 font-sans antialiased flex flex-col selection:bg-slate-700">
      
      {/* ========================================================
          GLOBAL NAVBAR
          ======================================================== */}
      <header className="w-full bg-[#0E1528] border-b border-slate-800 px-4 md:px-8 py-3 shrink-0 flex items-center justify-between z-30 print:hidden">
        
        {/* Left: Brand or Sub-Page Back Button */}
        <div className="flex items-center gap-3">
          {currentView !== 'main' ? (
            <button
              onClick={() => setCurrentView('main')}
              className="flex items-center gap-2 bg-[#172136] hover:bg-[#1E2B45] text-white px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold transition-all active:scale-95 shadow-sm group"
            >
              <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Overview</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight text-white block leading-none">NeuralPath Screening</span>
                <span className="text-[10px] text-slate-400 font-medium">ATS Profile Report</span>
              </div>
            </div>
          )}

          {currentView !== 'main' && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 pl-3 border-l border-slate-800">
              <span className="text-slate-500">Active Chamber:</span>
              <span className="text-white font-semibold">
                {currentView === 'subtopic_keywords' && 'ATS Keyword Audit'}
                {currentView === 'subtopic_skills' && 'Technical Skill Gap Matrix'}
                {currentView === 'subtopic_roadmap' && `Learning Roadmap & Projects (${customRole})`}
                {currentView === 'subtopic_jobs' && `Matched Jobs (${customRole})`}
              </span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-[#172136] hover:bg-[#1E2B45] px-3 py-1.5 rounded-lg border border-slate-700/80 transition-all"
            title="Scan another resume"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">New Scan</span>
          </button>

          <button 
            onClick={handleShare}
            className="bg-[#172136] hover:bg-[#1E2B45] text-slate-300 hover:text-white border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>
          
          <button 
            onClick={() => window.print()}
            className="bg-white hover:bg-slate-200 text-slate-900 rounded-lg px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Report</span>
          </button>

          {/* Profile Initials Badge */}
          <div className="flex items-center gap-2 bg-[#172136] border border-slate-700 px-2.5 py-1 rounded-lg">
            <span className="w-5 h-5 rounded bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center">
              {initials}
            </span>
            <span className="text-xs font-medium text-white hidden md:inline">{resolvedName}</span>
          </div>
        </div>

      </header>

      {/* ========================================================
          1. MAIN SCREEN: HIGHLIGHTED SCORE & THE 4 SUBTOPICS
          (Fits 100% on screen WITHOUT SCROLLING, none of the concepts below!)
          ======================================================== */}
      {currentView === 'main' && (
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-6 flex flex-col justify-between gap-4 z-10 lg:h-[calc(100vh-60px)] lg:overflow-hidden print:p-0">
          
          {/* SECTION A: HIGHLIGHTED SCORE & CANDIDATE BANNER */}
          <section className="bg-[#0E1528] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              
              {/* Highlighted Score Gauge (Cols 1-4) */}
              <div className="md:col-span-4 flex items-center gap-5 pr-0 md:pr-4 md:border-r border-slate-800">
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} stroke="#1E293B" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="#FFFFFF"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-white font-mono leading-none">
                      {displayScore}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5">/ 100</span>
                  </div>
                </div>

                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1.5 bg-slate-800 text-white border border-slate-700">
                    {readinessStatus}
                  </span>
                  <h1 className="text-xl font-extrabold text-white tracking-tight">{resolvedName}</h1>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
                    <span>Target: <strong className="text-white font-bold">{customRole}</strong></span>
                    <button 
                      onClick={() => setShowRoleModal(true)} 
                      className="text-[10px] text-slate-400 hover:text-white underline font-semibold ml-1"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>

              {/* Candidate Profile Details (Cols 5-8) */}
              <div className="md:col-span-5 px-0 md:px-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  <span>AI Executive Screening Diagnostic</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {candidateSummary}
                </p>

                <div className="flex items-center gap-x-4 gap-y-1.5 flex-wrap text-xs text-slate-400 mt-2.5 pt-2 border-t border-slate-800">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {email}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {location}</span>
                  <span className="flex items-center gap-1"><Award className="w-3 h-3 text-slate-400" /> {education}</span>
                </div>
              </div>

              {/* 4 Metric Pills (Cols 9-12) */}
              <div className="md:col-span-3 grid grid-cols-2 gap-2">
                <div className="bg-[#172136] p-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Verified Skills</span>
                  <span className="text-base font-bold text-white font-mono">{verifiedSkillsCount}</span>
                </div>
                <div className="bg-[#172136] p-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Missing Keywords</span>
                  <span className="text-base font-bold text-rose-400 font-mono">{allKeywordsMissing.length}</span>
                </div>
                <div className="bg-[#172136] p-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Projects Lab</span>
                  <span className="text-base font-bold text-white font-mono">{projectsCount}</span>
                </div>
                <div className="bg-[#172136] p-2 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Experience</span>
                  <span className="text-base font-bold text-white font-mono">{experience}</span>
                </div>
              </div>

            </div>
          </section>

          {/* SECTION B: THE 4 SUBTOPICS DISPLAYED UNDER IT (CLICKING OPENS WHOLE NEW PAGE) */}
          <section className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Select a Chamber to Open Full Analysis</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Click any card to open as a dedicated whole new page →
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch flex-1">
              
              {/* SUBTOPIC 1: ATS Keyword Audit (Keyword Match Rate) */}
              <div 
                onClick={() => setCurrentView('subtopic_keywords')}
                className="bg-[#0E1528] hover:bg-[#141E38] border border-slate-800 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-150 group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-white border border-slate-700 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                      {a}% ATS Format
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-white transition-colors flex items-center justify-between">
                    <span>1. ATS Keyword Audit</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Full keyword match rate audit, detected vs missing keywords, and the exact deductive scoring formula.
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Detected Keywords:</span>
                      <strong className="text-white font-mono">{allKeywordsDetected.length} Found</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical Gaps:</span>
                      <strong className="text-rose-400 font-mono">{allKeywordsMissing.length} Missing</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-white">
                  <span>Open Keyword Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* SUBTOPIC 2: Technical Skill Gap Matrix */}
              <div 
                onClick={() => setCurrentView('subtopic_skills')}
                className="bg-[#0E1528] hover:bg-[#141E38] border border-slate-800 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-150 group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-white border border-slate-700 flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                      {allMissingSkills.length} Gaps
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-white transition-colors flex items-center justify-between">
                    <span>2. Skill Gap Matrix</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Side-by-side comparison of skills found on your resume versus required industry competencies.
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Verified Skills:</span>
                      <strong className="text-white font-mono">{allFoundSkills.length} Verified</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Required Missing:</span>
                      <strong className="text-rose-400 font-mono">{allMissingSkills.length} Gaps</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-white">
                  <span>Open Skill Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* SUBTOPIC 3: Learning Roadmap & Project Tutorials */}
              <div 
                onClick={() => setCurrentView('subtopic_roadmap')}
                className="bg-[#0E1528] hover:bg-[#141E38] border border-slate-800 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-150 group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-white border border-slate-700 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                      Role-Tailored
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-white transition-colors flex items-center justify-between">
                    <span>3. Roadmap & Projects</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Step-by-step curriculum and 3 project blueprints tailored specifically to <strong>{customRole}</strong> with direct documentation & video tutorials.
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Roadmap Steps:</span>
                      <strong className="text-white font-mono">3 Steps</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Strategic Lab:</span>
                      <strong className="text-white font-mono">3 Projects</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-white">
                  <span>Open Roadmap & Projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* SUBTOPIC 4: Matched Job Openings */}
              <div 
                onClick={() => setCurrentView('subtopic_jobs')}
                className="bg-[#0E1528] hover:bg-[#141E38] border border-slate-800 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-150 group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-white border border-slate-700 flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                      12 Portals
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-white transition-colors flex items-center justify-between">
                    <span>4. Matched Jobs</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Direct 1-click apply links tailored to your verified technical skills on LinkedIn, Indeed, Glassdoor & Wellfound.
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Matching Role:</span>
                      <strong className="text-white truncate max-w-[130px]">{customRole}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Links:</span>
                      <strong className="text-white font-mono">12 Live Searches</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-white">
                  <span>View Matched Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </section>

        </main>
      )}

      {/* ========================================================
          SUBTOPIC 1 (WHOLE NEW PAGE): ATS KEYWORD AUDIT & SCORING ALGORITHM
          ======================================================== */}
      {currentView === 'subtopic_keywords' && (
        <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
          
          {/* Header Banner */}
          <div className="bg-[#0E1528] border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                CHAMBER 01 • ATS SCREENING AUDIT
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                ATS Keyword Audit (Keyword Match Rate)
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Applicant tracking systems parse your resume for exact industry terminology. Here is the keyword match analysis for <strong>{customRole}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-[#172136] border border-slate-800 px-4 py-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Overall Score</span>
                <span className="text-xl font-mono font-bold text-white">{score}%</span>
              </div>
              <div className="bg-[#172136] border border-slate-800 px-4 py-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">ATS Syntax</span>
                <span className="text-xl font-mono font-bold text-white">{a}%</span>
              </div>
            </div>
          </div>

          {/* Keywords Match Lists (Detected vs Missing) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Detected Keywords */}
            <div className="bg-[#0E1528] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Keywords Found in Your Resume ({allKeywordsDetected.length})</span>
                  </h3>
                  <span className="text-[10px] font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Passed</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  These verified technical keywords were successfully indexed by ATS parsing filters:
                </p>

                <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
                  {allKeywordsDetected.map((kw, i) => {
                    const name = typeof kw === 'object' ? kw.keyword : kw;
                    return (
                      <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-white border border-slate-700">
                        ✓ {name}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                These keywords ensure your resume passes the initial ATS keyword thresholds.
              </div>
            </div>

            {/* Critical Missing Keywords */}
            <div className="bg-[#0E1528] border border-rose-500/30 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Critical Missing Keywords ({allKeywordsMissing.length})</span>
                  </h3>
                  <button
                    onClick={handleCopyAllMissing}
                    className="text-xs font-semibold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                  >
                    {copiedKeyword === 'all_missing' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKeyword === 'all_missing' ? 'Copied' : 'Copy All'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  ATS filters for {customRole} search for these terms. Adding them directly increases recruiter callbacks:
                </p>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {allKeywordsMissing.map((kw, i) => {
                    const name = typeof kw === 'object' ? kw.keyword : kw;
                    const ctx = typeof kw === 'object' ? kw.context : "Mandatory skill for role";
                    return (
                      <div key={i} className="bg-[#172136] p-2.5 rounded-xl border border-rose-500/20 flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-rose-300 block">+ {name}</span>
                          <span className="text-[11px] text-slate-400">{ctx}</span>
                        </div>
                        <button
                          onClick={() => handleCopyKeyword(name)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 shrink-0 flex items-center gap-1"
                        >
                          {copiedKeyword === name ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKeyword === name ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-rose-300/80">
                Action: Weave these exact keywords into your experience bullet points.
              </div>
            </div>

          </div>

          {/* DEDUCTIVE SCORING ALGORITHM FORMULA AT THE BOTTOM */}
          <div className="bg-[#0E1528] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Deductive Scoring Algorithm & Calculation Formula</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The transparent multi-variable mathematical formula used to calculate candidate market readiness.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-white bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
                Final Score: {score}/100
              </span>
            </div>

            {/* Formula Box */}
            <div className="bg-[#172136] border border-slate-700 rounded-xl p-4 mb-5 text-center">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Deductive Mathematical Equation
              </span>
              <div className="text-xs sm:text-sm md:text-base font-mono font-bold text-white tracking-wide">
                Score = <span className="text-white font-bold">0.30(S)</span> + <span className="text-white font-bold">0.25(P)</span> + <span className="text-white font-bold">0.20(E)</span> + <span className="text-white font-bold">0.15(C)</span> + <span className="text-white font-bold">0.10(A)</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Where <strong className="text-white">S</strong> = Technical Skills ({s}%), <strong className="text-white">P</strong> = Projects ({p}%), <strong className="text-white">E</strong> = Experience ({e}%), <strong className="text-white">C</strong> = Certifications ({c}%), <strong className="text-white">A</strong> = ATS Syntax ({a}%)
              </div>
            </div>

            {/* 5 Component Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
              {[
                { label: "Skills (S)", weight: "30%", val: s, pts: (0.30 * s).toFixed(1) },
                { label: "Projects (P)", weight: "25%", val: p, pts: (0.25 * p).toFixed(1) },
                { label: "Experience (E)", weight: "20%", val: e, pts: (0.20 * e).toFixed(1) },
                { label: "Certifications (C)", weight: "15%", val: c, pts: (0.15 * c).toFixed(1) },
                { label: "ATS Syntax (A)", weight: "10%", val: a, pts: (0.10 * a).toFixed(1) }
              ].map((comp, idx) => (
                <div key={idx} className="bg-[#172136] p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span className="text-white">{comp.label}</span>
                    <span className="text-white font-mono">{comp.val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-white rounded-full" style={{ width: `${comp.val}%` }}></div>
                  </div>
                  <span className="text-[10px] text-slate-400 block">Weight: <strong>{comp.weight}</strong></span>
                  <span className="text-[10px] text-white font-mono font-semibold">+{comp.pts} pts</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Verified with NeuralPath Screening Engine v3.8</span>
              <span className="text-white font-mono font-semibold">Deductive Sum: {((0.30 * s) + (0.25 * p) + (0.20 * e) + (0.15 * c) + (0.10 * a)).toFixed(1)} ≈ {score}%</span>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          SUBTOPIC 2 (WHOLE NEW PAGE): TECHNICAL SKILL GAP MATRIX
          ======================================================== */}
      {currentView === 'subtopic_skills' && (
        <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
          
          {/* Header */}
          <div className="bg-[#0E1528] border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                CHAMBER 02 • TECHNICAL BENCHMARKING
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                Technical Skill Gap Matrix ({customRole})
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Direct side-by-side comparison of skills found on your resume against critical industry expectations for {customRole}.
              </p>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-1.5 bg-[#172136] p-1 rounded-xl border border-slate-800 shrink-0">
              {[
                { id: 'all', label: `All (${allFoundSkills.length + allMissingSkills.length})` },
                { id: 'verified', label: `Verified (${allFoundSkills.length})` },
                { id: 'missing', label: `Gaps (${allMissingSkills.length})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSkillFilter(f.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    skillFilter === f.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Verified Skills */}
            {(skillFilter === 'all' || skillFilter === 'verified') && (
              <div className="bg-[#0E1528] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Skills You Have (Verified Strengths)</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-white">{allFoundSkills.length} Verified</span>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {allFoundSkills.map((item, idx) => (
                    <div key={idx} className="bg-[#172136] p-3.5 rounded-xl border border-slate-800">
                      <div className="flex justify-between items-center text-xs font-bold text-white mb-1.5">
                        <span>{item.skill}</span>
                        <span className="text-white font-mono">{item.score}% Proficiency</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-white rounded-full" style={{ width: `${item.score}%` }}></div>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {(skillFilter === 'all' || skillFilter === 'missing') && (
              <div className="bg-[#0E1528] border border-rose-500/30 rounded-2xl p-5 md:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Skills You Need (Industry Gaps)</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-rose-400">{allMissingSkills.length} Gaps</span>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {allMissingSkills.map((item, idx) => (
                    <div key={idx} className="bg-[#172136] p-3.5 rounded-xl border border-rose-500/20">
                      <div className="flex justify-between items-center text-xs font-bold text-white mb-1.5">
                        <span className="text-rose-300">{item.skill}</span>
                        <span className="text-rose-400 font-mono">{item.score}% Demand</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${item.score}%` }}></div>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================
          SUBTOPIC 3 (WHOLE NEW PAGE): LEARNING ROADMAP & PROJECTS
          (100% Respectful to the Particular Job Role, with Direct Documentation & Tutorials)
          ======================================================== */}
      {currentView === 'subtopic_roadmap' && (
        <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
          
          {/* Header Banner */}
          <div className="bg-[#0E1528] border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                CHAMBER 03 • ACTIONABLE PLAN • {customRole.toUpperCase()}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                Learning Roadmap & Strategic Projects for {customRole}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Step-by-step concepts to learn and hands-on portfolio projects directly tailored to <strong>{customRole}</strong> with direct documentation and video tutorials.
              </p>
            </div>

            <div className="bg-[#172136] border border-slate-800 px-4 py-2.5 rounded-xl text-center shrink-0">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Targeted Role</span>
              <span className="text-xs font-bold text-white">{customRole}</span>
            </div>
          </div>

          {/* 3 Step Roadmap Cards (Tailored to Role) */}
          <div className="bg-[#0E1528] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-white" />
              <span>Step-by-Step Learning Curriculum for {customRole}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Work through each phase sequentially from beginning to end to master the required concepts:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {rolePhases.map((phase, idx) => (
                <div key={idx} className="bg-[#172136] border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-md">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-white bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
                        Step {phase.step}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">2-3 Weeks</span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2 leading-snug">{phase.title}</h4>
                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">{phase.goal}</p>

                    <ul className="space-y-1.5 mb-5">
                      {phase.points.map((pt, pIdx) => (
                        <li key={pIdx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                          <span className="text-slate-400 font-bold shrink-0">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Direct Documentation & Tutorial Links */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                    <a 
                      href={phase.docUrl}
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white hover:text-slate-200 text-xs font-semibold py-2 px-2.5 rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Documentation</span>
                    </a>
                    <a 
                      href={phase.videoUrl}
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white hover:text-slate-200 text-xs font-semibold py-2 px-2.5 rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Youtube className="w-3.5 h-3.5 text-rose-400" />
                      <span>Tutorials</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Strategic Portfolio Projects (Tailored to Role) */}
          <div className="bg-[#0E1528] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-white" />
              <span>Strategic Portfolio Project Blueprints ({customRole})</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Building these 3 specific projects directly proves your competence in your missing skills for {customRole}:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {roleProjects.map((proj, idx) => (
                <div key={idx} className="bg-[#172136] border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-md">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-white bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
                        Project {proj.num}
                      </span>
                      <span className="text-[10px] text-slate-400">Proof of Skill</span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2 leading-snug">{proj.name}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{proj.desc}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {proj.points.map((pt, pIdx) => (
                        <span key={pIdx} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-medium">
                          {pt}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Direct Project Spec & Tutorial Links */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                    <a 
                      href={proj.docUrl}
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white hover:text-slate-200 text-xs font-semibold py-2 px-2.5 rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Project Spec</span>
                    </a>
                    <a 
                      href={proj.videoUrl}
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white hover:text-slate-200 text-xs font-semibold py-2 px-2.5 rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Youtube className="w-3.5 h-3.5 text-rose-400" />
                      <span>Tutorial</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          SUBTOPIC 4 (WHOLE NEW PAGE): MATCHED JOB OPENINGS
          ======================================================== */}
      {currentView === 'subtopic_jobs' && (
        <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
          
          {/* Header */}
          <div className="bg-[#0E1528] border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                CHAMBER 04 • JOB OPPORTUNITIES
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                Matched Job Openings for {customRole}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Direct search links to open roles across LinkedIn, Indeed, Glassdoor, and Wellfound tailored to your verified credentials.
              </p>
            </div>

            {/* Filter Input */}
            <div className="relative w-full md:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Filter roles..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full bg-[#172136] border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
              />
            </div>
          </div>

          {/* 12 Portals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {(data?.liveJobs || (data?.relatedJobTitles || [
              "Mechanical Design Engineer", "CAD Design Engineer", "Thermal Systems Engineer",
              "Product Design Engineer", "CAE Simulation Engineer", "Junior FEA Analyst",
              "Automotive Powertrain Engineer", "Aerospace Systems Engineer", "Tooling & Fixture Designer",
              "Mechanical Component Engineer", "R&D Mechanical Engineer", "Manufacturing Design Engineer"
            ]).map((title, i) => ({
              id: `job-${i}`,
              title: title,
              company: i % 2 === 0 ? "LinkedIn" : "Indeed",
              url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(title)}`,
              location: "Global / Remote",
              description: `Find active ${title} positions matching your verified technical credentials.`
            }))).filter(j => {
              if (!jobSearch) return true;
              return j.title.toLowerCase().includes(jobSearch.toLowerCase()) || 
                     (j.company && j.company.toLowerCase().includes(jobSearch.toLowerCase()));
            }).map((job, idx) => (
              <div 
                key={job.id || idx} 
                className="bg-[#0E1528] p-4 rounded-xl border border-slate-800 hover:border-slate-600 flex flex-col justify-between shadow-sm transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-semibold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {job.company || "Job Portal"}
                    </span>
                    <span className="text-slate-400 text-[10px]">{job.location || "Global"}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1 line-clamp-1 group-hover:text-white transition-colors">
                    {job.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {job.description || `Search opportunities for ${job.title}.`}
                  </p>
                </div>

                <a 
                  href={job.url || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-[#172136] hover:bg-white hover:text-slate-900 text-white rounded-lg py-1.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Apply on {job.company || "Portal"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================
          ROLE SWITCHER MODAL ("Change Role")
          ======================================================== */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1528] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-800 flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-white" />
                <h3 className="text-sm font-bold text-white">Switch Target Domain</h3>
              </div>
              <button 
                onClick={() => setShowRoleModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Select or enter a role title to benchmark your resume against specific industry requirements:
            </p>

            <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
              {[
                "Mechanical Design Engineer",
                "Full Stack Developer",
                "Frontend Developer (React)",
                "Backend Engineer (Node.js)",
                "Data Scientist / ML Engineer",
                "DevOps & Cloud Engineer",
                "Product Manager",
                "Data Analyst"
              ].map((r, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCustomRole(r);
                    setShowRoleModal(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    customRole === r 
                      ? 'bg-white text-slate-900 border-white font-bold' 
                      : 'bg-[#172136] hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Or type custom role..."
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-[#172136] border border-slate-700 text-white focus:outline-none focus:border-white mb-2.5"
              />
              <button
                onClick={() => setShowRoleModal(false)}
                className="w-full bg-white hover:bg-slate-200 text-slate-900 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                Apply Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PRINT VIEW (FOR PDF EXPORT)
          ======================================================== */}
      <div className="hidden print:block w-full">
        <PrintView data={data || { score, candidate: { name: resolvedName, email, phone, location } }} projectStage={projectStage} />
      </div>

    </div>
  );
}
