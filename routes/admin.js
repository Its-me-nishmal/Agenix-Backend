const express = require('express');
const {
  getAgents,
  getSessions,
  getSessionHistory,
} = require('../controllers/adminController');

const router = express.Router();

router.route('/agents').get(getAgents);
router.route('/sessions/:agentId').get(getSessions);
router.route('/session/:sessionId').get(getSessionHistory);

module.exports = router;