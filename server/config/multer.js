const multer = require('multer');

// Store file in memory buffer for easy parsing
const storage = multer.memoryStorage();
const upload = multer({ 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDFs are supported'), false);
  }
});

module.exports = upload;