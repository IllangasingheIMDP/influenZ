const pool = require("../db");

class CampaignModel {
  static async getcampaignCardDetails() {
    try {
      const query = `
                SELECT 
    c.campaign_id,
    c.name AS campaign_name,
    b.company_name AS company_name,
    c.description,
    c.goals,
    c.budget,
    c.start_date AS startdate,
    c.end_date AS enddate,
    c.camp_img,
    c.keywords
FROM 
    campaigns c
JOIN 
    brands b ON c.brand_id = b.brand_id where c.status = 'draft';

            `;
      const result = await pool.query(query);
      return result.rows; // Returns rows (campaign data)
    } catch (error) {
      console.error("Error retrieving campaigns with brand details:", error);
      throw error; // Propagate error to the controller
    }
  }

  static async getOngoingCampaigns(influencer_id) {
    // Assuming you have user ID from the request
    
    try {
      const query = `
              SELECT 
                  ci.campaign_id,
                  c.name AS campaign_name,
                  b.company_name,
                  c.description,
                  c.goals,
                  c.budget,
                  c.start_date AS startdate,
                  c.end_date AS enddate,
                  c.camp_img,
                  c.keywords
              FROM campaigninfluencers ci
              JOIN campaigns c ON ci.campaign_id = c.campaign_id
              JOIN brands b ON c.brand_id = b.brand_id
              WHERE ci.status = 'accepted' and ci.influencer_id=$1;
          `;
      const values = [influencer_id];
      const result = await pool.query(query, values);
      return result.rows; // Returns rows (ongoing campaign data)
    } catch (error) {
      console.error("Error retrieving ongoing campaigns:", error);
      throw error; // Propagate error to the controller
    }
  }
  static async getCampaignTasks(campaignId) {
    try {
      const query = `select description , due_date , status
                    from tasks
                    where campaign_id = $1`;
      const values = [campaignId];
      const result = await pool.query(query, values);
      return result.rows; // Returns rows (ongoing campaign data)
    } catch (error) {
      console.error("Error retrieving ongoing campaigns:", error);
      throw error; // Propagate error to the controller
    }
  }
  // Check if a campaign exists
  // Check if the influencer has already applied to the campaign
  static async checkApplicationExists(campaignId, influencerId) {
    try {
      const query = `
        SELECT 1 
        FROM campaigninfluencers 
        WHERE campaign_id = $1 AND influencer_id = $2 
        LIMIT 1
      `;
      const values = [campaignId, influencerId];
      const result = await pool.query(query, values);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error("Error checking application existence: " + error.message);
    }
  }

  // Apply to a campaign (insert into campaigninfluencers table)
  static async applyToCampaign(campaignId, influencerId) {
    console.log("inside the model applyToCampaign function");
    try {
      const query = `
        INSERT INTO campaigninfluencers (campaign_id, influencer_id, status, joined_at)
        VALUES ($1, $2, 'applied', CURRENT_TIMESTAMP)
        RETURNING *
      `;
      const values = [campaignId, influencerId];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error applying to campaign: ' + error.message);
    }
  }
}

module.exports = CampaignModel;
