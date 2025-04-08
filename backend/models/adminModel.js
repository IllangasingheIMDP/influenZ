const pool = require("../db");

class AdminModel {
  static async isAdmin(userId) {
    const query = "SELECT * FROM users WHERE user_id = $1 and user_type = $2";
    const values = [userId, "admin"];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getReportsFromInfluencers() {
    try {
      const query = `select report_id, reporterfirstname , reporterlastname ,reportertype, reporteefirstname ,reporteelastname ,reporteetype,reason,status,created_at,updated_at
      from reports
      where reportertype='influencer'`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error retrieving reports from influencers:", error);
      throw error; // Propagate error to the controller
    }
  }

  static async getReportsFromBrands() {
    try{
      const query = `select report_id,reporterfirstname , reporterlastname ,reportertype, reporteefirstname ,reporteelastname ,reporteetype,reason,status,created_at,updated_at
from reports where reportertype='brand'`;
    const result = await pool.query(query);
    return result.rows; // Return the reports for influencers

    } catch (error) {
      console.error("Error retrieving reports from brands:", error);
      throw error; // Propagate error to the controller
    }
    }

    static async changeStatus(reportId, status) {
     
      const query = `UPDATE reports SET status = $1 WHERE report_id = $2 RETURNING *`;
      const values = [status, reportId];
      try {
        const result = await pool.query(query, values);
        return result.rows[0]; // Return the updated report details
      } catch (error) {
        console.error("Error changing report status:", error);
        throw error; // Propagate error to the controller
      }
    }
}

module.exports = AdminModel;
