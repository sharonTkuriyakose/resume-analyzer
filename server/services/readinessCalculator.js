const calculateReadiness = (foundSkills, missingSkills) => {
  const totalSkills = foundSkills.length + missingSkills.length;
  
  // Prevent division by zero if no skills are defined for a role
  if (totalSkills === 0) return 0;

  const score = (foundSkills.length / totalSkills) * 100;
  return Math.round(score);
};

module.exports = { calculateReadiness };