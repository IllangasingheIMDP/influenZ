const express = require('express');
const YoutubeController = require('../controllers/youtubeController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Start YouTube OAuth flow (no auth required)
router.get('/auth',authMiddleware(['influencer']), YoutubeController.startAuth);
router.get('/get-auth-url', authMiddleware(['influencer']), YoutubeController.getAuthUrl);
// Handle OAuth callback (no auth required)
router.get('/callback', YoutubeController.handleCallback);

router.get('/playlists', authMiddleware(['influencer', 'brand', 'admin']), YoutubeController.getPlaylists);
router.get('/playlist-videos/:playlistId', authMiddleware(['influencer', 'brand', 'admin']), YoutubeController.getPlaylistVideos);
router.get('/demographics/:userId', authMiddleware(['influencer', 'brand', 'admin']), YoutubeController.getDemographics);
router.get('/video-performance/:videoId', authMiddleware(['influencer', 'brand', 'admin']), YoutubeController.getVideoPerformance);
router.delete('/disconnect', authMiddleware(['influencer', 'admin']), YoutubeController.disconnectYouTube);

// Protected routes (require JWT and influencer type)
router.get('/profile/:userId', authMiddleware(['influencer', 'brand', 'admin']), YoutubeController.getProfile);
router.get('/video/:videoId', authMiddleware(['influencer', 'brand', 'admin']), YoutubeController.getVideoMetrics);
router.get('/average-metrics/:userId', authMiddleware(['influencer', 'brand', 'admin']), YoutubeController.getAverageMetrics);
router.get('/audience-countries', authMiddleware(['influencer', 'brand', 'admin']), YoutubeController.getAudienceCountries); // Updated route
router.get('/channel-performance/:userId', authMiddleware(['influencer', 'brand', 'admin']), YoutubeController.getChannelPerformance);
router.get('/all-data/:userId', authMiddleware(['influencer', 'brand', 'admin']), YoutubeController.getAllYoutubeData);
router.get('/all-influencer-metrics', authMiddleware(['influencer', 'brand', 'admin']), YoutubeController.getAllInfluencerMetrics);
module.exports = router;