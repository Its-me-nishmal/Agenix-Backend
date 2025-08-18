const Agent = require('../models/Agent');

// @desc    Create an agent
// @route   POST /agents
// @access  Public
exports.createAgent = async (req, res, next) => {
  try {
    const { chatAgentName, systemPrompt } = req.body;

    const agent = await Agent.create({
      chatAgentName,
      systemPrompt,
    });

    res.status(201).json({
      success: true,
      data: agent,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};