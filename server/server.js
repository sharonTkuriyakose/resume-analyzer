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
                    - Next, critically analyze the uploaded text to dynamically determine the candidate's actual Target Job Role based strictly on their skills and experience. Set 'domain' to this title. MUST BE a standard, highly-searchable industry job title (e.g., "DevOps Engineer", "Marketing Manager", "Financial Analyst", "Registered Nurse"). Maximum 3 words. Do NOT default to any specific role; it must be 100% accurate to the uploaded resume's content.
                    - Next, fill out '_domain_reasoning', explicitly stating why you chose this domain based on their core projects and skills.
                    - CRITICAL DOMAIN GUIDELINE: Do NOT hallucinate that the candidate belongs to an entirely different domain just because they used a single tool or API. Keep the Target Job Role grounded in their primary skillset. However, when identifying GAPS and building the CURRICULUM, you MUST include realistic, industry-standard requirements for whatever their specific role is. For example, if they are a Data Scientist, gaps might be MLOps; if they are a Marketing Manager, gaps might be CRM Automation or SEO Analytics; if they are a Financial Analyst, gaps might be Advanced Financial Modeling. You MUST dynamically generate a realistic, industry-standard assessment for THEIR specific domain, perfectly balancing their unique strengths with real-world industry expectations.
                    - 'scoringComponents': Generate rigorous, exact sub-scores (0-100) for five specific areas. CRITICAL: Base these scores STRICTLY on the provided text AND their relevance to the identified 'domain'. You MUST ignore or exclude any projects, skills, and experience that are unrelated to the respective domain.
                        1. "skills": Hard skills relevance and proficiency for the 'domain'. Start at 0, add 10 points for each relevant hard skill found (up to 100). Do not count unrelated skills.
                        2. "projects": Quality, complexity, and relevance of projects/portfolio to the 'domain'. Start at 0, add 25 points for each substantial, domain-relevant project (up to 100). Strictly IGNORE unrelated projects.
                        3. "experience": Relevance and impact of professional work experience to the 'domain'. Start at 0, add 25 points per year of relevant experience (up to 100). Do not count unrelated experience. (If no formal work experience exists, award partial points (e.g., 20-50) based on practical, domain-relevant project implementation).
                        4. "certifications": Value of degrees, certifications, and courses to the 'domain'. Start at 0, add 25 for a degree, 15 for each relevant cert (up to 100). Ignore unrelated certs.
                        5. "atsFormatting": Resume structure, readability, and ATS parsing compatibility.
                    - 'foundSkills': List AT LEAST 8-12 EXACT hard skills found in the text that are HIGHLY RELEVANT to the candidate's specific 'domain' job profile. Strictly ignore any skills that are unrelated to the target role. Provide an estimated proficiency 'score' (0-100) and a medium-length 'description' (2-3 sentences) explaining their proficiency based on the resume.
                    - 'missingSkills': Identify AT LEAST 8-12 critical missing hard skills that are realistically expected in the industry for their specific 'domain' job profile but are missing from their resume. Analyze their profile deeply to find true gaps. Provide an importance 'score' (0-100) and a medium-length 'description' (2-3 sentences) explaining why this specific skill is a critical gap.
                    - 'keywordsDetected': Extract AT LEAST 10-15 ATS-friendly keywords present. Provide a 'keyword' and a detailed, in-depth 'context' (2-3 sentences) explaining why it's valuable.
                    - 'keywordsMissing': List AT LEAST 10-15 essential ATS keywords they are missing. Provide a 'keyword' and a detailed, in-depth 'context' (2-3 sentences) on why it's a critical gap. MUST be highly specific to the 'domain'.
                    - 'relatedJobTitles': Provide EXACTLY 12 specific, distinct, real-world job titles closely related to the candidate's domain. Analyze the role and their skills externally to provide a broad range of related positions (e.g., if domain is "Backend Developer", output "Senior Backend Developer", "Java Backend Developer", "Backend Systems Engineer", "API Developer", etc.).
                    - 'phasedCurriculum': 3 stages designed to elevate them to industry readiness (e.g., Phase 1: Core Fundamentals, Phase 2: Advanced Tools/Cloud, Phase 3: Leadership/System Design). Focus heavily on the items in 'missingSkills'. For each phase, provide a simple 'title', a detailed 'primaryGoal' (2-3 sentences), and a 'points' array with AT LEAST 4-6 specific, actionable learning steps.
                    - 'projectList': EXACTLY 3 unique project/portfolio simulations. CRITICAL RULE: These projects MUST ONLY focus on their 'missingSkills' / skill gaps. DO NOT generate projects based on skills they already know. Provide a detailed 'desc' (2-3 sentences) and a 'points' array listing the specific NEW, missing technologies or methodologies they will learn by doing this project.
                    
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
                      "domain": "string",
                      "_domain_reasoning": "REQUIRED: Explain why you chose this specific domain, and explicitly vow to ignore all other domains for the rest of this JSON.",
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
                      "foundSkills": [
                        { "skill": "string", "score": 90, "description": "Detailed 2-3 sentence explanation..." }
                      ],
                      "missingSkills": [
                        { "skill": "string", "score": 95, "description": "Detailed 2-3 sentence explanation..." }
                      ],
                      "keywordsDetected": [
                        { "keyword": "string", "context": "Detailed explanation..." }
                      ],
                      "keywordsMissing": [
                        { "keyword": "string", "context": "Detailed explanation..." }
                      ],
                      "relatedJobTitles": [
                        "string", "string", "string", "string", "string", "string",
                        "string", "string", "string", "string", "string", "string"
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
                    content: `Analyze this document. If it is NOT a professional resume or CV, set 'isValidResume' to false. Also calculate the authenticity score: ${resumeText.substring(0, 12000)}`
                }
            ],
            model: "openai/gpt-oss-120b",
            response_format: { type: "json_object" },
            temperature: 0.0,
            max_tokens: 3500,
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

        // FALLBACK: Ensure critical arrays exist even if AI truncated response
        if (!analysis.phasedCurriculum) {
            analysis.phasedCurriculum = [
                { id: 1, title: "Core Foundations", primaryGoal: "Establish missing fundamental concepts.", points: ["Review core principles"] },
                { id: 2, title: "Advanced Implementations", primaryGoal: "Apply skills to complex problems.", points: ["Build standard implementations"] },
                { id: 3, title: "Industry Readiness", primaryGoal: "Prepare for production environments.", points: ["Learn best practices"] }
            ];
        }
        
        // Ensure Project Lab exists
        const hasProjectStage = analysis.phasedCurriculum.some(step => step.id === 4 || step.isProject);
        if (!hasProjectStage) {
            analysis.phasedCurriculum.push({
                id: 4,
                title: "STRATEGIC PROJECT LAB",
                isProject: true,
                projectList: analysis.projectList || [
                    { name: "Portfolio Accelerator", desc: "A complete end-to-end project to cover your skill gaps.", points: ["Setup environment", "Implement core features"] }
                ]
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
            const titles = analysis.relatedJobTitles && analysis.relatedJobTitles.length >= 12 
                           ? analysis.relatedJobTitles 
                           : Array(12).fill(d);
            
            const q = (title) => encodeURIComponent(title);
            const exactQ = (title) => encodeURIComponent(`"${title}"`);

            analysis.liveJobs = [
                {
                    id: 'p1', title: `${titles[0]} Jobs on LinkedIn`, company: 'LinkedIn',
                    url: `https://www.linkedin.com/jobs/search/?keywords=${exactQ(titles[0])}`,
                    type: 'Portal Search', location: 'Global', description: `Explore thousands of ${titles[0]} opportunities and connect with recruiters directly on LinkedIn.`
                },
                {
                    id: 'p2', title: `${titles[1]} Jobs on Indeed`, company: 'Indeed',
                    url: `https://www.indeed.com/jobs?q=${exactQ(titles[1])}`,
                    type: 'Portal Search', location: 'Global', description: `Browse aggregated job listings for ${titles[1]} roles from company career sites and job boards.`
                },
                {
                    id: 'p3', title: `${titles[2]} Jobs on Glassdoor`, company: 'Glassdoor',
                    url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${exactQ(titles[2])}`,
                    type: 'Portal Search', location: 'Global', description: `Find ${titles[2]} jobs and access company reviews, salaries, and interview insights.`
                },
                {
                    id: 'p4', title: `${titles[3]} Jobs on Wellfound`, company: 'Wellfound',
                    url: `https://wellfound.com/role/${q(titles[3]).toLowerCase().replace(/%20/g, '-')}`, // Note: Wellfound uses hyphens for roles in URL
                    type: 'Startup Search', location: 'Global', description: `Discover ${titles[3]} opportunities at top startups and tech companies.`
                },
                {
                    id: 'p5', title: `${titles[4]} Jobs on ZipRecruiter`, company: 'ZipRecruiter',
                    url: `https://www.ziprecruiter.com/candidate/search?search=${exactQ(titles[4])}`,
                    type: 'Portal Search', location: 'Global', description: `Apply to ${titles[4]} roles quickly with 1-Click Apply on ZipRecruiter.`
                },
                {
                    id: 'p6', title: `${titles[5]} Jobs on Monster`, company: 'Monster',
                    url: `https://www.monster.com/jobs/search/?q=${exactQ(titles[5])}`,
                    type: 'Portal Search', location: 'Global', description: `Search a vast database of ${titles[5]} jobs and get resume help.`
                },
                {
                    id: 'p7', title: `${titles[6]} Jobs on Dice`, company: 'Dice',
                    url: `https://www.dice.com/jobs?q=${exactQ(titles[6])}`,
                    type: 'Tech Search', location: 'Global', description: `The leading database for technology professionals and ${titles[6]} jobs.`
                },
                {
                    id: 'p8', title: `${titles[7]} Jobs on SimplyHired`, company: 'SimplyHired',
                    url: `https://www.simplyhired.com/search?q=${exactQ(titles[7])}`,
                    type: 'Portal Search', location: 'Global', description: `A robust job search engine for discovering local and remote ${titles[7]} positions.`
                },
                {
                    id: 'p9', title: `${titles[8]} Jobs on WeWorkRemotely`, company: 'WeWorkRemotely',
                    url: `https://weworkremotely.com/remote-jobs/search?term=${exactQ(titles[8])}`,
                    type: 'Remote Work', location: 'Global', description: `Find the best remote ${titles[8]} jobs from anywhere in the world.`
                },
                {
                    id: 'p10', title: `${titles[9]} Jobs on FlexJobs`, company: 'FlexJobs',
                    url: `https://www.flexjobs.com/search?search=${exactQ(titles[9])}`,
                    type: 'Remote/Flex Work', location: 'Global', description: `Discover hand-screened remote, part-time, freelance, and flexible ${titles[9]} jobs.`
                },
                {
                    id: 'p11', title: `${titles[10]} Jobs on Upwork`, company: 'Upwork',
                    url: `https://www.upwork.com/nx/jobs/search/?q=${exactQ(titles[10])}`,
                    type: 'Freelance', location: 'Global', description: `Explore freelance ${titles[10]} projects and short-term contracts.`
                },
                {
                    id: 'p12', title: `${titles[11]} Jobs on Remote.co`, company: 'Remote.co',
                    url: `https://remote.co/remote-jobs/search/?search_keywords=${exactQ(titles[11])}`,
                    type: 'Remote Work', location: 'Global', description: `Curated remote ${titles[11]} jobs from companies that embrace distributed work.`
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
app.listen(PORT, () => console.log(`🚀 Neural Lab Server listening on port ${PORT}`));