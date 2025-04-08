const cloudinary = require('cloudinary').v2;
const InfluencerModel = require('../models/influencerModel');
const brandModel=require('../models/brandModel')
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class InfluencerController {

  static async verifyInfluencer(req, res) {
    const { userId } = req.body;
    try {
      const influencer = await InfluencerModel.verifyInfluencer(userId);
      res.status(200).json({success: true, influencer });
    } catch (error) {
      res.status(500).json({success: false, message: error.message });
    }
  }

  static async rejectInfluencer(req, res) {
    const { userId } = req.body;
    try {
      const influencer = await InfluencerModel.rejectInfluencer(userId);
      res.status(200).json({success: true, influencer });
    } catch (error) {
      res.status(500).json({success: false, message: error.message });
    }
  }

    static async getVerificationStatus(req, res) {
        try {
          const status = await InfluencerModel.getVerificationStatus(req.user.userId);
          res.status(200).json({success: true, status:status });
        } catch (error) {
          res.status(500).json({success: false, message: error.message });
        }
    }

    static async getAllInfluencers(req, res) {
        try {
          const influencers = await InfluencerModel.getAllInfluencers();
          res.status(200).json({success: true, influencers });
        } catch (error) {
          res.status(500).json({success: false, message: error.message });
        }
      }
    static async getAllInfluencersPending(req, res) {
        try {
          const influencers = await InfluencerModel.getAllInfluencersPending();
          res.status(200).json({success: true, influencers });
        } catch (error) {
          res.status(500).json({success: false, message: error.message });
        }
      }

      static async updateTags(req, res) {
        const { tags } = req.body;
        try {
          const updatedInfluencer = await InfluencerModel.uptadeTags(req.user.userId, tags);
          res.status(200).json({success: true, updatedInfluencer });
        } catch (error) {
          res.status(500).json({success: false, message: error.message });
        }
      }

      static async getInfluencerProfile(req, res) {
        const {userId} = req.params
        try {
          const influencer = await InfluencerModel.getInfluencer(userId);
          //console.log(influencer)
          res.status(200).json({success: true, influencer:influencer });
        }catch (error) {
          //console.log(error)
          res.status(500).json({success: false, message: error.message });
        }
      }
      static async getInfluencerId(req, res) {
        try {
          const influencerId = await InfluencerModel.getInfluencerId(req.user.userId);
          res.status(200).json({success: true, influencerId });
      }catch (error) {
          res.status(500).json({success: false, message: error.message });
        }
      }


      static async getAllInfluencersVerified(req, res) {
        try {
          const influencers = await InfluencerModel.getAllInfluencersVerified();
          const brands =await brandModel.getAllBrands();
          res.status(200).json({success: true, influencers,brands });
        } catch (error) {
          res.status(500).json({success: false, message: error.message });
        }
      }



    static async getVerificationStep(req, res) {
        try {
          const step = await InfluencerModel.getVerificationStep(req.user.userId);
          res.status(200).json({ step });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
      // Upload identity card
  static async uploadIdentityCard(req, res) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      await InfluencerModel.updateIdentityCard(req.user.userId, result.secure_url);
      res.status(200).json({ success: true, url: result.secure_url });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async uploadProfileImage(req, res) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      await InfluencerModel.updateProfilePic(req.user.userId, result.secure_url);
      res.status(200).json({ success: true, url: result.secure_url });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async getProfilePic(req, res) {
    const {userId} = req.params
    try {
      const profilePic = await InfluencerModel.getProfilePic(userId);
      res.status(200).json({ success: true, profilePic });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Submit social media handles
  static async submitSocialMedia(req, res) {
    const { userId, socialMedia } = req.body;
    if (!socialMedia || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
      await InfluencerModel.updateSocialMediaHandles(userId, socialMedia);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = InfluencerController