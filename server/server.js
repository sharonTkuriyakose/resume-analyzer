require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse-fork'); 
const Groq = require("groq-sdk");

const app = express();

// ✅ 1. MIDDLEWARE: Ensure JSON and CORS are handled first
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * 1. PRIMARY ANALYSIS ENDPOINT
 */
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
                    STRICT VALIDATION RULE: If the text is NOT a resume, return: { "error": "INVALID_RESUME", "message": "Please upload a valid CV/Resume." }
                    ANALYSIS RULES: Identify domain, score, foundSkills, missingSkills, and a roadmap. 
                    OUTPUT: Return valid JSON.`
                },
                { role: "user", content: `Analyze: ${resumeText}` }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0].message.content);
        if (analysis.error === "INVALID_RESUME") return res.status(422).json({ message: analysis.message, status: "error" });

        // ✅ CRITICAL: This allows the interview route to work
        analysis.originalText = resumeText;

        const safeRoadmap = analysis.roadmap || [];
        analysis.roadmap = safeRoadmap.map(item => ({
            ...item,
            skill: item.skill || "Technical Skill",
            link: `https://google.com/search?q=official+documentation+for+${encodeURIComponent(item.skill || "Skill")}`,
            youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.skill || "Skill")}+tutorial`
        }));

        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: "Analysis failed", details: error.message });
    }
});

/**
 * 2. DIGITAL TWIN: GENERATE QUESTIONS
 */
app.post('/api/generate-interview', async (req, res) => {
    const { resumeText, domain } = req.body;
    if (!resumeText) return res.status(400).json({ message: "No resume context found." });

    try {
        const completion = await groq.chat.completions.create({
            messages: [{
                role: "system",
                content: `You are a Senior Technical Interviewer. Analyze ONLY this resume: "${resumeText}".
                Generate 5 unique interview questions (2 technical, 1 problem-solving for ${domain}, 2 behavioral).
                RETURN ONLY JSON: { "questions": ["Q1", "Q2", "Q3", "Q4", "Q5"] }`
            }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        res.json(JSON.parse(completion.choices[0].message.content));
    } catch (err) {
        res.status(500).json({ message: "Failed to generate questions", error: err.message });
    }
});

/**
 * 3. DIGITAL TWIN: EVALUATE PERFORMANCE
 */
app.post('/api/evaluate-interview', async (req, res) => {
    const { questions, answers, resumeText } = req.body;
    try {
        const completion = await groq.chat.completions.create({
            messages: [{
                role: "system",
                content: `You are an Interview Evaluator. Candidate Resume: "${resumeText}".
                Evaluate these answers: ${JSON.stringify(answers)}
                Against these questions: ${JSON.stringify(questions)}
                RETURN ONLY JSON: { "clarityScore": number, "confidenceScore": number, "summary": "string" }`
            }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        res.json(JSON.parse(completion.choices[0].message.content));
    } catch (err) {
        res.status(500).json({ message: "Evaluation failed", error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 AI Career Engine active on port ${PORT}`));