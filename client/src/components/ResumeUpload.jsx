const handleUpload = async (e) => {
  e.stopPropagation(); 
  if (!file) return;

  setLoading(true);
  const formData = new FormData();
  formData.append('resume', file);

  // ✅ THIS IS THE FIX: 
  // It looks for the Vercel variable first. If empty, it uses localhost.
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  try {
    const response = await axios.post(`${API_URL}/api/analyze`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    onResult(response.data);
  } catch (err) {
    // This error will now tell you exactly which URL it tried to reach
    setError(`Connection failed. Attempted to reach: ${API_URL}`);
    console.error("Connection error:", err);
  } finally {
    setLoading(false);
  }
};