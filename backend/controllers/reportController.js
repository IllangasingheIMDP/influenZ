const reportModel = require('../models/reportModel');
class campaignController {
    static async insertReport(req, res) {
        console.log("Insert report request received"); // Log the request for debugging
        console.log("Request body:", req.body); // Log the request body for debugging
        const { reporterFirstName, reporterLastName, reporterType, reporteeFirstName, reporteeLastName, reporteeType, reason } = req.body;
        try {
            const report = await reportModel.insertReport( reporterFirstName, reporterLastName, reporterType, reporteeFirstName, reporteeLastName, reporteeType, reason);
            return res.status(200).json({
                success: true,
                data: report,
            });
        } catch (error) {
            console.error("Error in insertReport controller:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error.",
            });
        }
    }


}
module.exports = campaignController;