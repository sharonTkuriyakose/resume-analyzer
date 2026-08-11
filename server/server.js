require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const Groq = require("groq-sdk");
const cluster = require('cluster');
const os = require('os');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'analysis_cache.json');
let analysisCache = {};
try {
  if (fs.existsSync(CACHE_FILE)) {
    analysisCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  }
} catch (e) {
  console.error("Cache load error:", e);
}

function saveCache() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(analysisCache));
  } catch (e) {
    console.error("Cache save error:", e);
  }
}

const numCPUs = os.cpus().length;

if (cluster.isPrimary || cluster.isMaster) {
  console.log(`[CLUSTER] Primary ${process.pid} is running. Forking ${numCPUs} workers...`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`[CLUSTER] Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork();
  });
} else {
  const app = express();

  // --- 1. MIDDLEWARE & SECURITY ---
  app.use(helmet());
  app.use(cors({ origin: '*' }));
  app.use(express.json());

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 20, 
    message: { message: "TOO MANY REQUESTS. Rate limit exceeded. Try again in 15 minutes." }
  });

  const storage = multer.memoryStorage();
  const upload = multer({
      storage: storage,
      limits: { fileSize: 5 * 1024 * 1024 }
  });

// --- 2. INITIALIZATION ---
const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey });

// --- 3. THE ANALYSIS ROUTE ---
app.post('/api/analyze', apiLimiter, upload.single('resume'), async (req, res) => {
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
            if (resumeText.length < 50) {
                return res.status(422).json({
                    message: "DOCUMENT CONTENT TOO SPARSE. Ensure your PDF contains actual text, not just flat images."
                });
            }
        } catch (pdfErr) {
            return res.status(400).json({ message: "ERROR READING PDF STRUCTURE." });
        }

        // Caching mechanism: if this exact text has been analyzed before, return the cached result.
        const textHash = crypto.createHash('md5').update(resumeText).digest('hex');
        if (analysisCache[textHash]) {
            console.log("⚡ Returning CACHED analysis for this exact resume.");
            return res.json(analysisCache[textHash]);
        }

        // B. AI CALL (Strict Validation + Strategic Analysis)
        console.log("🤖 Authenticating Document Structure...");
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a Strict ATS Authenticator and Career Architect. 
                    
                    STEP 1: VALIDATE DOCUMENT
                    - Be extremely forgiving. Treat any document that even loosely resembles a professional profile, portfolio, or CV as valid.
                    - Only set "isValidResume" to false if it is blatantly a non-resume (e.g., a cooking recipe, a novel, or a receipt).
                    - If "isValidResume" is true, proceed to Step 2.

                    STEP 2: EXPERT PANEL ANALYSIS (CHAIN OF THOUGHT)
                    - YOU MUST fill out the '_reasoning' field FIRST. Write a detailed paragraph analyzing the specific skills, experiences, and gaps you found in the text to ground your subsequent scores.
                    - CRITICAL: Ensure this analysis is strictly unique and tailored specifically to the text provided in the user prompt. Do not hallucinate or reuse previous analyses.
                    - Act as a panel of Senior Technical Recruiters and Hiring Managers. Analyze the candidate's core competencies to identify their exact Target Job Role. Set 'domain' to this title. MUST BE a standard, highly-searchable industry job title (e.g., "Backend Developer", "Data Scientist", "DevOps Engineer"). Maximum 3 words. No commas or special characters.
                    - 'scoringComponents': Generate rigorous, exact sub-scores (0-100) for five specific areas. CRITICAL: Base these scores STRICTLY on the provided text.
                        1. "skills": Hard skills relevance and proficiency. Start at 0, add 10 points for each relevant hard skill found (up to 100).
                        2. "projects": Quality, complexity, and relevance of projects/portfolio. Start at 0, add 25 points for each substantial project (up to 100).
                        3. "experience": Relevance and impact of professional work experience. Start at 0, add 25 points per year of relevant experience (up to 100). (If no formal work experience exists, award partial points (e.g., 20-50) based on practical project implementation).
                        4. "certifications": Value of degrees, certifications, and courses. Start at 0, add 25 for a degree, 15 for each relevant cert (up to 100).
                        5. "atsFormatting": Resume structure, readability, and ATS parsing compatibility.
                    - 'foundSkills': List EXACT hard skills found in the text. Provide an estimated proficiency 'score' (0-100).
                    - 'missingSkills': Identify critical missing hard skills for the 'domain' that were NOT found in the text. Provide an importance 'score' (0-100).
                    - 'keywordsDetected': Extract ATS-friendly keywords present. Provide a 'keyword' and a detailed 'context' explaining why it's valuable.
                    - 'keywordsMissing': List essential ATS keywords they are missing. Provide a 'keyword' and a detailed 'context' on why it's a critical gap.
                    - 'phasedCurriculum': 3 stages to bridge their specific gaps. For each phase, provide a simple, natural 'title' (e.g. "Cloud Computing Basics", "Containerization", without underscores or ALL CAPS) and a detailed 'primaryGoal' (2-3 sentences of expert advice).
                    - 'projectList': EXACTLY 3 unique project simulations STRICTLY designed to bridge the user's MISSING skills (deficiencies). Do NOT suggest projects based on their existing strengths. Use realistic, industry-standard project ideas with a detailed 'desc' (2-3 sentences outlining the architecture).
                    
                    STEP 3: DEEP AUTHENTICITY & PLAGIARISM CHECK
                    - Analyze the semantic structure and language patterns of the resume. 
                    - Detect if it relies heavily on AI-generated cliches, exaggerated claims, or generic templates.
                    - Assign an 'authenticity_score' (0-100) and provide an 'authenticity_reasoning'.

                    CRITICAL JSON SYNTAX RULE:
                    - You MUST ensure all JSON objects are closed with curly braces '}' and all JSON arrays are closed with brackets ']'.
                    - Never close an object using a bracket like this: {"key": "value"]. This is invalid JSON.

                    REQUIRED JSON STRUCTURE (STRICTLY FOLLOW THIS):
                    {
                      "_reasoning": "REQUIRED: Write a detailed 1-paragraph analysis of the resume here BEFORE generating the rest of the JSON. Ground your scores in the text.",
                      "isValidResume": boolean,
                      "authenticity_score": number,
                      "authenticity_reasoning": "string",
                      "scoringComponents": {
                         "skills": number,
                         "projects": number,
                         "experience": number,
                         "certifications": number,
                         "atsFormatting": number
                      },
                      "domain": "string",
                      "foundSkills": [
                        { "skill": "skill1", "score": 90 }
                      ],
                      "missingSkills": [
                        { "skill": "skill1", "score": 95 }
                      ],
                      "keywordsDetected": [
                        { "keyword": "string", "context": "Detailed explanation..." }
                      ],
                      "keywordsMissing": [
                        { "keyword": "string", "context": "Detailed explanation..." }
                      ],
                      "phasedCurriculum": [
                        { "id": 1, "title": "Topic 1 (e.g. Cloud Computing)", "primaryGoal": "Detailed expert advice...", "points": [] },
                        { "id": 2, "title": "Topic 2 (e.g. Containerization)", "primaryGoal": "Detailed expert advice...", "points": [] },
                        { "id": 3, "title": "Topic 3 (e.g. CI/CD Pipelines)", "primaryGoal": "Detailed expert advice...", "points": [] },
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
                    content: `Analyze this document. If it is NOT a professional resume or CV, set 'isValidResume' to false. Also calculate the authenticity score: ${resumeText.substring(0, 15000)}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.0,
            seed: 12345
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

        // D. DATA REFINEMENT & DEDUCTIVE SCORING
        const s = analysis.scoringComponents?.skills ?? 60;
        const p = analysis.scoringComponents?.projects ?? 50;
        const e = analysis.scoringComponents?.experience ?? 50;
        const c = analysis.scoringComponents?.certifications ?? 40;
        const a = analysis.scoringComponents?.atsFormatting ?? 70;

        // Deductive Scoring Formula: Score = 0.30S + 0.25P + 0.20E + 0.15C + 0.10A
        let rawScore = (0.30 * s) + (0.25 * p) + (0.20 * e) + (0.15 * c) + (0.10 * a);

        analysis.score = Math.max(5, Math.min(100, Math.round(rawScore)));

        // Ensure components are always passed back
        analysis.scoringComponents = {
            skills: s,
            projects: p,
            experience: e,
            certifications: c,
            atsFormatting: a
        };

        if (analysis.phasedCurriculum) {
            analysis.phasedCurriculum = analysis.phasedCurriculum.map(item => ({
                ...item,
                docLink: `https://google.com/search?q=${encodeURIComponent(item.title || "")}+learning+roadmap`,
                videoLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title || "")}+tutorial+2026`
            }));
        }

        // E. GENERATE JOB PORTAL SEARCH LINKS
        try {
            console.log(`🌐 Generating portal searches for domain: ${analysis.domain}...`);
            const d = analysis.domain || 'Professional';
            const q = encodeURIComponent(d);
            const exactQ = encodeURIComponent(`"${d}"`);

            analysis.liveJobs = [
                {
                    id: 'p1', title: `${d} Jobs on LinkedIn`, company: 'LinkedIn',
                    url: `https://www.linkedin.com/jobs/search/?keywords=${exactQ}`,
                    type: 'Portal Search', location: 'Global', description: `Explore thousands of ${d} opportunities and connect with recruiters directly on LinkedIn.`
                },
                {
                    id: 'p2', title: `${d} Jobs on Indeed`, company: 'Indeed',
                    url: `https://www.indeed.com/jobs?q=${exactQ}`,
                    type: 'Portal Search', location: 'Global', description: `Browse aggregated job listings for ${d} roles from company career sites and job boards.`
                },
                {
                    id: 'p3', title: `${d} Jobs on Glassdoor`, company: 'Glassdoor',
                    url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${exactQ}`,
                    type: 'Portal Search', location: 'Global', description: `Find ${d} jobs and access company reviews, salaries, and interview insights.`
                },
                {
                    id: 'p4', title: `${d} Jobs on Wellfound`, company: 'Wellfound',
                    url: `https://wellfound.com/role/${q.toLowerCase().replace(/%20/g, '-')}`, // Note: Wellfound uses hyphens for roles in URL
                    type: 'Startup Search', location: 'Global', description: `Discover ${d} opportunities at top startups and tech companies.`
                },
                {
                    id: 'p5', title: `${d} Jobs on ZipRecruiter`, company: 'ZipRecruiter',
                    url: `https://www.ziprecruiter.com/candidate/search?search=${exactQ}`,
                    type: 'Portal Search', location: 'Global', description: `Apply to ${d} roles quickly with 1-Click Apply on ZipRecruiter.`
                },
                {
                    id: 'p6', title: `${d} Jobs on Monster`, company: 'Monster',
                    url: `https://www.monster.com/jobs/search/?q=${exactQ}`,
                    type: 'Portal Search', location: 'Global', description: `Search a vast database of ${d} jobs and get resume help.`
                },
                {
                    id: 'p7', title: `${d} Jobs on Dice`, company: 'Dice',
                    url: `https://www.dice.com/jobs?q=${exactQ}`,
                    type: 'Tech Search', location: 'Global', description: `The leading database for technology professionals and ${d} jobs.`
                },
                {
                    id: 'p8', title: `${d} Jobs on SimplyHired`, company: 'SimplyHired',
                    url: `https://www.simplyhired.com/search?q=${exactQ}`,
                    type: 'Portal Search', location: 'Global', description: `A robust job search engine for discovering local and remote ${d} positions.`
                },
                {
                    id: 'p9', title: `${d} Jobs on WeWorkRemotely`, company: 'WeWorkRemotely',
                    url: `https://weworkremotely.com/remote-jobs/search?term=${exactQ}`,
                    type: 'Remote Work', location: 'Global', description: `Find the best remote ${d} jobs from anywhere in the world.`
                },
                {
                    id: 'p10', title: `${d} Jobs on FlexJobs`, company: 'FlexJobs',
                    url: `https://www.flexjobs.com/search?search=${exactQ}`,
                    type: 'Remote/Flex Work', location: 'Global', description: `Discover hand-screened remote, part-time, freelance, and flexible ${d} jobs.`
                },
                {
                    id: 'p11', title: `${d} Jobs on Upwork`, company: 'Upwork',
                    url: `https://www.upwork.com/nx/jobs/search/?q=${exactQ}`,
                    type: 'Freelance', location: 'Global', description: `Explore freelance ${d} projects and short-term contracts.`
                },
                {
                    id: 'p12', title: `${d} Jobs on Remote.co`, company: 'Remote.co',
                    url: `https://remote.co/remote-jobs/search/?search_keywords=${exactQ}`,
                    type: 'Remote Work', location: 'Global', description: `Curated remote ${d} jobs from companies that embrace distributed work.`
                }
            ];

            console.log(`✅ Generated ${analysis.liveJobs.length} job portal links.`);
        } catch (jobErr) {
            console.error("⚠️ Failed to generate job portals:", jobErr.message);
            analysis.liveJobs = [];
        }

        // Save to cache before returning
        analysisCache[textHash] = analysis;
        saveCache();

        res.json(analysis);
        console.log(`🚀 Strategic Scan Delivered. Domain: ${analysis.domain} | Score: ${analysis.score}%`);

    } catch (error) {
        console.error("🔥 SERVER ERROR:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Neural Lab Worker ${process.pid} listening on port ${PORT}`));
}