const express = require('express');
const {
  createSession,
  createMessage,
} = require('../controllers/sessionController');

const router = express.Router();

router.route('/:agentId').post(createSession);
router.route('/:sessionId/messages').post(createMessage);

module.exports = router;