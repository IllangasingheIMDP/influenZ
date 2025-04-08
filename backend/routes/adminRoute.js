const express = require('express');
const AdminController = require('../controllers/adminController');
const influencerController = require('../controllers/influencerController');
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.get('/is-admin',authMiddleware(['admin']) , AdminController.isAdmin);
router.post('/verify-influencer',authMiddleware(['admin']), influencerController.verifyInfluencer);
router.post('/reject-influencer',authMiddleware(['admin']), influencerController.rejectInfluencer);
router.get('/get-all-influencers',authMiddleware(['admin']), influencerController.getAllInfluencers);
router.get('/get-verified-influencers',authMiddleware(['admin']), influencerController.getAllInfluencersVerified);
router.get('/get-pending-influencers',authMiddleware(['admin']), influencerController.getAllInfluencersPending);
router.get('/get-reports-from-influencers',authMiddleware(['admin']), AdminController.getReportsFromInfluencers);
router.get('/get-reports-from-brands',authMiddleware(['admin']), AdminController.getReportsFromBrands);
router.post('/changestatus',authMiddleware(['admin']), AdminController.changeStatus);


module.exports = router;