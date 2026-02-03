🚀 AI Resume Analyzer & Career Strategist
An Intelligent MERN Stack Dashboard for Automated Skill-Gap Analysis.

This project is a high-performance career intelligence tool that transforms raw PDF resumes into actionable data. By utilizing Groq’s Llama 3.3 70B model, the platform benchmarks candidates against 2026 industry standards in milliseconds to provide a comprehensive professional evaluation.

✨ Key Features
Neural PDF Extraction: Utilizes pdf-parse-fork to convert unstructured resume data into high-fidelity text for deep analysis.

AI Benchmarking: Generates a 0-100 "Industry Readiness" score based on global domain standards and modern competency maps.

Skill Matrix Analysis: Automatically categorizes "Validated Expertise" vs. "Requirement Gaps" to visualize career progress.

Strategic Upskilling Roadmap: Delivers a personalized learning path with direct links to documentation and targeted YouTube resources.

Immersive Onyx UI: A premium, full-bleed dark-themed dashboard built with React and Tailwind CSS featuring glassmorphism effects.

🛠️ Technical Stack
Frontend: React.js, Tailwind CSS, Lucide-React.

Backend: Node.js, Express.js.

AI Engine: Groq SDK (Llama 3.3 70B - Versatile).

File Handling: Multer for secure PDF ingestion and temporary processing.

Security: dotenv for environment variable masking to protect sensitive API credentials.

⚙️ Installation & Setup
1. Clone the Repository
Bash
git clone https://github.com/sharonTkuriyakose/resume-analyzer.git
cd resume-analyzer
2. Backend Setup
Navigate to the server directory, install dependencies, and configure the environment:

Bash
cd server
npm install
# Create a .env file and add:
# GROQ_API_KEY=your_key_here
# PORT=5000
npm start
3. Frontend Setup
Navigate to the client directory and launch the development server:

Bash
cd ../client
npm install
npm run dev
🧠 How It Works
Ingestion: The user uploads a PDF via the immersive drop-zone.

Extraction: The Node.js server parses the PDF and prepares a structured payload.

Analysis: The Groq Engine benchmarks the text against industry-specific "Must-Have" skill maps.

Action: The system generates a roadmap with dynamic search queries and YouTube tutorial links.

Visualization: The React frontend renders the data into an animated, high-contrast dashboard.

👤 Author
Sharon T Kuriyakose Full-Stack Developer & MERN Enthusiast.