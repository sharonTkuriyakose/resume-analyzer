require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse-fork'); 
const Groq = require("groq-sdk");

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const pdfData = await pdf(req.file.buffer);
        const resumeText = pdfData.text;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an elite Recruitment and Resume Validation AI. 
                    
                    STRICT VALIDATION RULE:
                    1. First, determine if the provided text is a professional Resume, CV, or Profile.
                    2. If the text is NOT a resume (e.g., it is a recipe, news, random text, or a blank document), you MUST return this exact JSON: { "error": "INVALID_RESUME", "message": "The uploaded file does not appear to be a valid professional resume. Please upload a CV/Resume." }
                    
                    ANALYSIS RULES (Only if valid):
                    - DOMAIN: Identify the exact professional title.
                    - READINESS SCORE: 80-100% for strong profiles.
                    - PROJECT LAB: For each gap, generate a unique 'projectTitle' and exactly 3 advanced technical 'steps'.
                    - OUTPUT: Return ONLY a valid JSON object: { "score": number, "domain": string, "foundSkills": [], "missingSkills": [], "roadmap": [{ "skill": string, "task": string, "projectTitle": string, "steps": [] }] }`
                },
                {
                    role: "user",
                    content: `Verify and analyze this text. If it is not a resume, trigger the INVALID_RESUME error. Otherwise, provide a high-fidelity professional analysis.
                    
                    Text to analyze: ${resumeText}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0].message.content);

        // ✅ 1. Check for AI-detected Validation Error
        if (analysis.error === "INVALID_RESUME") {
            return res.status(422).json({ 
                message: analysis.message,
                status: "error"
            });
        }

        // ✅ 2. Process valid roadmap items
        const safeRoadmap = analysis.roadmap || [];
        analysis.roadmap = safeRoadmap.map(item => ({
            ...item,
            skill: item.skill || "Technical Skill",
            task: item.task || "Professional implementation.",
            link: `https://google.com/search?q=official+documentation+for+${encodeURIComponent(item.skill || "Skill")}`,
            youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.skill || "Skill")}+tutorial`
        }));

        res.json(analysis);

    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ message: "Analysis failed", details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));