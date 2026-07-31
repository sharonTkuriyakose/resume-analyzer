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

                    STEP 2: STRATEGIC ANALYSIS
                    - Identify the user's specific Job Role or Target Domain from their experience/summary.
                    - 'domain': The specific professional domain or job title detected.
                    - 'missingSkills' and 'keywordsMissing': IMPORTANT: MUST be strictly relevant to the identified Job Role based on current industry standards. Do NOT provide irrelevant or generic gaps.
                    - 'score': Dynamic integer based on skill density vs. gaps (Base 85).
                    - 'phasedCurriculum': 3 stages built ONLY to bridge the 'keywordsMissing'.
                    - 'projectList': EXACTLY 3 unique project simulations targeting missing skills.
                    
                    REQUIRED JSON STRUCTURE:
                    {
                      "isValidResume": boolean,
                      "score": number,
                      "domain": "string",
                      "foundSkills": [],
                      "missingSkills": [],
                      "keywordsDetected": [],
                      "keywordsMissing": [],
                      "phasedCurriculum": [
                        { "id": 1, "title": "LEARN_[GAP]", "primaryGoal": "string", "points": [] },
                        { "id": 2, "title": "MASTER_[GAP]", "primaryGoal": "string", "points": [] },
                        { "id": 3, "title": "IMPLEMENT_[GAP]", "primaryGoal": "string", "points": [] },
                        { 
                          "id": 4, "title": "STRATEGIC PROJECT LAB", "isProject": true, 
                          "projectList": [
                            { "name": "Proj 1", "desc": "string", "points": ["p1", "p2", "p3"] },
                            { "name": "Proj 2", "desc": "string", "points": ["p1", "p2", "p3"] },
                            { "name": "Proj 3", "desc": "string", "points": ["p1", "p2", "p3"] }
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

        // E. FETCH LIVE JOB RECOMMENDATIONS (South India focus via JSearch)
        try {
            console.log(`🌐 Fetching live jobs for domain: ${analysis.domain} in South India...`);
            const query = `${analysis.domain} in Bangalore, Chennai, Hyderabad, India`;
            const jobSearchUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&date_posted=week`;
            
            const jobRes = await fetch(jobSearchUrl, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
                }
            });
            
            if (jobRes.ok) {
                const jobData = await jobRes.json();
                analysis.liveJobs = (jobData.data?.jobs || []).slice(0, 6).map(j => ({
                    id: j.job_id,
                    title: j.job_title,
                    company: j.employer_name,
                    url: j.job_apply_link || j.job_google_link,
                    type: j.job_employment_type ? j.job_employment_type.toLowerCase().replace('_', ' ') : "full time",
                    location: [j.job_city, j.job_state].filter(Boolean).join(', ') || j.job_country || "South India",
                    description: j.job_description ? j.job_description.substring(0, 150) + '...' : 'No description provided.'
                }));
                console.log(`✅ Fetched ${analysis.liveJobs.length} live jobs from JSearch.`);
            } else {
                console.error("⚠️ JSearch API Error:", jobRes.status, await jobRes.text());
                analysis.liveJobs = [];
            }
        } catch (jobErr) {
            console.error("⚠️ Failed to fetch live jobs via JSearch:", jobErr.message);
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