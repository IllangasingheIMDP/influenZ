const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const campaignController = require('../controllers/campaignController');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/campaigncarddetails', authMiddleware(['influencer']), campaignController.getCampaignCardDetails);
module.exports = router;