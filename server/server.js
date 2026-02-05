require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse-fork'); 
const Groq = require("groq-sdk");

const app = express();

// ✅ MODIFICATION 1: OPEN CORS POLICY
// This ensures that your phone can communicate with the server without being blocked
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// 🛠️ INITIALIZE GROQ
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    // ✅ MODIFICATION 2: INCOMING REQUEST LOGGING
    // Check your Render logs; if you don't see this text, the phone isn't reaching the server.
    console.log("📥 Received analysis request from:", req.headers['user-agent']);

    try {
        if (!req.file) {
            console.warn("⚠️ No file provided in request");
            return res.status(400).json({ message: "No file uploaded" });
        }

        // 1. EXTRACT TEXT
        const pdfData = await pdf(req.file.buffer);
        const resumeText = pdfData.text;

        // 2. ADVANCED AI PROMPTING
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a world-class Recruitment AI. Analyze the resume text provided.
                    1. IDENTIFY SPECIFIC JOB TITLE: Map the profile to a precise professional role.
                       - If skills include C++, Node, or React -> Use "Software Engineer".
                       - If skills include Patient Care or Medical terminology -> Use "Registered Nurse".
                       - If skills include Business or Management -> Use "Business Administrator".
                       - DO NOT use generic terms like "Technical", "Medical", or "Unclassified".
                    2. BENCHMARKING: Calculate an Industry Readiness score (0-100).
                    3. ROADMAP: Return an array of objects, each with a 'skill' and 'description' key.
                    4. OUTPUT: Always return a valid JSON object with exactly these keys: score, domain, foundSkills, missingSkills, roadmap.`
                },
                {
                    role: "user",
                    content: `Analyze this resume and provide a professional job title for the 'domain' field.
                    
                    Resume Text: ${resumeText}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        // 3. PARSE & PROCESS RESPONSE
        const analysis = JSON.parse(completion.choices[0].message.content);

        // 🛡️ 4. ROBUST MAPPING & LINK GENERATION
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

        analysis.domain = analysis.domain || "General Professional";
        analysis.score = analysis.score || 35;

        console.log(`✅ Success: Analyzed a ${analysis.domain} profile for sharonTkuriyakose.`);
        res.json(analysis);

    } catch (error) {
        // ✅ MODIFICATION 3: DETAILED ERROR LOGGING
        console.error("❌ Groq Analysis Error:", error.message);
        res.status(500).json({ 
            message: "The AI engine encountered an error.", 
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 AI Server active on port ${PORT}`);
    console.log(`📡 CORS set to allow all origins for mobile testing`);
});