const campaignModel = require("../models/campaignModel");

const influencerModel = require("../models/influencerModel");
class campaignController {
  static async getCampaignCardDetails(req, res) {
    try {
      const campaigns = await campaignModel.getcampaignCardDetails();

      if (campaigns.length > 0) {
        return res.status(200).json({
          success: true,
          data: campaigns,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "No campaigns found ",
        });
      }
    } catch (error) {
      console.error("Error in getCampaigns controller:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  static async getOngoingCampaigns(req, res) {
    // Log when the function is called
    const userID = req.user.userId; // Assuming you have user ID from the request
    

    try {
      console.log("inside the try block"); // Log when entering the try block
      const influencer_id = await influencerModel.getInfluencerId(userID);
      const campaigns = await campaignModel.getOngoingCampaigns(influencer_id); // Get the ongoing campaigns

      // If campaigns exist, send them in the response
      if (campaigns && campaigns.length > 0) {
        console.log("Ongoing Campaigns found:", campaigns); // Log the retrieved ongoing campaigns
        return res.status(200).json({
          success: true,
          data: campaigns, // Return the ongoing campaigns
        });
      } else {
        // If no ongoing campaigns, return an empty array (not an error)
        console.log("No ongoing campaigns found for user");
        return res.status(200).json({
          success: true,
          data: [], // Empty array for no ongoing campaigns
        });
      }
    } catch (error) {
      console.error("Error in getOngoingCampaigns controller:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  static async getCamapaignTasks(req, res) {
    const campaignID = req.params.campaignID; // Extract campaign ID from request parameters

    try {
      const tasks = await campaignModel.getCampaignTasks(campaignID);
      if (tasks.length > 0) {
        return res.status(200).json({
          success: true,
          data: tasks,
        });
      } else {
        console.log("No Tasks for this campaign found");
        return res.status(200).json({
          success: true,
          data: [], // Empty array for no ongoing campaigns
        });
      }
    } catch (error) {
      console.error("Error in getCampaignTasks controller:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
  // New method to handle applying to a campaign
  static async applyToCampaign(req, res) {
    const { campaign_id, userId } = req.body;
    try {
      const influencer_id = await influencerModel.getInfluencerId(userId); // Get influencer ID from the database
      console.log("Influencer ID:", influencer_id); // Log the influencer ID

      // Check if the influencer has already applied
      // Check if influencer_id was found
      if (!influencer_id) {
        return res.status(404).json({
          success: false,
          message: "Influencer not found.",
        });
      }
      // Get the verification status of the influencer
      const verifiedStatus = await influencerModel.getVerificationStatus(
        userId
      );
      console.log("Influencer Verification Status:", verifiedStatus); // Log the verification status

      if (verifiedStatus !== "verified") {
        return res.status(400).json({
          success: true,
          message: "Only verified influencers can apply for campaigns.",
        });
      }


      const alreadyApplied = await campaignModel.checkApplicationExists(
        campaign_id,
        influencer_id
      );
      console.log("Already Applied:", alreadyApplied); // Log if already applied
      if (alreadyApplied) {
        return res.status(400).json({
          success: false,
          message: "You have already applied to this campaign.",
        });
      }

      // Apply to the campaign
      await campaignModel.applyToCampaign(campaign_id, influencer_id);


      return res.status(200).json({
        success: true,
        message: "Successfully applied to the campaign.",
      });
    } catch (error) {
      console.error("Error in applyToCampaign controller:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }


  static async saveLink(req, res) {
    const {link , task_id , userId} = req.body;
    console.log("Link:", link); // Log the link
    console.log("Task ID:", task_id); // Log the task ID
    console.log("User ID:", userId); // Log the user ID
    try{
      const influencer_id = await influencerModel.getInfluencerId(userId); // Get influencer ID from the database
      console.log("Influencer ID:", influencer_id); // Log the influencer ID
      const result = await campaignModel.saveLink(link,task_id, influencer_id); // Save the link in the database
      console.log("Result:", result); // Log the result of saving the link
      if (result) {
        return res.status(200).json({
          success: true,
          message: "Link saved successfully.",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Failed to save link.",
        });
      }

    }catch (error) {
      console.error("Error in saveLink controller:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }

  }


}
module.exports = campaignController;
