const pool = require("../db");
class ReportModel {
  static async insertReport(
    reporterFirstName,
    reporterLastName,
    reporterType,
    reporteeFirstName,
    reporteeLastName,
    reporteeType,
    reason,
    
  ) {
    console.log("in model");
    const query = `
    INSERT INTO reports (reporterFirstName, reporterLastName, reporterType, reporteeFirstName, reporteeLastName, reporteeType, reason,status,created_at)
    VALUES ($1, $2, $3, $4, $5,$6,$7, 'Pending', CURRENT_TIMESTAMP)
    RETURNING report_id, created_at;
  `;
    const values = [
    reporterFirstName,
      reporterLastName,
      reporterType,
      reporteeFirstName,
      reporteeLastName,
      reporteeType,
      reason,
    ];
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return the inserted report details
    } catch (error) {
      console.error("Error inserting report:", error);
      throw error; // Propagate error to the controller
    }
  }


}
module.exports = ReportModel;
