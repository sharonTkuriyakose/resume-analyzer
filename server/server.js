require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const Groq = require("groq-sdk");

const app = express();

// --- 1. MIDDLEWARE ---
app.use(cors({ origin: '*' }));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } 
});

// --- 2. INITIALIZATION ---
const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey });

// --- 3. THE ANALYSIS ROUTE ---
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        console.log(`--- Processing: ${req.file.originalname} ---`);

        // A. PDF EXTRACTION
        let resumeText = "";
        try {
            const pdfData = await pdf(req.file.buffer);
            resumeText = pdfData.text
                .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
                .replace(/\s+/g, ' ')
                .trim();
            
            // Hard gate: Instant rejection for extremely short/empty files
            if (resumeText.length < 150) {
                return res.status(422).json({ 
                    message: "DOCUMENT CONTENT TOO SPARSE. Please upload a valid professional resume." 
                });
            }
        } catch (pdfErr) {
            return res.status(400).json({ message: "ERROR READING PDF STRUCTURE." });
        }

        // B. AI CALL (Strict Validation + Strategic Analysis)
        console.log("🤖 Authenticating Document Structure...");
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `You are a Strict ATS Authenticator and Career Architect. 
                    
                    STEP 1: VALIDATE DOCUMENT
                    - Scan text for: Contact Details, Work History, Education, and Skills.
                    - If the text is a textbook, article, receipt, or random notes, set "isValidResume" to false.
                    - ONLY if "isValidResume" is true, proceed to Step 2.

                    STEP 2: EXPERT PANEL ANALYSIS
                    - Act as a panel of Senior Technical Recruiters and Hiring Managers. Analyze the candidate's core competencies to identify their exact Target Job Role. Set 'domain' to this title.
                    - 'score': Generate a rigorous "Market Readiness Score" (0-100) based on how well their current resume matches the strict industry requirements for their target role. Be honest and critical.
                    - 'foundSkills': List EXACT hard skills found. Provide an estimated proficiency 'score' (0-100).
                    - 'missingSkills': Identify critical missing hard skills for the 'domain'. Provide an importance 'score' (0-100).
                    - 'keywordsDetected': Extract ATS-friendly keywords present. Provide a 'keyword' and a detailed 'context' explaining why it's valuable.
                    - 'keywordsMissing': List essential ATS keywords they are missing. Provide a 'keyword' and a detailed 'context' on why it's a critical gap.
                    - 'phasedCurriculum': 3 stages to bridge their specific gaps. For each phase, provide a detailed 'primaryGoal' (2-3 sentences of expert advice).
                    - 'projectList': EXACTLY 3 unique project simulations STRICTLY designed to bridge the user's MISSING skills (deficiencies). Do NOT suggest projects based on their existing strengths. Use realistic, industry-standard project ideas with a detailed 'desc' (2-3 sentences outlining the architecture).
                    
                    REQUIRED JSON STRUCTURE (STRICTLY FOLLOW THIS):
                    {
                      "isValidResume": boolean,
                      "score": number,
                      "domain": "string",
                      "foundSkills": [{"skill": "skill1", "score": 90}],
                      "missingSkills": [{"skill": "skill1", "score": 95}],
                      "keywordsDetected": [{"keyword": "string", "context": "Detailed explanation..."}],
                      "keywordsMissing": [{"keyword": "string", "context": "Detailed explanation..."}],
                      "phasedCurriculum": [
                        { "id": 1, "title": "LEARN_[GAP]", "primaryGoal": "Detailed expert advice...", "points": [] },
                        { "id": 2, "title": "MASTER_[GAP]", "primaryGoal": "Detailed expert advice...", "points": [] },
                        { "id": 3, "title": "IMPLEMENT_[GAP]", "primaryGoal": "Detailed expert advice...", "points": [] },
                        { 
                          "id": 4, "title": "STRATEGIC PROJECT LAB", "isProject": true, 
                          "projectList": [
                            { "name": "Proj 1", "desc": "Detailed architecture overview...", "points": ["p1", "p2", "p3"] },
                            { "name": "Proj 2", "desc": "Detailed architecture overview...", "points": ["p1", "p2", "p3"] },
                            { "name": "Proj 3", "desc": "Detailed architecture overview...", "points": ["p1", "p2", "p3"] }
                          ] 
                        }
                      ]
                    }` 
                },
                { 
                    role: "user", 
                    content: `Analyze this document. If it is NOT a professional resume or CV, set 'isValidResume' to false: ${resumeText.substring(0, 7000)}` 
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.5 
        });

        // C. SAFE PARSING & AUTHENTICATION CHECK
        let analysis;
        try {
            analysis = JSON.parse(completion.choices[0].message.content);
        } catch (e) {
            return res.status(500).json({ message: "Neural Link Formatting Error" });
        }

        // REJECTION LOGIC: Stop if document is not a resume
        if (analysis.isValidResume === false) {
            console.log("🚫 Authentication Failed: Invalid Document Type.");
            return res.status(422).json({ 
                message: "INVALID DOCUMENT DETECTED. The system only accepts professional Resumes or CVs." 
            });
        }

        // D. DATA REFINEMENT
        analysis.score = parseInt(analysis.score) || 65;
        analysis.score = Math.max(5, Math.min(100, analysis.score));

        if (analysis.phasedCurriculum) {
            analysis.phasedCurriculum = analysis.phasedCurriculum.map(item => ({
                ...item,
                docLink: `https://google.com/search?q=${encodeURIComponent(item.title || "")}+learning+roadmap`,
                videoLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title || "")}+tutorial+2026`
            }));
        }

        // E. FETCH LIVE JOB RECOMMENDATIONS (Switched to Remotive API)
        try {
            console.log(`🌐 Fetching live jobs for domain: ${analysis.domain}...`);
            const jobRes = await fetch(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(analysis.domain || 'developer')}&limit=10`);
            
            let jobsArr = [];
            if (jobRes.ok) {
                const jobData = await jobRes.json();
                const rawJobs = jobData.jobs || [];
                
                // Filter jobs to ensure they are actually relevant to the domain
                const domainLower = (analysis.domain || 'developer').toLowerCase();
                const domainKeywords = domainLower.split(' ').filter(kw => kw.length > 2);
                
                jobsArr = rawJobs.filter(j => {
                    const titleLower = j.title.toLowerCase();
                    return domainKeywords.some(kw => titleLower.includes(kw)) || titleLower.includes(domainLower);
                });
            }
            
            if (jobsArr.length >= 6) {
                analysis.liveJobs = jobsArr.slice(0, 6).map(j => ({
                    id: j.id,
                    title: j.title,
                    company: j.company_name,
                    url: j.url,
                    type: j.job_type ? j.job_type.toLowerCase().replace('_', ' ') : "full time",
                    location: j.candidate_required_location || "Remote",
                    description: j.description ? j.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : 'No description provided.'
                }));
            } else {
                console.log("⚠️ Not enough live jobs found, generating dynamic smart fallbacks across portals.");
                const d = analysis.domain || 'Software Engineer';
                const q = encodeURIComponent(d);
                
                analysis.liveJobs = [
                    {
                        id: 'm1', title: `Senior ${d}`, company: 'Tech Corp (via LinkedIn)',
                        url: `https://www.linkedin.com/jobs/search/?keywords=${q}`,
                        type: 'full time', location: 'Remote', description: 'Looking for an experienced professional to lead key product initiatives and drive engineering excellence.'
                    },
                    {
                        id: 'm2', title: `${d} Role`, company: 'Startup Inc (via Indeed)',
                        url: `https://www.indeed.com/jobs?q=${q}`,
                        type: 'contract', location: 'Remote / Hybrid', description: 'Join our fast-paced environment to build scalable systems from the ground up.'
                    },
                    {
                        id: 'm3', title: `Lead ${d}`, company: 'Enterprise Solutions (via Glassdoor)',
                        url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${q}`,
                        type: 'full time', location: 'Multiple Locations', description: 'Drive architectural decisions and mentor junior engineers in a rapidly growing enterprise.'
                    },
                    {
                        id: 'm4', title: `${d} - Series A Startup`, company: 'InnovateAI (via Wellfound)',
                        url: `https://wellfound.com/jobs?search=${q}`,
                        type: 'full time', location: 'Remote', description: 'We are looking for a passionate builder to join our core team and help scale our MVP.'
                    },
                    {
                        id: 'm5', title: `Staff ${d}`, company: 'Global Tech (via Monster)',
                        url: `https://www.monster.com/jobs/search/?q=${q}`,
                        type: 'contract', location: 'Remote', description: 'Strategic technical leadership position focused on cross-functional system architecture.'
                    },
                    {
                        id: 'm6', title: `Mid-level ${d}`, company: 'Growth Agency (via ZipRecruiter)',
                        url: `https://www.ziprecruiter.com/candidate/search?search=${q}`,
                        type: 'full time', location: 'Hybrid', description: 'Excellent opportunity for growth, working alongside seasoned veterans on exciting client projects.'
                    }
                ];
            }
            console.log(`✅ Fetched/Mocked ${analysis.liveJobs.length} live jobs.`);
        } catch (jobErr) {
            console.error("⚠️ Failed to fetch live jobs:", jobErr.message);
            // Fallback is handled above, but if fetch throws completely, we can just assign empty and let UI handle it, 
            // or assign the same fallback. Let's just assign empty for critical failure.
            analysis.liveJobs = [];
        }

        res.json(analysis);
        console.log(`🚀 Strategic Scan Delivered. Domain: ${analysis.domain} | Score: ${analysis.score}%`);

    } catch (error) {
        console.error("🔥 SERVER ERROR:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Neural Lab Server: http://localhost:${PORT}`));