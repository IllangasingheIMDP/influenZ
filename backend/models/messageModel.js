const pool = require('../db');

class MessageModel {
  static async getMessages(conversationId) {
    const query = `
      SELECT m.message_id, m.content, m.created_at, m.sender_id, u."firstName", u."lastName"
      FROM messages m
      JOIN users u ON m.sender_id = u.user_id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC
    `;
    const result = await pool.query(query, [conversationId]);
    return result.rows;
  }

  static async createMessage(conversationId, senderId, recipientId, content) {
    const query = `
      INSERT INTO messages (conversation_id, sender_id, recipient_id, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [conversationId, senderId, recipientId, content];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = MessageModel;