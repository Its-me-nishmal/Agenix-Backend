const express = require('express');
const { createAgent } = require('../controllers/agentController');

const router = express.Router();

router.route('/').post(createAgent);

module.exports = router;