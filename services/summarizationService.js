const Message = require('../models/Message');
const Session = require('../models/Session');
const { generateContent } = require('./geminiService');

const summarizeConversation = async (sessionId) => {
  try {
    const messages = await Message.find({ session: sessionId }).sort({ createdAt: 1 });
    const conversation = messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n');

    const prompt = `Summarize the following conversation:\n\n${conversation}`;
    const summary = await generateContent(prompt);

    await Session.findByIdAndUpdate(sessionId, { summary });
  } catch (error) {
    console.error('Error summarizing conversation:', error);
  }
};

module.exports = { summarizeConversation };