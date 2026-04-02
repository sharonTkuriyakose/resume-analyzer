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
            
            if (resumeText.length < 150) {
                return res.status(422).json({ message: "Document content is too sparse to be a valid resume." });
            }
        } catch (pdfErr) {
            return res.status(400).json({ message: "ERROR READING PDF STRUCTURE." });
        }

        // B. AI CALL (Mandatory 3-Project Lab + Skill Mapping)
        console.log("🤖 Generating Triple-Project Strategic Lab...");
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: `You are a Senior Career Architect. 
                    
                    STEP 1: VALIDATE DOCUMENT
                    Check if text contains Resume markers (Contact, Experience, Education). If not, set "isValidResume" to false.

                    STEP 2: REALISTIC SCORING ALGORITHM
                    - Start with Base Score: 85.
                    - Add/Deduct based on Found vs. Missing Skills. Use a unique integer.

                    STEP 3: MANDATORY 3-PROJECT LAB
                    - IDENTIFY "keywordsMissing" (Strategy Gaps). 
                    - 'projectList' (Stage 4): You MUST provide EXACTLY 3 unique project simulations. 
                    - Each of the 3 projects MUST target different subsets of the 'keywordsMissing'.
                    - FORBIDDEN: Do not repeat the same project title. Do not use skills from 'foundSkills'.
                    - Each project MUST have exactly 3 strategic 'points'.
                    
                    STEP 4: CURRICULUM
                    - 'phasedCurriculum' (Stages 1-3): Titled specifically after missing skills.
                    
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
                        { "id": 1, "title": "LEARN_[GAP_SKILL]", "primaryGoal": "string", "points": ["p1", "p2", "p3"] },
                        { "id": 2, "title": "MASTER_[GAP_SKILL]", "primaryGoal": "string", "points": ["p1", "p2", "p3"] },
                        { "id": 3, "title": "IMPLEMENT_[GAP_SKILL]", "primaryGoal": "string", "points": ["p1", "p2", "p3"] },
                        { 
                          "id": 4, "title": "STRATEGIC PROJECT LAB", "isProject": true, 
                          "projectList": [
                            { "name": "Project 1", "desc": "string", "points": ["p1", "p2", "p3"] },
                            { "name": "Project 2", "desc": "string", "points": ["p1", "p2", "p3"] },
                            { "name": "Project 3", "desc": "string", "points": ["p1", "p2", "p3"] }
                          ] 
                        }
                      ]
                    }` 
                },
                { 
                    role: "user", 
                    content: `Analyze this resume. Bridge Strategy Gaps in the roadmap and generate EXACTLY 3 diverse project simulations in the 'projectList' targeting the missing skills: ${resumeText.substring(0, 7000)}` 
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.7 
        });

        // C. SAFE PARSING
        let analysis;
        try {
            analysis = JSON.parse(completion.choices[0].message.content);
        } catch (e) {
            return res.status(500).json({ message: "Neural Link Formatting Error" });
        }

        if (analysis.isValidResume === false) {
            return res.status(422).json({ message: "INVALID DOCUMENT. Please upload a Resume." });
        }

        // D. DATA REFINEMENT
        analysis.score = parseInt(analysis.score) || 65;
        analysis.score = Math.max(5, Math.min(100, analysis.score));

        // Ensure we always have links for the curriculum
        if (analysis.phasedCurriculum) {
            analysis.phasedCurriculum = analysis.phasedCurriculum.map(item => ({
                ...item,
                docLink: `https://google.com/search?q=${encodeURIComponent(item.title || "")}+learning+roadmap`,
                videoLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title || "")}+tutorial+2026`
            }));
        }

        res.json(analysis);
        console.log(`🚀 Analysis Delivered. Projects Generated: ${analysis.phasedCurriculum[3]?.projectList?.length || 0}`);

    } catch (error) {
        console.error("🔥 SERVER ERROR:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Neural Lab Server: http://localhost:${PORT}`));