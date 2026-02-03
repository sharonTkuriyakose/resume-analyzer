const getRoadmap = (missingSkills) => {
  return missingSkills.map(skill => ({
    skill: skill,
    resource: `https://www.youtube.com/results?search_query=learning+${skill}+tutorial`,
    platform: "YouTube"
  }));
};

module.exports = { getRoadmap };