const pool = require('../db');

class ConversationModel {
  static async getUserConversations(userId) {
    const query = `
      SELECT c.conversation_id, u.user_id, u."firstName", u."lastName", u.user_type, c.updated_at
      FROM conversations c
      JOIN users u ON (u.user_id != $1 AND (c.user1_id = u.user_id OR c.user2_id = u.user_id))
      WHERE c.user1_id = $1 OR c.user2_id = $1
      ORDER BY c.updated_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findConversation(user1Id, user2Id) {
    const query = `
      SELECT * FROM conversations
      WHERE (user1_id = $1 AND user2_id = $2)
         OR (user1_id = $2 AND user2_id = $1)
      LIMIT 1
    `;
    const result = await pool.query(query, [user1Id, user2Id]);
    return result.rows[0];
  }

  static async createConversation(user1Id, user2Id) {
    const query = `
      INSERT INTO conversations (user1_id, user2_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [user1Id, user2Id]);
    return result.rows[0];
  }

  static async updateTimestamp(conversationId) {
    const query = `
      UPDATE conversations
      SET updated_at = NOW()
      WHERE conversation_id = $1
    `;
    await pool.query(query, [conversationId]);
  }
}

module.exports = ConversationModel;
