import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, FileText, Loader2, XCircle } from 'lucide-react';

// ✅ Added apiUrl to the props to receive the link from UploadPage
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
      // ✅ UPDATED: Now strictly uses the apiUrl passed from the parent UploadPage
      // This ensures consistency across your entire MERN stack
      const response = await axios.post(`${apiUrl}/api/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onResult(response.data);
    } catch (err) {
      // ✅ UPDATED: Detailed error reporting for mobile debugging
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