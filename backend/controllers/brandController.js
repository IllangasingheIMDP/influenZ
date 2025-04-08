const BrandModel = require('../models/brandModel');

class BrandController {
    static async createCampaign(req, res) {
        try {
            
            const userID = req.user.userId;
            
            const { name, description, expectedReach, budget, startDate, endDate, youtube, facebook, instagram, tiktok,camp_img } = req.body;

            if (!name || !description || !expectedReach || !budget || !startDate || !endDate) {
                return res.status(400).json({ message: "All required fields must be provided." });
            }

            const campaign = await BrandModel.createCampaign(userID,name, description, expectedReach, budget, startDate, endDate, youtube, facebook, instagram, tiktok,camp_img);

            res.status(201).json({ message: "Campaign created successfully!", campaign });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message });
        }
    }

    static async getActiveCampaigns(req, res) {
        try {
            console.log("kasun")
            const userID = req.params.userId; // Extracted from token middleware
            console.log(userID)

            const campaigns = await BrandModel.getActiveCampaigns(userID);
            console.log(campaigns,"campaigns")

            res.status(200).json({ success: true, campaigns });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }


    static async getTasks(req, res) {
        try {
            console.log("getting tasks")
            const { campaign_id } = req.params;
            const tasks = await BrandModel.getTasksByCampaign(campaign_id);
            res.status(200).json({ success: true, tasks });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async createTask(req, res) {
        try {
            const { campaign_id } = req.params;
            const { description, due_date, platforms,goal } = req.body;
            console.log(campaign_id,description,due_date,platforms)
            
            const newTask = await BrandModel.addTask({ campaign_id, description, due_date, platforms,goal });
            res.status(201).json({ success: true, task: newTask });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getTasksofCampaign (req, res)  {
        try {
            
          const campaign_id = req.params.campaign_id;
          const tasks = await BrandModel.getTasksofCampaign(campaign_id);
          res.json(tasks);
        } catch (error) {
          res.status(500).json({ error: "Error fetching tasks" });
        }
    }

    static async  getAppliedInfluencers  (req, res) {
        try {
          const user_id = req.user.userId;
          console.log("logged user",user_id)
          
      
          const brand = await BrandModel.getBrandIdByUserId(user_id);
          if (!brand) return res.status(404).json({ message: "Brand not found" });
      
          const campaigns = await BrandModel.getActiveCampaignsByBrand(brand.brand_id);
          const campaignIds = campaigns.map(c => c.campaign_id);
          if (campaignIds.length === 0) return res.json({ campaigns: [] });
      
          const applications = await BrandModel.getAppliedInfluencersByCampaigns(campaignIds);
          const influencerIds = applications.map(a => a.influencer_id);
      
          const influencerToUserMap = await BrandModel.getUserIdsByInfluencerIds(influencerIds);
          const userIds = influencerToUserMap.map(i => i.user_id);
      
          const userDetails = await BrandModel.getUserDetailsByIds(userIds);
      
          const enrichedCampaigns = campaigns.map(campaign => {
            const appliedInfluencers = applications
              .filter(a => a.campaign_id === campaign.campaign_id)
              .map(a => {
                const influencer = influencerToUserMap.find(i => i.influencer_id === a.influencer_id);
                const user = userDetails.find(u => u.user_id === influencer?.user_id);
                return {
                  user_id: user?.user_id,
                  firstName: user?.firstName,
                  lastName: user?.lastName
                };
              });
      
            return {
              campaign_id: campaign.campaign_id,
              name: campaign.name,
              applicants: appliedInfluencers
            };
          });
      
          res.json({ campaigns: enrichedCampaigns });
      
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server Error" });
        }
      };


      static async rejectInfluencer  (req, res)  {
        try {
          const { campaign_id, user_id } = req.body;
      
          const influencer = await BrandModel.getInfluencerIdByUserId(user_id);
      
          if (!influencer) {
            return res.status(404).json({ error: "Influencer not found" });
          }
      
          await BrandModel.rejectInfluencer(campaign_id, influencer.influencer_id);
      
          res.status(200).json({ message: "Influencer rejected successfully" });
        } catch (error) {
          console.error("Error rejecting influencer:", error);
          res.status(500).json({ error: "Server error" });
        }
      };


      static async  acceptApplicant  (req, res)  {
        try {
          const USERID = req.user.userId;
          console.log(USERID)
          const { campaign_id, user_id } = req.body;
      
          const influencer = await BrandModel.getInfluencerByUserId(user_id);
          if (!influencer) return res.status(404).json({ message: "Influencer not found" });
      
          const tasks = await BrandModel.getTasksByCampaignId(campaign_id);
          const currentDate = new Date().toISOString().split("T")[0];
      
          await BrandModel.assignTasksToInfluencer(tasks, influencer.influencer_id, currentDate);
      
          await BrandModel.acceptInfluencer(campaign_id, influencer.influencer_id,USERID,user_id);
      
          res.json({ message: "Applicant accepted and tasks assigned." });
        } catch (error) {
          console.error("Accept error:", error);
          res.status(500).json({ message: "Server error" });
        }
      };


      static async getUserBrands  (req, res)  {
        try {
            
          const userId=req.params.userId;
          
          const brands = await BrandModel.getBrandsByUserId(userId);
          
          
          res.json(brands);
        } catch (error) {
          res.status(500).json({ error: 'Failed to get brands' });
        }
      };


      static async getMostInteractedInfluencers  (req, res)  {
        try {
          const userId = req.params.userId;
      
          const influencers = await BrandModel.getMostInteractedInfluencersByUserId(userId);
      
          res.status(200).json({ influencers });
        } catch (err) {
          console.error("Error fetching most interacted influencers:", err.message);
          res.status(500).json({ error: "Server Error" });
        }
      };


      static async getNotifications(req, res) {
        try {
          const user_id = req.user.userId; // Using user ID from authenticated user
          const notifications = await BrandModel.getNotifications(user_id);
          res.status(200).json({ success: true, data: notifications });
        } catch (error) {
          console.error('Controller error:', error);
          res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
        }
      }
    
      // Mark a notification as read
      static async markAsRead(req, res) {
        try {
          const { notificationId } = req.params;
          const user_id = req.user.userId; // Using user ID from authenticated user
          
          const updatedNotification = await BrandModel.markAsRead(notificationId, user_id);
          
          if (!updatedNotification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
          }
          
          res.status(200).json({ success: true, data: updatedNotification });
        } catch (error) {
          console.error('Controller error:', error);
          res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
        }
      }
      
      
}

module.exports = BrandController;
