const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { parseResume } = require('../services/resumeParser');
const { analyzeSkills } = require('../services/skillAnalyzer');
const { calculateReadiness } = require('../services/readinessCalculator');
const { getRoadmap } = require('../services/roadmapService');

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File missing" });

    const text = await parseResume(req.file.buffer);
    const { foundSkills, missingSkills } = analyzeSkills(text);
    const score = calculateReadiness(foundSkills, missingSkills);
    const roadmap = getRoadmap(missingSkills);

    res.json({ score, foundSkills, missingSkills, roadmap });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;