require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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
const geminiApiKey = process.env.GEMINI_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;

const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

if (genAI) {
    console.log("✨ Google Gemini AI Provider initialized as Primary Engine.");
} else if (groq) {
    console.log("⚡ Groq AI Provider initialized.");
} else {
    console.warn("⚠️ No AI provider API key found in .env (GEMINI_API_KEY or GROQ_API_KEY).");
}

function extractCandidateDetails(resumeText, aiCandidate, reasoning) {
    const details = {
        name: (aiCandidate?.name && !aiCandidate.name.toLowerCase().includes('candidate') && !aiCandidate.name.toLowerCase().includes('string') && aiCandidate.name !== 'Not specified') ? aiCandidate.name.trim() : '',
        email: (aiCandidate?.email && aiCandidate.email !== 'Not specified' && !aiCandidate.email.includes('example.com') && !aiCandidate.email.includes('string')) ? aiCandidate.email.trim() : '',
        phone: (aiCandidate?.phone && aiCandidate.phone !== 'Not specified' && !aiCandidate.phone.includes('555') && !aiCandidate.phone.includes('string')) ? aiCandidate.phone.trim() : '',
        location: (aiCandidate?.location && aiCandidate.location !== 'Not specified' && !aiCandidate.location.includes('string')) ? aiCandidate.location.trim() : '',
        education: (aiCandidate?.education && aiCandidate.education !== 'Not specified' && !aiCandidate.education.includes('string')) ? aiCandidate.education.trim() : '',
        summary: (aiCandidate?.summary && aiCandidate.summary !== 'Not specified' && !aiCandidate.summary.includes('string')) ? aiCandidate.summary.trim() : ''
    };

    // 1. Email extraction from resume text
    if (!details.email) {
        const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) details.email = emailMatch[0].trim();
    }

    // 2. Phone extraction from resume text (handles international, Indian, US, etc.)
    if (!details.phone) {
        const phoneMatch = resumeText.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}/);
        if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 10) {
            details.phone = phoneMatch[0].trim();
        }
    }

    // 3. Name extraction
    if (!details.name) {
        // First check reasoning sentence if it mentions the person by name: e.g. "Sharon T Kuriyakose demonstrates..."
        if (reasoning) {
            const nameFromReasoning = reasoning.match(/^([A-Z][a-zA-Z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-zA-Z]+)/);
            if (nameFromReasoning && !nameFromReasoning[1].toLowerCase().includes('the candidate') && !nameFromReasoning[1].toLowerCase().includes('this resume')) {
                details.name = nameFromReasoning[1].trim();
            }
        }

        // If still not found, check top lines of resumeText
        if (!details.name) {
            const lines = resumeText.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length > 2 && l.length < 40);
            const candidateLine = lines.find(l => 
                !l.includes('@') && 
                !l.includes('http') && 
                !l.includes('github') && 
                !l.includes('linkedin') && 
                !/\d/.test(l) && 
                !/resume|curriculum|profile|developer|engineer|summary|skills|experience|education/i.test(l)
            );
            if (candidateLine) {
                details.name = candidateLine;
            }
        }
    }

    // 4. Education extraction
    if (!details.education) {
        const eduMatch = resumeText.match(/\b(B\.?Tech|B\.?E\.?|B\.?S\.?|B\.?Sc|M\.?Tech|M\.?S\.?|M\.?C\.?A\.?|Bachelor|Master)[\w\s,.-]{0,35}/i);
        if (eduMatch) {
            details.education = eduMatch[0].trim();
        }
    }

    // 5. Location extraction
    if (!details.location) {
        const locMatch = resumeText.match(/\b([A-Z][a-zA-Z]+,\s*[A-Z][a-zA-Z]+(?:\s*,\s*[A-Z][a-zA-Z]+)?)\b/);
        if (locMatch && !/React|Node|Express|Mongo|Java|Python|JavaScript|HTML|CSS|GitHub/i.test(locMatch[1])) {
            details.location = locMatch[1].trim();
        }
    }

    // Fallbacks if not provided in resume
    if (!details.name) details.name = "Candidate Profile";
    if (!details.email) details.email = "Not listed";
    if (!details.phone) details.phone = "Not listed";
    if (!details.location) details.location = "Not listed";
    if (!details.education) details.education = "Technical Degree";

    return details;
}

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
        const textHash = crypto.createHash('md5').update('gemini_v3_' + resumeText).digest('hex');
        if (analysisCache[textHash]) {
            console.log("⚡ Returning CACHED analysis for this exact resume.");
            return res.json(analysisCache[textHash]);
        }

        // B. AI CALL (Strict Validation + Strategic Analysis)
        const systemPrompt = `You are a Strict ATS Authenticator and Career Architect. 
        
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
          "candidate": {
            "name": "string (Candidate full name from the resume)",
            "email": "string (Candidate email or 'Not specified')",
            "phone": "string (Candidate phone number or 'Not specified')",
            "location": "string (Candidate city/region or 'Not specified')",
            "education": "string (Candidate highest degree and institution, e.g. 'B.Tech IT')",
            "summary": "string (Crisp 1-2 sentence professional background summary)"
          },
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
        }`;

        let analysisText = "";
        let usedProvider = "";

        if (genAI) {
            console.log("🤖 Authenticating Document with Google Gemini...");
            const modelsToTry = ["gemini-flash-latest", "gemini-3.8-flash"];
            let lastGeminiError = null;

            for (const modelName of modelsToTry) {
                try {
                    const geminiModel = genAI.getGenerativeModel({
                        model: modelName,
                        generationConfig: {
                            responseMimeType: "application/json",
                            temperature: 0.1
                        },
                        systemInstruction: systemPrompt
                    });

                    const userMessage = `Analyze this document. If it is NOT a professional resume or CV, set 'isValidResume' to false. Also calculate the authenticity score: ${resumeText.substring(0, 30000)}`;
                    const result = await geminiModel.generateContent(userMessage);
                    analysisText = result.response.text();
                    usedProvider = `Google Gemini (${modelName})`;
                    console.log(`✅ ${usedProvider} successfully generated analysis.`);
                    break;
                } catch (gemErr) {
                    console.warn(`⚠️ Gemini model ${modelName} failed:`, gemErr.message);
                    lastGeminiError = gemErr;
                }
            }

            if (!analysisText && !groq) {
                throw new Error(`Google Gemini analysis failed: ${lastGeminiError?.message}`);
            }
        }

        // Secondary fallback to Groq if Gemini wasn't available or failed
        if (!analysisText && groq) {
            console.log("⚡ Falling back to Groq AI...");
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Analyze this document. If it is NOT a professional resume or CV, set 'isValidResume' to false. Also calculate the authenticity score: ${resumeText.substring(0, 15000)}` }
                ],
                model: "llama-3.3-70b-versatile",
                response_format: { type: "json_object" },
                temperature: 0.0
            });
            analysisText = completion.choices[0].message.content;
            usedProvider = "Groq (llama-3.3-70b-versatile)";
            console.log(`✅ ${usedProvider} successfully generated analysis.`);
        }

        if (!analysisText) {
            throw new Error("No AI provider was able to process the resume.");
        }

        // C. SAFE PARSING & AUTHENTICATION CHECK
        let analysis;
        try {
            analysis = JSON.parse(analysisText);
        } catch (e) {
            console.error("JSON parse failure on AI response:", analysisText);
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
        analysis.candidate = extractCandidateDetails(resumeText, analysis.candidate, analysis._reasoning);

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