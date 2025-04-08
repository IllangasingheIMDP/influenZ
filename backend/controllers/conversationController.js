const ConversationModel = require('../models/conversationModel');

const conversationController = {
  async getConversations(req, res) {
    try {
      const userId = req.user.user_id;
      const conversations = await ConversationModel.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error('Error getting conversations:', error);
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  },

  async getOrCreateConversation(req, res) {
    try {
      const userId = req.user.user_id;
      const { otherUserId } = req.body;

      let conversation = await ConversationModel.findConversation(userId, otherUserId);

      if (!conversation) {
        conversation = await ConversationModel.createConversation(userId, otherUserId);
      }

      res.json(conversation);
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      res.status(500).json({ error: 'Failed to create or fetch conversation' });
    }
  }
};

module.exports = conversationController;