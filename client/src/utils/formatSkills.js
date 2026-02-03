export const formatSkillName = (skill) => {
  if (!skill) return "";
  // Simple logic to capitalize names or handle special cases
  const map = {
    "mongodb": "MongoDB",
    "nodejs": "Node.js",
    "javascript": "JavaScript",
    "react": "React"
  };
  return map[skill.toLowerCase()] || skill.charAt(0).toUpperCase() + skill.slice(1);
};