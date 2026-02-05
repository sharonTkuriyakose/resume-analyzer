require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse-fork'); 
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// 🛠️ INITIALIZE GROQ
// ✅ FIXED: Removed the extra 'i' from process.env.GROQ_API_KEY
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        // 1. EXTRACT TEXT
        const pdfData = await pdf(req.file.buffer);
        const resumeText = pdfData.text;

        // 2. STRENGTHENED AI PROMPT
        // This ensures even simple resumes (like Alexander's) get a fair score and domain.
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a world-class Recruitment AI. Analyze the resume text provided.
                    1. Identify the professional domain. If it's not technical, use "General Professional" or "Entry Level".
                    2. Calculate an Industry Readiness score (0-100). Even basic skills should earn a baseline score of 30-40.
                    3. The 'roadmap' MUST be an array of objects, each with a 'skill' and 'description' key.
                    4. ALWAYS return a valid JSON object with these exact keys: score, domain, foundSkills, missingSkills, roadmap.`
                },
                {
                    role: "user",
                    content: `Analyze this resume and provide a detailed benchmark.
                    
                    Resume Text: ${resumeText}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        // 3. PARSE & PROCESS RESPONSE
        const analysis = JSON.parse(completion.choices[0].message.content);

        // 🛡️ 4. ROBUST MAPPING
        // Ensures the UI doesn't crash if the AI returns null for any field
        const safeRoadmap = analysis.roadmap || [];
        
        analysis.roadmap = safeRoadmap.map(item => {
            const skillName = item.skill || "Professional Development";
            return {
                ...item,
                skill: skillName,
                link: `https://google.com/search?q=official+documentation+for+${encodeURIComponent(skillName)}`,
                youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName)}+tutorial`
            };
        });

        // Final safety checks for UI display
        analysis.domain = analysis.domain || "General Professional";
        analysis.score = analysis.score || 35;

        console.log(`✅ Success: Analyzed a ${analysis.domain} profile for sharonTkuriyakose project.`);
        res.json(analysis);

    } catch (error) {
        console.error("Groq Analysis Error:", error.message);
        res.status(500).json({ 
            message: "The AI engine encountered an error.", 
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 AI Server active on port ${PORT}`));