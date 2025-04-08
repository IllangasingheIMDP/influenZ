const AdminModel = require('../models/adminModel');
class AdminController {
   static async isAdmin(req, res) {
      try {
        
         const admin = await AdminModel.isAdmin(req.user.userId);
         if (admin) {
            res.status(200).json({success: true, message: 'User is an admin' });
         } else {
            res.status(200).json({success: false, message: 'User is not an admin' });
         }
      } catch (error) {
        console.log(error);
         res.status(500).json({success: false, message: error.message });
      }
      
   }
   static async getReportsFromInfluencers(req, res) {
      try {
         const reports = await AdminModel.getReportsFromInfluencers();
         
         res.status(200).json({success: true, data: reports });
      } catch (error) {
         console.log(error);
         res.status(500).json({success: false, message: error.message });
      }
   }
   static async getReportsFromBrands(req, res) {
      try {
         const reports = await AdminModel.getReportsFromBrands();
         
         res.status(200).json({success: true, data: reports });
      } catch (error) {
         console.log(error);
         res.status(500).json({success: false, message: error.message });
      }
   }

   static async changeStatus(req, res) {
      const { reportId, status } = req.body; // Destructure reportId and status from the request body
      try{
          const report = await AdminModel.changeStatus(reportId, status); // Call the model method to change the status
          return res.status(200).json({
              success: true,
              data: report, // Return the updated report data
          });

      }catch (error) {
          console.error("Error in changeStatus controller:", error); // Log the error for debugging
          return res.status(500).json({
              success: false,
              message: "Internal server error.", // Return a generic error message
          });
      }

  }
}

module.exports = AdminController;