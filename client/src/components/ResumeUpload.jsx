import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, Loader2, XCircle, FileText, CheckCircle2 } from 'lucide-react';

const ResumeUpload = ({ onResult, apiUrl }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleAreaClick = () => {
    if (!file) fileInputRef.current.click();
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        if (selectedFile.size > 5 * 1024 * 1024) {
          setError('File is too large (Max 5MB).');
          setFile(null);
        } else {
          setFile(selectedFile);
          setError('');
        }
      } else {
        setError('Please upload a valid PDF file.');
        setFile(null);
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
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
      const response = await axios.post(`${apiUrl}/api/analyze`, formData);
      onResult(response.data);
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      const serverDetails = err.response?.data?.details;
      
      if (serverMessage) {
        setError(`${serverMessage}${serverDetails ? `: ${serverDetails}` : ''}`);
      } else if (err.code === 'ECONNABORTED') {
        setError("Request timed out. The AI is taking too long.");
      } else {
        setError("Neural Link Interrupted. Check connection.");
      }
      console.error("Analysis error details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />

      <div 
        onClick={handleAreaClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col md:flex-row items-center justify-center gap-4 px-12 py-10 rounded-[2rem] cursor-pointer transition-all duration-300 shadow-2xl border-2 border-dashed
          ${dragActive ? 'bg-[#222] border-[#60a5fa] scale-105' : 'bg-[#0f172a]/50 border-white/10 hover:bg-[#1e293b]/50 hover:border-[#3b82f6]/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]'}
        `}
      >
        {!file ? (
          <>
            <Upload className={`w-8 h-8 ${dragActive ? 'text-[#60a5fa]' : 'text-[#3b82f6]'}`} />
            <span className="text-white text-lg font-bold tracking-wide">
              {dragActive ? "Drop Resume Here" : "Upload Resume"}
            </span>
          </>
        ) : (
          <div className="flex items-center gap-3 w-full justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#888]" />
              <span className="text-white text-sm font-bold truncate max-w-[150px]">
                {file.name}
              </span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="text-[#888] hover:text-white text-xs font-bold px-3 py-1 bg-white/5 rounded-md"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 px-10 py-3 bg-white text-black hover:bg-slate-200 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Scanning...
            </>
          ) : (
            <>Run Deep Scan</>
          )}
        </button>
      )}

      {error && (
        <div className="mt-6 flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-red-500/20">
          <XCircle className="w-4 h-4" />
          <p>{error}</p>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-2 text-[#555]">
          <CheckCircle2 className="w-3 h-3 text-[#555]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.3em]">
            Encrypted Verification
          </span>
      </div>
    </div>
  );
};

export default ResumeUpload;