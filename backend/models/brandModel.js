const pool = require('../db');

class BrandModel {

    // static async initiateBrand(userID,company_details,social_media_handles,company_name,company_pic) {
    //     try {
    //         const query = `
    //             INSERT INTO brands (user_id, company_details, social_media_handles, company_name, company_pic)
    //             VALUES ($1, $2, $3, $4, $5)
    //             RETURNING *;
    //         `;
    //         const values = [userID, company_details, social_media_handles, company_name, company_pic];
           
    //         const result = await pool.query(query, values);
    //         return result.rows[0];
    //     } catch (error) {
    //         throw new Error(`Database error: ${error.message}`);
    //     }
      
    // }
    static async initiateBrand(userID, company_details, social_media_handles, company_name, company_pic, client = null) {
      const queryRunner = client || pool; // Use client if provided, else use pool
      try {
        const query = `
          INSERT INTO brands (user_id, company_details, social_media_handles, company_name, company_pic)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const values = [userID, company_details, social_media_handles, company_name, company_pic];
        const result = await queryRunner.query(query, values);
        return result.rows[0];
      } catch (error) {
        throw new Error(`Database error: ${error.message}`);
      }
    }
    static async createCampaign(userID, name, description, goal, budget, startDate, endDate, youtube, facebook, instagram, tiktok,camp_img) {
        try {
            // Step 1: Get the brand_id related to the given userID
            const brandQuery = `
                SELECT brand_id FROM brands WHERE user_id = $1;
            `;
            const brandResult = await pool.query(brandQuery, [userID]);

            // If no brand is found for the user, throw an error
            if (brandResult.rows.length === 0) {
                throw new Error(`No brand found for user ID: ${userID}`);
            }

            const brandID = brandResult.rows[0].brand_id;

            // Step 2: Insert new campaign using the retrieved brand_id
            const campaignQuery = `
                INSERT INTO campaigns (brand_id, name, description, goals, budget, start_date, end_date, status, youtube, facebook, instagram, tiktok,camp_img)
                VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft', $8, $9, $10, $11,$12)
                RETURNING *;
            `;

            const values = [brandID, name, description, goal, budget, startDate, endDate, youtube, facebook, instagram, tiktok,camp_img];
            
            // Debugging log
            const result = await pool.query(campaignQuery, values);
            
            
            return result.rows[0];

        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }


    static async getActiveCampaigns(userID) {
        try {

            const brandQuery = `
                SELECT brand_id FROM brands WHERE user_id = $1;
            `;
            const brandResult = await pool.query(brandQuery, [userID]);


            // If no brand is found for the user, throw an error
            if (brandResult.rows.length === 0) {
                throw new Error(`No brand found for user ID: ${userID}`);
            }

            const brandID = brandResult.rows[0].brand_id;
            console.log(brandID,"brand");
            const query = `
                SELECT campaign_id,name, description, start_date, end_date, goals, budget,camp_img
                FROM campaigns
                WHERE brand_id = $1 AND status = 'active' AND end_date >= CURRENT_DATE;
            `;

            const result = await pool.query(query, [brandID]);
            

            return result.rows;
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }


    static async getTasksByCampaign(campaign_id) {
        const result = await pool.query(
            "SELECT * FROM tasks WHERE campaign_id = $1 ORDER BY due_date ASC",
            [campaign_id]
        );
        return result.rows;
    }

    static async addTask({ campaign_id, description, due_date, platforms ,goal}) {
        const result = await pool.query(
            `INSERT INTO tasks (campaign_id, description, due_date, facebook, youtube, instagram, tiktok,goal)
             VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *`,
            [campaign_id, description, due_date, platforms.facebook, platforms.youtube, platforms.instagram, platforms.tiktok,goal]
        );
        return result.rows[0];
    }

    static async getTasksofCampaign (campaign_id) {
        console.log(campaign_id)
        const query = `
          SELECT t.task_id, t.description, t.due_date, t.status, t.completed_at, 
                 t.facebook, t.youtube, t.instagram, t.tiktok, 
                 t.goal as expected, it.got, it.start_date, it.end_date, it.status as influencer_status,it.link,
                 u."firstName", u."lastName",u.email
          FROM tasks t
          LEFT JOIN InfluencerTasks it ON t.task_id = it.task_id
          LEFT JOIN influencers i ON it.influencer_id = i.influencer_id
          LEFT JOIN users u ON i.user_id = u.user_id
          WHERE t.campaign_id = $1;
        `;
        const { rows } = await pool.query(query, [campaign_id]);
        console.log(rows,"This is tasks assignes influ")
        return rows;
      }
      static async getAllBrands(){
        const query='select * from brands';
        const result=await pool.query(query);
        return result.rows;
      }

      static async getBrandIdByUserId(user_id) {
        console.log(user_id, "is in model");
        const { rows } = await pool.query("SELECT brand_id FROM brands WHERE user_id = $1", [user_id]);
        return rows[0];
      }
      
      static async getActiveCampaignsByBrand(brand_id) {
        const { rows } = await pool.query(
          "SELECT campaign_id, name FROM campaigns WHERE brand_id = $1 AND status = 'draft'",
          [brand_id]
        );
        return rows;
      }
      
      static async getAppliedInfluencersByCampaigns(campaignIds) {
        const { rows } = await pool.query(
          "SELECT campaign_id, influencer_id FROM campaigninfluencers WHERE status = 'applied' AND campaign_id = ANY($1::int[])",
          [campaignIds]
        );
        return rows;
      }
      
      static async getUserIdsByInfluencerIds(influencerIds) {
        const { rows } = await pool.query(
          "SELECT influencer_id, user_id FROM influencers WHERE influencer_id = ANY($1::int[])",
          [influencerIds]
        );
        return rows;
      }
      
      static async getUserDetailsByIds(userIds) {
        const { rows } = await pool.query(
          `SELECT user_id, "firstName", "lastName" FROM users WHERE user_id = ANY($1::int[])`,
          [userIds]
        );
        return rows;
      }

      static async getInfluencerIdByUserId(user_id) {
        const { rows } = await pool.query(
          "SELECT influencer_id FROM influencers WHERE user_id = $1",
          [user_id]
        );
        return rows[0];
      }


      
      

     


      static async getInfluencerByUserId(user_id) {
        const result = await pool.query(
          "SELECT influencer_id FROM influencers WHERE user_id = $1",
          [user_id]
        );
        return result.rows[0];
      }
      
      // Get task_ids for a campaign
      static async getTasksByCampaignId(campaign_id) {
        // Update task status to 'assigned' for the given campaign_id
        await pool.query(
          "UPDATE tasks SET status = 'assigned' WHERE campaign_id = $1",
          [campaign_id]
        );
      
        // Then fetch the task_ids
        const result = await pool.query(
          "SELECT task_id FROM tasks WHERE campaign_id = $1",
          [campaign_id]
        );
      
        return result.rows.map(row => row.task_id);
      }
      
      
      // Insert into influencertasks
      static async assignTasksToInfluencer(taskIds, influencer_id, start_date) {
        const values = taskIds.map(task_id => `(${task_id}, ${influencer_id}, '${start_date}')`).join(", ");
        if (taskIds.length > 0) {
          await pool.query(`
            INSERT INTO influencertasks (task_id, influencer_id, start_date) 
            VALUES ${values}
          `);
        }
      }

      static async acceptInfluencer(campaign_id, influencer_id, USERID, user_id) {
        // Update campaigninfluencers table
        await pool.query(
          "UPDATE campaigninfluencers SET status = 'accepted' WHERE campaign_id = $1 AND influencer_id = $2",
          [campaign_id, influencer_id]
        );
      
        // Update campaigns table status to 'active'
        await pool.query(
          "UPDATE campaigns SET status = 'active' WHERE campaign_id = $1",
          [campaign_id]
        );
      
        // Get company_name from brands table where user_id = USERID
        const brandResult = await pool.query(
          "SELECT company_name FROM brands WHERE user_id = $1",
          [USERID]
        );
        const company_name = brandResult.rows[0]?.company_name;
      
        // Get campaign name from campaigns table
        const campaignResult = await pool.query(
          "SELECT name FROM campaigns WHERE campaign_id = $1",
          [campaign_id]
        );
        const campaign_name = campaignResult.rows[0]?.name;
      
        // Construct notification message
        const notificationMessage = `${company_name} has accepted your request for campaign "${campaign_name}"`;
      
        // Insert into notifications table
        await pool.query(
          "INSERT INTO notifications (user_id, notification) VALUES ($1, $2)",
          [user_id, notificationMessage]
        );
      }


      static async rejectInfluencer(campaign_id, influencer_id, USERID, user_id) {
        // Update campaigninfluencers table
        await pool.query(
          "UPDATE campaigninfluencers SET status = 'rejected' WHERE campaign_id = $1 AND influencer_id = $2",
          [campaign_id, influencer_id]
        );
      
        // Update campaigns table status to 'active'
        
      
        // Get company_name from brands table where user_id = USERID
        const brandResult = await pool.query(
          "SELECT company_name FROM brands WHERE user_id = $1",
          [USERID]
        );
        const company_name = brandResult.rows[0]?.company_name;
      
        // Get campaign name from campaigns table
        const campaignResult = await pool.query(
          "SELECT name FROM campaigns WHERE campaign_id = $1",
          [campaign_id]
        );
        const campaign_name = campaignResult.rows[0]?.name;
      
        // Construct notification message
        const notificationMessage = `${company_name} has rejected your request for campaign "${campaign_name}"`;
      
        // Insert into notifications table
        await pool.query(
          "INSERT INTO notifications (user_id, notification) VALUES ($1, $2)",
          [user_id, notificationMessage]
        );
      }
      


      


      static async getBrandsByUserId(user_id) {
        
        try {
          // Query the brands table for the given user_id
          const result = await pool.query(
            "SELECT * FROM brands WHERE user_id = $1",
            [user_id]
          );
          
    
          // Return the first row (or all rows depending on your use case)
          return result.rows[0];
        } catch (err) {
          console.error("Error getting brands by userId:", err);
          throw err; // Rethrow the error for handling in the controller
        }
      }


      static async getMostInteractedInfluencersByUserId(user_id) {
        const query = `
          SELECT DISTINCT u.email, u.contact_info, u."firstName", u."lastName"
          FROM brands b
          JOIN campaigns c ON b.brand_id = c.brand_id
          JOIN tasks t ON c.campaign_id = t.campaign_id
          JOIN influencertasks it ON t.task_id = it.task_id
          JOIN influencers i ON it.influencer_id = i.influencer_id
          JOIN users u ON i.user_id = u.user_id
          WHERE b.user_id = $1
        `;
    
        const result = await pool.query(query, [user_id]);
        return result.rows;
      }


      static async getNotifications(userId) {
        try {
          const query = `
            SELECT notification_id, notification, created_at, status 
            FROM notifications
            WHERE user_id = $1
            ORDER BY 
              CASE WHEN status = 'unread' THEN 0 ELSE 1 END,
              created_at DESC
          `;
          const result = await pool.query(query, [userId]);
          return result.rows;
        } catch (error) {
          console.error('Error fetching notifications:', error);
          throw error;
        }
      }



      static async markAsRead(notificationId, userId) {
        try {
          const query = `
            UPDATE notifications 
            SET status = 'read' 
            WHERE notification_id = $1 AND user_id = $2
            RETURNING *
          `;
          const result = await pool.query(query, [notificationId, userId]);
          return result.rows[0];
        } catch (error) {
          console.error('Error marking notification as read:', error);
          throw error;
        }
      }
    
      static async getAllCompanyPics() {
        const result = await pool.query('SELECT company_pic FROM brands');
        return result.rows;
      }
    

      static async getInfluencers() {
        try {
          const [results] = await pool.query(`
            SELECT u."firstName", u."lastName", i.profile_pic
            FROM users u
            JOIN influencers i ON u.user_id = i.user_id
          `);
      
          // If results is an object containing rows, use `results.rows`
          return results.rows || results; // Fallback to `results` if `rows` is undefined
        } catch (error) {
          throw new Error("Error fetching influencers: " + error.message);
        }
      }
      



      
      

      
}

module.exports = BrandModel;
