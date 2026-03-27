import React, { useState } from 'react';
import { Mic, Send, MessageSquare, ShieldCheck, Loader2, Award } from 'lucide-react';
import axios from 'axios';

const MockInterview = ({ data, apiUrl }) => {
  const [step, setStep] = useState(0); // 0 = start, 1-5 = questions, 6 = feedback
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // ✅ Step 1: Generate 5 personalized questions from your AI
  const startInterview = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`${apiUrl}/api/generate-interview`, {
        resumeText: data.originalText,
        domain: data.domain
      });
      setQuestions(response.data.questions);
      setStep(1);
    } catch (err) {
      console.error("Interview initialization failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ Step 2: Submit Answer & Move Forward
  const nextQuestion = () => {
    setAnswers([...answers, currentAnswer]);
    setCurrentAnswer('');
    if (step < 5) setStep(step + 1);
    else finishInterview();
  };

  // ✅ Step 3: Get Final Feedback (Confidence & Clarity Score)
  const finishInterview = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`${apiUrl}/api/evaluate-interview`, {
        questions,
        answers: [...answers, currentAnswer],
        resumeText: data.originalText
      });
      setFeedback(response.data);
      setStep(6);
    } catch (err) {
      console.error("Evaluation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-10 md:p-14 rounded-[3rem] bg-white/[0.02] border border-white/10 card-bg text-center">
      {step === 0 && (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20">
            <ShieldCheck className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-black uppercase italic">Digital Twin Interviewer</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
            The AI has analyzed your resume. It is ready to challenge you with 5 deep-dive questions specific to your domain and projects.
          </p>
          <button onClick={startInterview} disabled={isGenerating} className="px-12 py-4 bg-indigo-600 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-indigo-500 transition-all">
            {isGenerating ? <Loader2 className="animate-spin inline mr-2" /> : "Initiate Session"}
          </button>
        </div>
      )}

      {step >= 1 && step <= 5 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center px-4">
             <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Question {step} of 5</span>
             <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 transition-all" style={{width: `${step*20}%`}}></div></div>
          </div>
          <h4 className="text-xl font-black text-white uppercase leading-tight italic">"{questions[step-1]}"</h4>
          <textarea 
            className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-[12px] font-bold text-slate-300 min-h-[150px] outline-none focus:border-indigo-500 transition-all"
            placeholder="Type your answer here (Explain clearly as you would in a real interview)..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
          />
          <button onClick={nextQuestion} className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-widest">
            {step === 5 ? "Submit Final Answer" : "Next Question"}
          </button>
        </div>
      )}

      {step === 6 && feedback && (
        <div className="space-y-10 animate-in zoom-in-95 duration-500">
           <div className="grid grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                 <span className="text-[9px] font-black text-indigo-400 uppercase block mb-2">Clarity Score</span>
                 <div className="text-5xl font-black italic">{feedback.clarityScore}%</div>
              </div>
              <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                 <span className="text-[9px] font-black text-emerald-400 uppercase block mb-2">Confidence Level</span>
                 <div className="text-5xl font-black italic">{feedback.confidenceScore}%</div>
              </div>
           </div>
           <div className="text-left p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4">
              <span className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 tracking-widest">
                <Award className="w-4 h-4 text-amber-500" /> Strategic Feedback
              </span>
              <p className="text-[11px] font-bold text-slate-300 uppercase leading-relaxed italic">{feedback.summary}</p>
           </div>
           <button onClick={() => setStep(0)} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">← Start New Session</button>
        </div>
      )}
    </div>
  );
};

export default MockInterview;