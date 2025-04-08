const express = require('express');
const authController = require('../controllers/authController');
const BrandController  = require('../controllers/brandController');
const influencerController = require('../controllers/influencerController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create_campaign',authMiddleware(['brand']),BrandController.createCampaign);
//router.get('/add-tasks',authMiddleware(['brand']),BrandController.addTask)
router.get('/active-campaigns/:userId', authMiddleware(['brand']), BrandController.getActiveCampaigns);
router.get("/addtask/:campaign_id",authMiddleware(['brand']), BrandController.getTasks);
router.post("/addtask/:campaign_id",authMiddleware(['brand']), BrandController.createTask);
router.get("/tasks/:campaign_id", BrandController.getTasksofCampaign);
router.get("/get-verified-influencers",authMiddleware(['brand','influencer']), influencerController.getAllInfluencersVerified);
router.get("/applied-influencers",authMiddleware(['brand']), BrandController.getAppliedInfluencers);
router.put('/reject', authMiddleware(['brand']), BrandController.rejectInfluencer);
router.post("/accept-applicant",authMiddleware(['brand']), BrandController.acceptApplicant);
router.get('/details/:userId', authMiddleware(['brand','influencer']), BrandController.getUserBrands);
router.get("/most-interacted/:userId", authMiddleware(['brand']), BrandController.getMostInteractedInfluencers);
router.get('/notifications',authMiddleware(['brand']), BrandController.getNotifications);
router.patch('/notifications/:notificationId/read',authMiddleware(['brand']), BrandController.markAsRead);
router.get('/company-pics', BrandController.getCompanyPics);
router.get('/influencers', BrandController.fetchInfluencers);

module.exports = router;