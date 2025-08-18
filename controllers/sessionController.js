const Session = require('../models/Session');
const Message = require('../models/Message');
const Agent = require('../models/Agent');
const { generateContent } = require('../services/geminiService');
const { summarizeConversation } = require('../services/summarizationService');

// @desc    Create a session
// @route   POST /sessions/:agentId
// @access  Public
exports.createSession = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.agentId);
    if (!agent) {
      return res.status(404).json({ success: false, error: 'Agent not found' });
    }

    const session = await Session.create({
      agent: req.params.agentId,
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create a message
// @route   POST /sessions/:sessionId/messages
// @access  Public
exports.createMessage = async (req, res, next) => {
  try {
    const { role, content } = req.body;

    const session = await Session.findById(req.params.sessionId).populate('agent');
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    await Message.create({
      session: req.params.sessionId,
      role,
      content,
    });

    const messages = await Message.find({ session: req.params.sessionId }).sort({ createdAt: 1 });

    const history = messages.map((msg) => ({
      role: msg.role,
      parts: msg.content,
    }));

    const prompt = `${session.agent.systemPrompt}\n\n${session.summary}\n\n${history.map(h => `${h.role}: ${h.parts}`).join('\n')}`;

    const assistantResponse = await generateContent(prompt);

    const assistantMessage = await Message.create({
      session: req.params.sessionId,
      role: 'assistant',
      content: assistantResponse,
    });

    res.status(201).json({
      success: true,
      data: assistantMessage,
    });

    // Summarize conversation if needed
    summarizeConversation(req.params.sessionId);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};