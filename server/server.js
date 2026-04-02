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
            return res.status(400).json({ message: "No file uploaded or file is empty." });
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
            
            if (resumeText.length < 20) throw new Error("Unreadable content");
        } catch (pdfErr) {
            return res.status(400).json({ message: "ERROR READING PDF FILE STRUCTURE." });
        }

        // B. AI CALL (Strict Professional Response Logic)
        console.log("🤖 Generating High-Impact Industry Response...");
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `You are a Senior Career Strategist. Analyze the resume and return ONLY a JSON object.
                    
                    STRICT RESPONSE RULES:
                    1. 'domain': MUST be the specific job title detected (e.g., 'Registered Nurse', 'Full Stack Developer').
                    2. 'phasedCurriculum' (Stages 1-3): 
                       - EVERY STAGE TITLE must be a professional industry name (e.g., 'Scalable Infrastructure' or 'Clinical Informatics'). 
                       - DO NOT use titles like 'UPGRADE_STAGE' or 'Stage 1'.
                       - Base these stages ONLY on the 'keywordsMissing' (The Strategy Gaps).
                    3. 'Stage 4' (The Final Phase):
                       - DO NOT name it 'Capstone Projects' or 'Strategic Projects'.
                       - Name it an 'Advanced [Domain] Integration' title.
                    4. 'projectList': Generate 3 unique projects. Each MUST have exactly 3 strategic points that use the MISSING skills.
                    
                    REQUIRED JSON STRUCTURE:
                    {
                      "score": number,
                      "domain": "string",
                      "foundSkills": [],
                      "missingSkills": [],
                      "keywordsDetected": [],
                      "keywordsMissing": [],
                      "phasedCurriculum": [
                        { "id": 1, "title": "PROFESSIONAL_INDUSTRY_TITLE", "primaryGoal": "string", "points": ["p1", "p2", "p3"] },
                        { "id": 2, "title": "PROFESSIONAL_INDUSTRY_TITLE", "primaryGoal": "string", "points": ["p1", "p2", "p3"] },
                        { "id": 3, "title": "PROFESSIONAL_INDUSTRY_TITLE", "primaryGoal": "string", "points": ["p1", "p2", "p3"] },
                        { 
                          "id": 4, 
                          "title": "ADVANCED_DOMAIN_MASTERY_TITLE", 
                          "primaryGoal": "string",
                          "isProject": true, 
                          "projectList": [
                            { "name": "string", "desc": "string", "points": ["step1", "step2", "step3"] }
                          ] 
                        }
                      ]
                    }` 
                },
                { 
                    role: "user", 
                    content: `Analyze this resume. Ignore all generic templates. Create a professional learning path and project list that uses ONLY high-level industry titles to fill the user's Strategy Gaps: ${resumeText.substring(0, 6000)}` 
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.5
        });

        // C. SAFE PARSING
        let analysis;
        try {
            analysis = JSON.parse(completion.choices[0].message.content);
        } catch (e) {
            return res.status(500).json({ message: "AI Formatting Error" });
        }

        // D. DATA REFINEMENT
        let rawScore = parseInt(analysis.score) || 75;
        analysis.score = Math.max(75, Math.min(100, rawScore));

        if (analysis.phasedCurriculum) {
            analysis.phasedCurriculum = analysis.phasedCurriculum.map(item => ({
                ...item,
                docLink: `https://google.com/search?q=${encodeURIComponent(item.title || "")}+training+path`,
                videoLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title || "")}+tutorial+2026`
            }));
        }

        res.json(analysis);
        console.log(`🚀 Strategic Analysis Delivered for ${analysis.domain}`);

    } catch (error) {
        console.error("🔥 GLOBAL ERROR:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Neural Lab Server: http://localhost:${PORT}`));