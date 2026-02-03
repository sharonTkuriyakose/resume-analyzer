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
const groq = new Groq({ apiKey: process.env.GROQ_API_KEYi });

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        // 1. EXTRACT TEXT
        const pdfData = await pdf(req.file.buffer);
        const resumeText = pdfData.text;

        // 2. STRICTOR AI INSTRUCTIONS
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional recruitment engine. You MUST return a valid JSON object with EXACTLY these keys: score, domain, foundSkills, missingSkills, roadmap."
                },
                {
                    role: "user",
                    content: `Analyze this resume text and benchmark it against global industry standards.
                              The 'roadmap' key MUST be an array of objects.
                              
                              Resume Text: ${resumeText}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" } // Forces JSON structure
        });

        // 3. PARSE RESPONSE
        const analysis = JSON.parse(completion.choices[0].message.content);

        // 🛡️ 4. DEFENSIVE CODING (The Fix)
        // If 'roadmap' is missing, it uses an empty array [] so .map() won't crash.
        const safeRoadmap = analysis.roadmap || [];

        analysis.roadmap = safeRoadmap.map(item => ({
            ...item,
            // Ensure skill exists before encoding
            link: `https://google.com/search?q=official+documentation+for+${encodeURIComponent(item.skill || 'skill')}`,
            youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.skill || 'skill')}+tutorial`
        }));

        console.log(`✅ Success: Analyzed a ${analysis.domain || 'Unknown'} profile.`);
        res.json(analysis);

    } catch (error) {
        console.error("Groq Analysis Error:", error.message);
        res.status(500).json({ 
            message: "The AI engine encountered an error.", 
            details: error.message 
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Groq AI Server active on http://localhost:${PORT}`));