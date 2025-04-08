const MessageModel = require('../models/messageModel');
const ConversationModel = require('../models/conversationModel');

const messageController = {
  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const messages = await MessageModel.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  },

  async getMessagesByConversation(req, res) {
    try {
      const { conversationId } = req.params;
      const messages = await MessageModel.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      console.error('Error getting messages by conversation:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  },

  async sendMessage(req, res) {
    try {
      const senderId = req.user.user_id;
      const { recipientId, content, conversationId } = req.body;
      let convoId = conversationId;

      if (!convoId) {
        const conversation = await ConversationModel.findConversation(senderId, recipientId);
        if (conversation) {
          convoId = conversation.conversation_id;
        } else {
          const newConversation = await ConversationModel.createConversation(senderId, recipientId);
          convoId = newConversation.conversation_id;
        }
      }

      const message = await MessageModel.createMessage(convoId, senderId, recipientId, content);
      await ConversationModel.updateTimestamp(convoId);

      res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
};

module.exports = messageController;