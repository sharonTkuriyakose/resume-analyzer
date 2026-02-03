const pdf = require('pdf-parse');

const parseResume = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text; // Returns raw string of resume content
  } catch (error) {
    throw new Error('Failed to parse PDF');
  }
};

module.exports = { parseResume };