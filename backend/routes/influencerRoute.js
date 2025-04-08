const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const InfluencerController = require('../controllers/influencerController');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

router.get('/verification-step', authMiddleware(['influencer','brand','admin']), InfluencerController.getVerificationStep);
router.post('/upload-identity', authMiddleware(['influencer']), upload.single('file'), InfluencerController.uploadIdentityCard);
router.post('/submit-social-media', authMiddleware(['influencer']), InfluencerController.submitSocialMedia);
router.get('/verification-status', authMiddleware(['influencer', 'brand','admin']), InfluencerController.getVerificationStatus);
router.get('/influencerId', authMiddleware(['influencer','brand','admin']), InfluencerController.getInfluencerId);
router.post('/upload-profile-pic', authMiddleware(['influencer']), upload.single('file'), InfluencerController.uploadProfileImage);
router.get('/profile-pic/:userId',authMiddleware(['influencer','brand','admin']), InfluencerController.getProfilePic);
router.get('/profile/:userId', authMiddleware(['influencer','brand','admin']), InfluencerController.getInfluencerProfile);
router.put('/update-tags', authMiddleware(['influencer']), InfluencerController.updateTags);
router.get('/verified-influencers-and-brands', authMiddleware(['admin','brand','influencer']), InfluencerController.getAllInfluencersVerified);

module.exports = router;