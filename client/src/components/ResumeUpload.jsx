import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, FileText, Loader2, XCircle, CheckCircle2 } from 'lucide-react';

const ResumeUpload = ({ onResult, apiUrl }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleUpload = async (e) => {
    e.stopPropagation(); 
    if (!file) return;

    setLoading(true);
    setError(''); 

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(`${apiUrl}/api/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onResult(response.data);
    } catch (err) {
      setError(`Connection failed. Target: ${apiUrl}. Check if your Render backend is active.`);
      console.error("Connection error details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />

      {/* DRAG & DROP AREA - Monochrome Slate & White */}
      <div 
        onClick={handleAreaClick}
        className={`group relative border-2 border-dashed rounded-3xl p-10 md:p-14 flex flex-col items-center justify-center transition-all cursor-pointer
          ${file 
            ? 'border-white bg-white/5' 
            : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
          }`}
      >
        {file ? (
          <>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
               <FileText className="w-8 h-8 text-white animate-in zoom-in" />
            </div>
            <span className="text-white font-black text-lg text-center break-all px-4 tracking-tight uppercase">{file.name}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="mt-4 text-[10px] text-slate-500 hover:text-white font-black uppercase tracking-widest transition-colors"
            >
              Remove file
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <Upload className="w-8 h-8 text-slate-500 group-hover:text-white transition-colors" />
            </div>
            <span className="text-white font-black text-lg text-center uppercase tracking-tight">Select Resume</span>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">PDF Only • Max 5MB</span>
          </>
        )}
      </div>

      {/* ERROR MESSAGE - Refined White/Red */}
      {error && (
        <div className="flex items-center gap-3 text-red-400 bg-red-500/10 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/20">
          <XCircle className="w-4 h-4 shrink-0" />
          <p className="flex-1 leading-relaxed">{error}</p>
        </div>
      )}

      {/* ANALYZE BUTTON - Pure White on Dark */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full bg-white text-black font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-30 uppercase tracking-[0.2em] text-xs"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            Neural Scanning Active...
          </>
        ) : (
          <>
            Run Skill Gap Analysis
          </>
        )}
      </button>

      {/* SYSTEM TRUST BADGE */}
      <div className="flex items-center justify-center gap-2 text-slate-600">
          <CheckCircle2 className="w-3 h-3" />
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Cloud Processing</span>
      </div>
    </div>
  );
};

export default ResumeUpload;