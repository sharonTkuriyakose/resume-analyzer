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
                    content: `You are an elite Recruitment AI. Your goal is to provide a high-fidelity analysis of the resume text.
                    
                    1. DOMAIN: Identify the exact professional title (e.g., "Full Stack Developer", "Data Scientist").
                    2. READINESS SCORE (0-100): 
                       - Scale this for a high-performing professional. 
                       - If the resume shows strong project work and core technical skills, the score should range between 80% and 100%. 
                       - 100% is reserved for profiles that perfectly match industry lead standards.
                    3. PROJECT LAB: For each missing skill, generate:
                       - 'projectTitle': A sophisticated, industry-standard project name.
                       - 'steps': An array of EXACTLY 3 unique, advanced execution points. 
                       - DO NOT use generic phrases like "Phase 1/2/3" or "Analyzing...". Provide technical instructions.
                    4. OUTPUT: Return valid JSON: { "score": number, "domain": string, "foundSkills": [], "missingSkills": [], "roadmap": [{ "skill": string, "task": string, "projectTitle": string, "steps": [] }] }`
                },
                {
                    role: "user",
                    content: `Analyze this resume. Ensure the Readiness Score reflects professional competency (80%-100% for strong profiles). Generate unique, high-level project titles and technical steps for the gaps.
                    
                    Resume Text: ${resumeText}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0].message.content);
        const safeRoadmap = analysis.roadmap || [];
        
        analysis.roadmap = safeRoadmap.map(item => ({
            ...item,
            skill: item.skill || "Technical Skill",
            task: item.task || "Professional implementation.",
            link: `https://google.com/search?q=official+documentation+for+${encodeURIComponent(item.skill)}`,
            youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.skill)}+tutorial`
        }));

        res.json(analysis);
    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ message: "Analysis failed", details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));