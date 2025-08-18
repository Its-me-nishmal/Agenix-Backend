const Agent = require('../models/Agent');
const Session = require('../models/Session');
const Message = require('../models/Message');

// @desc    Get all agents
// @route   GET /admin/agents
// @access  Public
exports.getAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find();
    res.status(200).json({ success: true, data: agents });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all sessions for an agent
// @route   GET /admin/sessions/:agentId
// @access  Public
exports.getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ agent: req.params.agentId });
    res.status(200).json({ success: true, data: sessions });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get a session's chat history
// @route   GET /admin/session/:sessionId
// @access  Public
exports.getSessionHistory = async (req, res, next) => {
  try {
    const messages = await Message.find({ session: req.params.sessionId }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};