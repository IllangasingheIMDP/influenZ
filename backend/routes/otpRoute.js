const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const otpController = require('../controllers/otpController');
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 requests per window
});
router.post('/send-otp',authMiddleware(['influencer']), limiter,otpController.sendOTP);
router.post('/verify-otp',authMiddleware(['influencer']), otpController.verifyOTP);

module.exports = router;