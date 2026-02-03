🚀 AI Resume Analyzer & Career Strategist
An Intelligent MERN Stack Dashboard for Automated Skill-Gap Analysis.

This project is a high-performance career intelligence tool that transforms raw PDF resumes into actionable data. By utilizing Groq’s Llama 3.3 70B model, the platform benchmarks candidates against 2026 industry standards in milliseconds.

✨ Key Features
Neural PDF Extraction: Converts unstructured resume data into high-fidelity text for analysis.

AI Benchmarking: Generates a 0-100 "Industry Readiness" score based on global domain standards.

Competency Grid: Automatically categorizes "Mastered Skills" vs. "Requirement Gaps".

Strategic Roadmap: Provides a one-click learning path with integrated documentation and YouTube resources.

Onyx Glassmorphism UI: A premium, full-bleed dark-themed dashboard built with React and Tailwind CSS.

🛠️ Technical Stack
Frontend: React.js, Tailwind CSS, Lucide-React.

Backend: Node.js, Express.js.

Intelligence Engine: Groq SDK (Llama 3.3 70B - Versatile).

Processing: Multer (File Handling) and PDF-Parse-Fork (Extraction).

Security: Dotenv for environment variable masking and .gitignore for API protection.

⚙️ Installation & Setup
1. Clone & Install
Bash
git clone https://github.com/YOUR_USERNAME/resume-analyzer.git
cd resume-analyzer
npm install
cd client && npm install
cd ../server && npm install
2. Environment Configuration
Create a .env file in the /server directory to keep your keys secure:

Plaintext
GROQ_API_KEY=your_secret_key_here
PORT=5000
3. Launch System
Bash
# Start the Backend (from /server)
npm start

# Start the Frontend (from /client)
npm run dev
👤 Author
Sharon T Kuriyakose Full-Stack Developer & MERN Enthusiast.