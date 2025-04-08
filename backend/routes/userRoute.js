const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const campaignController = require('../controllers/campaignController');
const reportController = require('../controllers/reportController');
const router = express.Router();

router.get('/me', authMiddleware(['influencer', 'brand', 'admin']), UserController.getMe);
router.get('/getongoingcampaigns', authMiddleware(['influencer']), campaignController.getOngoingCampaigns);
router.get('/getcampaigntasks/:campaignID', authMiddleware(['influencer']), campaignController.getCamapaignTasks);
router.post('/applytocampaign', authMiddleware(['influencer']), campaignController.applyToCampaign);
router.put('/update-email', authMiddleware(['influencer', 'brand']), UserController.updateEmail);
router.post('/insert-report', authMiddleware(['influencer', 'brand']), reportController.insertReport);

// New search route
router.get('/search', authMiddleware(['influencer', 'brand']), UserController.searchUsers);

module.exports = router;