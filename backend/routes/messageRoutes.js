const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all messages in a conversation
router.get('/:conversationId', authMiddleware(['influencer', 'brand']), messageController.getMessagesByConversation);

// Send a new message
router.post('/', authMiddleware(['influencer', 'brand']), messageController.sendMessage);

module.exports = router;