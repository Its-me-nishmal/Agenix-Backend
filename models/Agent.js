const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  chatAgentName: {
    type: String,
    required: true,
  },
  systemPrompt: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Agent', AgentSchema);