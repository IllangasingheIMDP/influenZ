const pool = require("../db");

class InfluencerModel {
  static async getAllInfluencers() {
    const query = "SELECT * FROM influencers";
    const result = await pool.query(query);
    return result.rows;
  }
  static async verifyInfluencer(userId) {
    const query = `
      UPDATE influencers 
      SET verification_status = 'verified' 
      WHERE user_id = $1 
      RETURNING *;
    `;
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async rejectInfluencer(userId) {
    const query = `
      UPDATE influencers 
      SET verification_status = 'rejected' 
      WHERE user_id = $1 
      RETURNING *;
    `;
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAllInfluencersPending() {
    const query = `SELECT *
FROM influencers i 
JOIN users u ON i.user_id = u.user_id 
WHERE i.verification_status = 'pending'`;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getAllInfluencersVerified() {

    const query = `SELECT i.*, y.*,CONCAT(u."firstName", ' ', u."lastName") AS name FROM influencers i LEFT JOIN influencer_youtube_metrics y ON i.influencer_id = y.influencer_id JOIN users u ON i.user_id = u.user_id WHERE i.verification_status = 'verified'`;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getVerificationStatus(userId) {
    const query =
      "SELECT verification_status FROM influencers WHERE user_id = $1;";
    const result = await pool.query(query, [userId]);
    return result.rows[0]?.verification_status || pending;
  }
  // static async initiateInfluencer(userId, profile_pic, gender, age, country) {
  //   console.log(userId, profile_pic, gender, age, country);
  //   const query = `
  //     INSERT INTO influencers (user_id,profile_pic,gender,age,country)
  //     VALUES ($1,$2,$3,$4,$5)
  //     RETURNING *;`;
  //   const values = [userId, profile_pic, gender, age, country];
  //   const result = await pool.query(query, values);
  //   return result.rows[0];
  // }
  static async initiateInfluencer(userId, profile_pic, gender, age, country, client = null) {
    const queryRunner = client || pool; // Use client if provided, else use pool
    console.log(userId, profile_pic, gender, age, country);
    const query = `
      INSERT INTO influencers (user_id, profile_pic, gender, age, country)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [userId, profile_pic, gender, age, country];
    const result = await queryRunner.query(query, values);
    return result.rows[0];
  }

  static async getInfluencer(userId) {

    const query = `SELECT influencers.*, CONCAT(users."firstName", ' ', users."lastName") AS name FROM influencers JOIN users ON influencers.user_id = users.user_id WHERE influencers.user_id = $1;`;

    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getInfluencerId(userId) {
    const query = "SELECT influencer_id FROM influencers WHERE user_id = $1";
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows[0].influencer_id;
  }
  static async getVerificationStep(userId) {
    const query =
      "SELECT verification_step FROM influencers WHERE user_id = $1;";
    const result = await pool.query(query, [userId]);
    return result.rows[0]?.verification_step || 1;
  }
  // Update the verification step
  static async updateVerificationStep(userId, step) {
    const query =
      "UPDATE influencers SET verification_step = $1 WHERE user_id = $2 RETURNING *;";
    const result = await pool.query(query, [step, userId]);
    return result.rows[0];
  }

  // Update email verification status (already implemented, but included for completeness)
  static async updateEmailVerification(userId, status) {
    const query =
      "UPDATE influencers SET email_verified = $1, verification_step = 2 WHERE user_id = $2 RETURNING *;";
    const result = await pool.query(query, [status, userId]);
    return result.rows[0];
  }

  // Store identity card URL
  static async updateIdentityCard(userId, url) {
    const query =
      "UPDATE influencers SET identity_card_url = $1, verification_step = 3 WHERE user_id = $2 RETURNING *;";
    const result = await pool.query(query, [url, userId]);
    return result.rows[0];
  }

  static async updateProfilePic(userId, url) {
    const query =
      "UPDATE influencers SET profile_pic = $1 WHERE user_id = $2 RETURNING *;";
    const result = await pool.query(query, [url, userId]);
    return result.rows[0];
  }

  static async uptadeTags(userId, tags) {
    const query =
      "UPDATE influencers SET tags = $1 WHERE user_id = $2 RETURNING *";
    const result = await pool.query(query, [tags, userId]);
    return result.rows[0];
  }

  static async getProfilePic(userId) {
    const query = "SELECT profile_pic FROM influencers WHERE user_id = $1";
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows[0].profile_pic;
  }
  // Store social media handles
  static async updateSocialMediaHandles(userId, socialMedia) {
    const query = `
      UPDATE influencers 
      SET social_media_handles = $1, verification_step = 4, verification_status = 'pending' 
      WHERE user_id = $2 
      RETURNING *;
    `;
    const result = await pool.query(query, [socialMedia, userId]);
    return result.rows[0];
  }
}

module.exports = InfluencerModel;
