const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6,
  process.env.GEMINI_API_KEY_7,
  process.env.GEMINI_API_KEY_8,
  process.env.GEMINI_API_KEY_9,
  process.env.GEMINI_API_KEY_10,
].filter(Boolean);

let currentKeyIndex = 0;

const getGenerativeModel = () => {
  const apiKey = apiKeys[currentKeyIndex];
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
};

const generateContent = async (prompt) => {
  let retries = apiKeys.length;
  while (retries > 0) {
    try {
      const model = getGenerativeModel();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error(`Error with API key ${currentKeyIndex + 1}:`, error);
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      retries--;
      if (retries === 0) {
        throw new Error('All API keys failed.');
      }
    }
  }
};

module.exports = { generateContent };