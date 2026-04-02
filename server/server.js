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
            
            if (resumeText.length < 20) throw new Error("Unreadable content");
        } catch (pdfErr) {
            return res.status(400).json({ message: "ERROR READING PDF." });
        }

        // B. AI CALL (Deductive Scoring Logic)
        console.log("🤖 Performing Deductive ATS Scoring...");
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `You are a Strict ATS (Applicant Tracking System) Scanner. 
                    
                    DEDUCTIVE SCORING SYSTEM:
                    1. Start with a base score of 100.
                    2. Deduct 5-10 points for every "keywordsMissing" (Strategy Gaps) found relative to the industry.
                    3. Deduct 10 points if there are no quantifiable metrics (e.g., percentages, dollar amounts).
                    4. Deduct 5 points if the resume is too short or lacks a clear summary.
                    5. The 'score' MUST be the final result of these subtractions.
                    
                    STRICT RULES:
                    - 'domain': The exact detected profession.
                    - 'phasedCurriculum': 3 stages targeting the Strategy Gaps (Missing Skills).
                    - Stage 4: 3 projects using Missing Skills with 3 points each.
                    - DO NOT use 75, 82, or any static numbers. Every resume must have a unique score based on its flaws.
                    
                    REQUIRED JSON STRUCTURE:
                    {
                      "score": number,
                      "domain": "string",
                      "foundSkills": [],
                      "missingSkills": [],
                      "keywordsDetected": [],
                      "keywordsMissing": [],
                      "phasedCurriculum": [
                        { "id": 1, "title": "string", "primaryGoal": "string", "points": ["p1", "p2", "p3"] },
                        { "id": 2, "title": "string", "primaryGoal": "string", "points": ["p1", "p2", "p3"] },
                        { "id": 3, "title": "string", "primaryGoal": "string", "points": ["p1", "p2", "p3"] },
                        { 
                          "id": 4, 
                          "title": "ADVANCED DOMAIN PROJECTS", 
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
                    content: `Scan this resume for flaws and missing industry keywords. Apply the Deductive Scoring System to provide a unique, harsh, and honest market readiness score: ${resumeText.substring(0, 6000)}` 
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            // TEMPERATURE AT 0.8: This ensures the model is creative and varied with numbers.
            temperature: 0.8 
        });

        // C. SAFE PARSING
        let analysis;
        try {
            analysis = JSON.parse(completion.choices[0].message.content);
        } catch (e) {
            return res.status(500).json({ message: "AI Formatting Error" });
        }

        // D. DATA REFINEMENT
        analysis.score = parseInt(analysis.score);
        if (isNaN(analysis.score)) analysis.score = 50; 
        analysis.score = Math.max(0, Math.min(100, analysis.score));

        if (analysis.phasedCurriculum) {
            analysis.phasedCurriculum = analysis.phasedCurriculum.map(item => ({
                ...item,
                docLink: `https://google.com/search?q=${encodeURIComponent(item.title || "")}+learning+path`,
                videoLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title || "")}+tutorial+2026`
            }));
        }

        res.json(analysis);
        console.log(`🚀 Strategic Scan Delivered for ${analysis.domain} | Score: ${analysis.score}%`);

    } catch (error) {
        console.error("🔥 SERVER ERROR:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Neural Lab Server: http://localhost:${PORT}`));