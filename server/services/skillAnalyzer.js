const analyzeSkills = (resumeText, targetRoleSkills) => {
  const text = resumeText.toLowerCase();
  
  const foundSkills = targetRoleSkills.filter(skill => 
    text.includes(skill.toLowerCase())
  );

  const missingSkills = targetRoleSkills.filter(skill => 
    !text.includes(skill.toLowerCase())
  );

  return { foundSkills, missingSkills };
};

module.exports = { analyzeSkills };