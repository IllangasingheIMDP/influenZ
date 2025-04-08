const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all conversations for the logged-in user
router.get('/', authMiddleware(['influencer', 'brand']), conversationController.getConversations);

// Create or fetch a conversation between two users
router.post('/', authMiddleware(['influencer', 'brand']), conversationController.getOrCreateConversation);

module.exports = router;