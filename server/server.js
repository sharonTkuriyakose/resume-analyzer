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
            console.log(`✅ Extraction successful: ${resumeText.length} chars found.`);
        } catch (pdfErr) {
            console.error("❌ PDF Parse Failure:", pdfErr.message);
            return res.status(400).json({ message: "ERROR READING PDF FILE STRUCTURE." });
        }

        // B. AI CALL (Dynamic Project Generation + Score Logic)
        console.log("🤖 Consulting AI Strategist...");
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `You are a Career Strategist. Analyze the resume and return ONLY a JSON object.
                    
                    RULES:
                    1. 'score': Must be an integer between 75 and 100 based on resume quality.
                    2. 'projects': Provide 3 high-level 'Project Simulations' tailored to the specific domain of the resume.
                    3. 'points': Each project MUST have exactly 3 professional, strategic bullet points.
                    
                    REQUIRED JSON STRUCTURE:
                    {
                      "score": number,
                      "domain": "string",
                      "foundSkills": [],
                      "missingSkills": [],
                      "projects": [
                        { "title": "string", "target": "string", "points": ["point1", "point2", "point3"] }
                      ],
                      "roadmap": [{"skill": "string", "reason": "string"}]
                    }` 
                },
                { 
                    role: "user", 
                    content: `Analyze this resume and provide a tailored career lab: ${resumeText.substring(0, 6000)}` 
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.3
        });

        // C. SAFE PARSING
        let analysis;
        try {
            analysis = JSON.parse(completion.choices[0].message.content);
        } catch (e) {
            return res.status(500).json({ message: "AI Formatting Error" });
        }

        // D. DATA REFINEMENT
        // 1. Force Score Range (75-100)
        let rawScore = parseInt(analysis.score) || 75;
        analysis.score = Math.max(75, Math.min(100, rawScore));

        // 2. Roadmap Link Enrichment
        const rawRoadmap = analysis.roadmap || [];
        analysis.roadmap = rawRoadmap.map(item => ({
            ...item,
            link: `https://google.com/search?q=${encodeURIComponent(item.skill || "")}+documentation`,
            youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.skill || "")}+tutorial`
        }));

        res.json(analysis);
        console.log(`🚀 Analysis Delivered. Score: ${analysis.score}%`);

    } catch (error) {
        console.error("🔥 GLOBAL ERROR:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Neural Lab Server: http://localhost:${PORT}`));