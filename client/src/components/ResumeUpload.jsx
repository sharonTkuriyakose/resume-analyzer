import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, FileText, Loader2, XCircle } from 'lucide-react';

const ResumeUpload = ({ onResult }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // ✅ DYNAMIC API URL CONFIGURATION
  // This detects your Vercel "VITE_API_URL" or falls back to localhost for your computer
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleAreaClick = () => {
    // Triggers the hidden file input
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
    e.stopPropagation(); // Prevent triggering the area click again
    if (!file) return;

    setLoading(true);
    setError(''); // Clear previous errors
    const formData = new FormData();
    formData.append('resume', file);

    try {
      // ✅ UPDATED: Now uses the dynamic API_URL variable instead of hardcoded localhost
      const response = await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onResult(response.data);
    } catch (err) {
      // ✅ UPDATED: Shows a more helpful error message on your mobile device
      setError(`Connection failed. Attempted to reach: ${API_URL}. Ensure your backend server is live.`);
      console.error("Connection error details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />

      {/* Selectable Area */}
      <div 
        onClick={handleAreaClick}
        className={`group relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer
          ${file 
            ? 'border-indigo-400 bg-indigo-50/30' 
            : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-slate-50'
          }`}
      >
        {file ? (
          <>
            <FileText className="w-12 h-12 text-indigo-600 mb-4 animate-in zoom-in" />
            <span className="text-slate-900 font-bold text-lg text-center break-all px-4">{file.name}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Remove file
            </button>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-slate-500 group-hover:text-indigo-300 transition-colors mb-4" />
            <span className="text-slate-700 font-semibold text-lg text-center">Click to select resume</span>
            <span className="text-slate-400 text-sm mt-1">PDF files only (Max 5MB)</span>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-xs font-semibold border border-red-100">
          <XCircle className="w-4 h-4 shrink-0" />
          <p className="flex-1">{error}</p>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full bg-white text-black font-bold py-4 rounded-xl shadow-lg shadow-slate-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            Analyzing Professional Gaps...
          </>
        ) : (
          'Run Skill Gap Analysis'
        )}
      </button>
    </div>
  );
};

export default ResumeUpload;