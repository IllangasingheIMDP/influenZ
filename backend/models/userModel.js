const bcrypt = require('bcrypt');
const pool = require('../db');

class UserModel {
  // static async createUser(email, password, firstName, lastName, contactInfo, role) {
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const query = `
  //     INSERT INTO users (email, password_hash, "firstName", "lastName", contact_info, user_type)
  //     VALUES ($1, $2, $3, $4, $5, $6)
  //     RETURNING user_id, email, "firstName", "lastName", user_type;
  //   `;
  //   const values = [email, hashedPassword, firstName, lastName, contactInfo, role];
  //   const result = await pool.query(query, values);
  //   return result.rows[0];
  // }

  static async eligibleToSignup(email,role) {
    if(role=='influencer'){
      const query = 'SELECT influencers.*, users.* FROM influencers JOIN users ON influencers.user_id = users.user_id WHERE users.user_type = $1 AND users.email = $2;';
      const values = [role, email];
      const result = await pool.query(query, values);
      return result.rows[0] ? false : true;
    }
  }

  // static async findByEmail(email, role) {
  //   const query = 'SELECT * FROM users WHERE email = $1 and user_type = $2;';
  //   const result = await pool.query(query, [email, role]);
  //   return result.rows[0];
  // }
  static async createUser(email, password, firstName, lastName, contactInfo, role, client = null) {
    const queryRunner = client || pool; // Use client if provided, else use pool
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (email, password_hash, "firstName", "lastName", contact_info, user_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id, email, "firstName", "lastName", user_type;
    `;
    const values = [email, hashedPassword, firstName, lastName, contactInfo, role];
    const result = await queryRunner.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email, role, client = null) {
    const queryRunner = client || pool; // Use client if provided, else use pool
    const query = 'SELECT * FROM users WHERE email = $1 AND user_type = $2;';
    const result = await queryRunner.query(query, [email, role]);
    return result.rows[0];
  }
  static async findByID(user_id) {
    const query = 'SELECT * FROM users WHERE user_id = $1;';
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  }

  static async updateEmail(userId, newEmail) {
    const query = 'UPDATE users SET email = $1 WHERE user_id = $2 RETURNING user_id, email, "firstName", "lastName", user_type;';
    const result = await pool.query(query, [newEmail, userId]);
    return result.rows[0];
  }

  // New method for searching users
  static async searchUsers(query, currentUserId) {
    const searchQuery = `
      SELECT user_id, "firstName", "lastName", user_type 
      FROM users 
      WHERE ("firstName" ILIKE $1 OR "lastName" ILIKE $1) 
      AND user_id != $2
      ORDER BY "firstName", "lastName";
    `;
    const result = await pool.query(searchQuery, [`%${query}%`, currentUserId]);
    return result.rows;
  }
}

module.exports = UserModel;