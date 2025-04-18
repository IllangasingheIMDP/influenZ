const { google } = require('googleapis');
const pool = require('../db');
const YoutubeModel = require('../models/youtubeModel');
const influencerModel = require('../models/influencerModel');
// OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const scopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
];

const YoutubeController = {
  // Start OAuth flow
  startAuth: (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: JSON.stringify({ userId: req.user?.userId || null }), // Pass user ID if logged in
    });
    console.log('Generated OAuth URL:', authUrl); // Debug
    res.redirect(authUrl);
  },
  getAuthUrl: (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: JSON.stringify({ userId: req.user.userId }),
    });
    console.log(req.user);
    res.json({success: true, authUrl: authUrl });
  },

  // Handle OAuth callback
  handleCallback: async (req, res) => {
    const { code, state } = req.query;
    const { userId } = JSON.parse(state || '{}');
  
    if (!userId) {
      return res.status(400).json({ message: 'User ID missing in state' });
    }
  
    try {
      const { tokens } = await oauth2Client.getToken(code);
      await YoutubeModel.saveTokens(userId, tokens);
      res.redirect('https://influen-z-git-main-dasun-illangasinghes-projects.vercel.app/influencer/verification');
    } catch (error) {
      console.error('Error in OAuth callback:', error);
      res.status(500).json({ message: 'Authentication failed' });
    }
  },
  getAllYoutubeData: async (req, res) => {
    const { userId } = req.params;
    try {
      // Authenticate and get tokens
      const tokens = await YoutubeModel.getTokens(userId);
      if (!tokens) {
        return res.status(401).json({ success: false, message: 'YouTube not connected' });
      }
      oauth2Client.setCredentials(tokens);

      const influencerId = await influencerModel.getInfluencerId(userId);
      if (!influencerId) {
        return res.status(404).json({ success: false, message: 'Influencer profile not found' });
      }

      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
      const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: oauth2Client });
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = '2023-01-01';

      // Helper function to check data freshness
      const isDataFresh = (lastUpdated, thresholdHours = 24) => {
        if (!lastUpdated) return false;
        const now = new Date();
        const diffMs = now - new Date(lastUpdated);
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours < thresholdHours;
      };

      // Fetch Profile Data
      const fetchProfile = async () => {
        const stored = await YoutubeModel.getTitleDescription(influencerId);
        if (stored && isDataFresh(stored.last_updated)) {
          return { success: true, data: stored, source: 'database' };
        }
        try {
          const response = await youtube.channels.list({ part: 'snippet', mine: true });
          const channel = response.data.items[0];
          const profile = { title: channel.snippet.title, description: channel.snippet.description };
          await YoutubeModel.saveTitleDescription(influencerId, profile.title, profile.description);
          return { success: true, data: profile, source: 'api' };
        } catch (error) {
          console.warn('Profile API failed:', error.message);
          if (stored) return { success: true, data: stored, source: 'database' };
          return { success: false, error: error.message };
        }
      };

      // Fetch Average Metrics
      const fetchMetrics = async () => {
        const stored = await YoutubeModel.getMetrics(influencerId);
        if (stored && isDataFresh(stored.last_updated)) {
          return { success: true, data: stored, source: 'database' };
        }
        try {
          const [channelRes, searchRes] = await Promise.all([
            youtube.channels.list({ part: 'statistics', mine: true }),
            youtube.search.list({ part: 'id', mine: true, type: 'video', maxResults: 50 }),
          ]);
          const channel = channelRes.data.items[0];
          const videoIds = searchRes.data.items.map(item => item.id.videoId);
          const videosRes = await youtube.videos.list({ part: 'statistics', id: videoIds.join(',') });
          const videos = videosRes.data.items;

          const totalLikes = videos.reduce((sum, v) => sum + (parseInt(v.statistics.likeCount) || 0), 0);
          const totalComments = videos.reduce((sum, v) => sum + (parseInt(v.statistics.commentCount) || 0), 0);
          const videoCount = videos.length;

          const metrics = {
            totalSubscribers: parseInt(channel.statistics.subscriberCount),
            totalViews: parseInt(channel.statistics.viewCount),
            totalVideos: parseInt(channel.statistics.videoCount),
            avgLikesPerVideo: videoCount ? totalLikes / videoCount : 0,
            avgEngagementPerVideo: videoCount ? (totalLikes + totalComments) / videoCount : 0,
          };
          await YoutubeModel.saveMetrics(influencerId, metrics);
          return { success: true, data: metrics, source: 'api' };
        } catch (error) {
          console.warn('Metrics API failed:', error.message);
          if (stored) return { success: true, data: stored, source: 'database' };
          return { success: false, error: error.message };
        }
      };

      // Fetch Demographics
      const fetchDemographics = async () => {
        const stored = await YoutubeModel.getDemographics(influencerId);
        if (stored && stored.gender.length && isDataFresh(stored.last_updated)) {
          return { success: true, data: stored, source: 'database' };
        }
        try {
          const [genderRes, ageRes, countryRes] = await Promise.all([
            youtubeAnalytics.reports.query({
              ids: 'channel==MINE', startDate, endDate, metrics: 'viewerPercentage', dimensions: 'gender',
            }),
            youtubeAnalytics.reports.query({
              ids: 'channel==MINE', startDate, endDate, metrics: 'viewerPercentage', dimensions: 'ageGroup',
            }),
            youtubeAnalytics.reports.query({
              ids: 'channel==MINE', startDate, endDate, metrics: 'views', dimensions: 'country',
            }),
          ]);

          const totalCountryViews = countryRes.data.rows.reduce((sum, row) => sum + row[1], 0);
          const demographics = {
            gender: (genderRes.data.rows || []).map(row => ({ gender: row[0], viewerPercentage: row[1] })),
            ageGroup: (ageRes.data.rows || []).map(row => ({ ageGroup: row[0], viewerPercentage: row[1] })),
            country: (countryRes.data.rows || []).map(row => ({
              country: row[0],
              viewerPercentage: totalCountryViews > 0 ? (row[1] / totalCountryViews) * 100 : 0,
            })),
          };
          await YoutubeModel.saveDemographics(influencerId, demographics);
          return { success: true, data: demographics, source: 'api' };
        } catch (error) {
          console.warn('Demographics API failed:', error.message);
          if (stored && stored.gender.length) return { success: true, data: stored, source: 'database' };
          return { success: false, error: error.message };
        }
      };

      // Fetch Channel Performance
      const fetchPerformance = async () => {
        const stored = await YoutubeModel.getChannelPerformance(influencerId, startDate, endDate);
        if (stored.length && isDataFresh(stored[0].last_updated)) {
          return { success: true, data: stored, source: 'database' };
        }
        try {
          const response = await youtubeAnalytics.reports.query({
            ids: 'channel==MINE', startDate, endDate, metrics: 'views,likes,comments,shares', dimensions: 'day',
          });
          const performance = (response.data.rows || []).map(row => ({
            date: row[0], views: row[1], likes: row[2], comments: row[3], shares: row[4],
          }));
          await YoutubeModel.saveChannelPerformance(influencerId, performance);
          return { success: true, data: performance, source: 'api' };
        } catch (error) {
          console.warn('Performance API failed:', error.message);
          if (stored.length) return { success: true, data: stored, source: 'database' };
          return { success: false, error: error.message };
        }
      };

      // Fetch all data concurrently
      const [profileRes, metricsRes, demoRes, perfRes] = await Promise.all([
        fetchProfile(),
        fetchMetrics(),
        fetchDemographics(),
        fetchPerformance(),
      ]);

      // Construct response
      res.json({
        success: true,
        profile: profileRes,
        metrics: metricsRes,
        demographics: demoRes,
        performance: perfRes,
      });
    } catch (error) {
      console.error('Error in getAllYoutubeData:', error);
      res.status(500).json({ success: false, message: 'Error fetching YouTube data', details: error.message });
    }
  },
  // Get YouTube profile data
  // Get YouTube channel statistics
  getProfile: async (req, res) => {
    const {userId} = req.params; // From auth middleware
    try {
      const tokens = await YoutubeModel.getTokens(userId);
      if (!tokens) {
        return res.status(401).json({ message: 'YouTube not connected' });
      }
      const influencer_id = await influencerModel.getInfluencerId(userId);
      if (!influencer_id) {
        return res.status(404).json({ message: 'Influencer profile not found' });
      }
      try{
      oauth2Client.setCredentials(tokens);
      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
      const response = await youtube.channels.list({
        part: 'snippet',
        mine: true,
      });
      const channel = response.data.items[0];
      
      await YoutubeModel.saveTitleDescription(influencer_id, channel.snippet.title, channel.snippet.description);
      res.json({success: true,
        title: channel.snippet.title,
        description: channel.snippet.description,
      });
      } catch (apiError) {
        console.warn('API failed, falling back to stored profile:', apiError);
        // Fallback to stored data
        const storedTitleDescription = await YoutubeModel.getTitleDescription(influencer_id);
        if (storedTitleDescription) {
          return res.json({ 
            success: true, 
            title: storedTitleDescription.title,
        description: storedTitleDescription.description,
          });
        }
        throw apiError;
      }
  
    } catch (error) {
      console.error('Error in profile:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error calculating profile',
        details: error.message 
      });
    }
  },

  getAllInfluencerMetrics: async (req, res) => {
    try {
      const influencerMatrics = await YoutubeModel.getAllInfluencersMetrics();
      res.status(200).json({success: true, influencerMatrics});
    } catch (error) {
      console.log(error);
      res.status(500).json({success: false, message: 'Error fetching influencer metrics'});
    }

  },

  getAverageMetrics: async (req, res) => {
    const {userId} = req.params;
    try {
      const tokens = await YoutubeModel.getTokens(userId);
      if (!tokens) {
        return res.status(401).json({success: false, message: 'YouTube not connected' });
      }
      const influencerId = await influencerModel.getInfluencerId(userId);
      if (!influencerId) {
        return res.status(404).json({success: false, message: 'Influencer profile not found' });
      }
      try{
      oauth2Client.setCredentials(tokens);
      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

      // Fetch channel stats
      const channelResponse = await youtube.channels.list({
        part: 'statistics',
        mine: true,
      });
      const channel = channelResponse.data.items[0];

      // Fetch recent videos for average metrics
      const searchResponse = await youtube.search.list({
        part: 'id',
        mine: true,
        type: 'video',
        maxResults: 50,
      });
      const videoIds = searchResponse.data.items.map(item => item.id.videoId);
      const videosResponse = await youtube.videos.list({
        part: 'statistics',
        id: videoIds.join(','),
      });

      const videos = videosResponse.data.items;
      const totalLikes = videos.reduce((sum, video) => sum + (parseInt(video.statistics.likeCount) || 0), 0);
      const totalComments = videos.reduce((sum, video) => sum + (parseInt(video.statistics.commentCount) || 0), 0);
      const videoCount = videos.length;

      const metrics = {
        totalSubscribers: parseInt(channel.statistics.subscriberCount),
        totalViews: parseInt(channel.statistics.viewCount),
        totalVideos: parseInt(channel.statistics.videoCount),
        avgLikesPerVideo: videoCount ? totalLikes / videoCount : 0,
        avgEngagementPerVideo: videoCount ? (totalLikes + totalComments) / videoCount : 0,
      };

      
      await YoutubeModel.saveMetrics(influencerId, metrics);
      res.json({success: true, metrics:metrics});
      }catch (apiError) {
        console.warn('API failed, falling back to stored metrics:', apiError);
        // Fallback to stored data
        const storedMetrics = await YoutubeModel.getMetrics(influencerId);
        if (storedMetrics) {
          return res.json({ 
            success: true, 
            metrics: {
              totalSubscribers: storedMetrics.total_subscribers,
              totalViews: storedMetrics.total_views,
              totalVideos: storedMetrics.total_videos,
              avgLikesPerVideo: storedMetrics.avg_likes_per_video,
              avgEngagementPerVideo: storedMetrics.avg_engagement_per_video
            },
            source: 'database',
            message: 'Using cached data due to API error'
          });
        }
        throw apiError;
      }
  
    } catch (error) {
      console.error('Error in average metrics:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error calculating metrics',
        details: error.message 
      });
    }
  },

  getDemographics: async (req, res) => {
    const {userId} = req.params;
    
    try {
      
      const tokens = await YoutubeModel.getTokens(userId);
      if (!tokens) {
        return res.status(401).json({ success: false, message: 'YouTube not connected' });
      }
      const influencerId = await influencerModel.getInfluencerId(userId);
      if (!influencerId) {
        return res.status(404).json({ success: false, message: 'Influencer profile not found' });
      }
      try{
      oauth2Client.setCredentials(tokens);
      const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: oauth2Client });
  
      const startDate = '2023-01-01';
      const endDate = new Date().toISOString().split('T')[0];
  
      // Fetch gender demographics
      const genderResponse = await youtubeAnalytics.reports.query({
        ids: 'channel==MINE',
        startDate,
        endDate,
        metrics: 'viewerPercentage',
        dimensions: 'gender',
      });
  
      // Fetch age group demographics
      const ageResponse = await youtubeAnalytics.reports.query({
        ids: 'channel==MINE',
        startDate,
        endDate,
        metrics: 'viewerPercentage',
        dimensions: 'ageGroup',
      });
  
      // Fetch country demographics using 'views' instead of 'viewerPercentage'
      const countryResponse = await youtubeAnalytics.reports.query({
        ids: 'channel==MINE',
        startDate,
        endDate,
        metrics: 'views',
        dimensions: 'country',
      });
  
      // Process country data to calculate percentages
      let countryData = [];
      if (countryResponse.data.rows && countryResponse.data.rows.length > 0) {
        const totalViews = countryResponse.data.rows.reduce((sum, row) => sum + row[1], 0);
        countryData = countryResponse.data.rows.map(row => ({
          country: row[0],
          viewerPercentage: totalViews > 0 ? (row[1] / totalViews) * 100 : 0,
        }));
      }
  
      const demographics = {
        gender: (genderResponse.data.rows || []).map(row => ({ gender: row[0], viewerPercentage: row[1] })),
        ageGroup: (ageResponse.data.rows || []).map(row => ({ ageGroup: row[0], viewerPercentage: row[1] })),
        country: countryData,
      };
  

  
      // Save demographics data to the database
      await YoutubeModel.saveDemographics(influencerId, demographics);
      res.json({ success: true, demographics:demographics });
    }catch (apiError) {
      console.warn('API failed, falling back to stored data:', apiError);
      // Fallback to stored data
      const storedDemographics = await YoutubeModel.getDemographics(influencerId);
      if (storedDemographics.gender.length || storedDemographics.ageGroup.length || storedDemographics.country.length) {
        return res.json({ 
          success: true, 
          demographics: storedDemographics,
          source: 'database',
          message: 'Using cached data due to API error' 
        });
      }
      throw apiError; // If no stored data exists, rethrow the error
    }

  } catch (error) {
    console.error('Error in demographics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching demographics',
      details: error.message 
    });
  }
},
/*******  cd22d4f7-297f-45a6-9430-9fcd726b1aa9  *******/

  getAudienceCountries: async (req, res) => {
    const userId = req.user.userId;
    try {
      const influencerId = await influencerModel.getInfluencerId(userId);
      if (!influencerId) {
        return res.status(404).json({success: false, message: 'Influencer profile not found' });
      }
      const tokens = await YoutubeModel.getTokens(userId);
      if (!tokens) {
        return res.status(401).json({success: false, message: 'YouTube not connected' });
      }
      try{
      oauth2Client.setCredentials(tokens);
      const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: oauth2Client });
  
      // Fetch country data from YouTube Analytics using 'views' metric
      const startDate = '2023-01-01';
      const endDate = new Date().toISOString().split('T')[0];
      const response = await youtubeAnalytics.reports.query({
        ids: 'channel==MINE',
        startDate,
        endDate,
        metrics: 'views',
        dimensions: 'country',
      });
  
      // Process the response
      let countryData = [];
      if (response.data.rows && response.data.rows.length > 0) {
        // Calculate total views across all countries
        const totalViews = response.data.rows.reduce((sum, row) => sum + row[1], 0);
  
        // Compute percentage for each country
        countryData = response.data.rows.map(row => ({
          country: row[0], // Country code (e.g., 'US', 'ES')
          percentage: totalViews > 0 ? (row[1] / totalViews) * 100 : 0, // views / totalViews * 100
        }));
      }
  
    
  
      // Check if influencer_id exists in the influencers table
  
      await YoutubeModel.saveCountries(influencerId, countryData);
      res.json({success: false,countryData});
    }catch (apiError) {
      console.warn('API failed, falling back to stored countries:', apiError);
      // Fallback to stored data
      const storedDemographics = await YoutubeModel.getDemographics(influencerId);
      if (storedDemographics.country.length > 0) {
        return res.json({ 
          success: true, 
          countryData: storedDemographics.country,
          source: 'database',
          message: 'Using cached data due to API error'
        });
      }
      throw apiError;
    }

  } catch (error) {
    console.error('Error in audience countries:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching country data',
      details: error.message 
    });
  }
},
  getChannelPerformance: async (req, res) => {
    const {userId} = req.params;
    try {
      const tokens = await YoutubeModel.getTokens(userId);
      if (!tokens) {
        return res.status(401).json({success: false, message: 'YouTube not connected' });
      }
      const influencerId = await influencerModel.getInfluencerId(userId);
      if (!influencerId) {
        return res.status(404).json({success: false, message: 'Influencer profile not found' });
      }
  
      oauth2Client.setCredentials(tokens);
      const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: oauth2Client });
      const response = await youtubeAnalytics.reports.query({
        ids: 'channel==MINE',
        startDate: '2023-01-01',
        endDate: new Date().toISOString().split('T')[0],
        metrics: 'views,likes,comments,shares',
        dimensions: 'day',
      });
  
      const performance = response.data.rows.map(row => ({
        date: row[0],
        views: row[1],
        likes: row[2],
        comments: row[3],
        shares: row[4],
      }));
      await YoutubeModel.saveChannelPerformance(influencerId, performance);
      res.json({success: true, performance:performance});
    } catch (error) {
      try {
        const storedData = await YoutubeModel.getChannelPerformance(
          influencerId,
          '2023-01-01',
          new Date().toISOString().split('T')[0]
        );
        return res.json({ 
          success: true, 
          performance: storedData,
          message: 'Using cached data due to API error'
        });
      } catch (dbError) {
        res.status(500).json({ 
          success: false, 
          message: 'Error fetching channel performance' 
        });
      }
      console.error('Error fetching channel performance:', error);
      res.status(500).json({success: false, message: 'Error fetching channel performance' });
    }
  },

  // Get video metrics
  getVideoMetrics: async (req, res) => {
    const userId = req.user.userId;
    const { videoId } = req.params;

    try {
      const tokens = await YoutubeModel.getTokens(userId);
      if (!tokens) {
        return res.status(401).json({success: false,  message: 'YouTube not connected' });
      }

      oauth2Client.setCredentials(tokens);
      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
      const response = await youtube.videos.list({
        part: 'statistics,snippet',
        id: videoId,
      });

      if (!response.data.items.length) {
        return res.status(404).json({success: false,  message: 'Video not found' });
      }

      const video = response.data.items[0];
      res.json({
        success: true,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        commentCount: video.statistics.commentCount,
        title: video.snippet.title,
        description: video.snippet.description,
      });
    } catch (error) {
      console.error('Error fetching video metrics:', error);
      res.status(500).json({success: false,  message: 'Error fetching video data' });
    }
  },

  // Get user's playlists
  getPlaylists: async (req, res) => {
    const userId = req.user.userId;
    try {
      const tokens = await YoutubeModel.getTokens(userId);
      if (!tokens) {
        return res.status(401).json({success: false,  message: 'YouTube not connected' });
      }

      oauth2Client.setCredentials(tokens);
      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
      const response = await youtube.playlists.list({
        part: 'snippet,contentDetails',
        mine: true,
        maxResults: 50,
      });

      const playlists = response.data.items.map((item) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        videoCount: item.contentDetails.itemCount,
      }));
      res.json({success: true, playlists});
    } catch (error) {
      console.error('Error fetching playlists:', error);
      res.status(500).json({success: false,  message: 'Error fetching playlists' });
    }
  },

  // Get videos in a playlist
  getPlaylistVideos: async (req, res) => {
    const userId = req.user.userId;
    const { playlistId } = req.params;

    try {
      const tokens = await YoutubeModel.getTokens(userId);
      if (!tokens) {
        return res.status(401).json({success: false,  message: 'YouTube not connected' });
      }

      oauth2Client.setCredentials(tokens);
      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
      const response = await youtube.playlistItems.list({
        part: 'snippet,contentDetails',
        playlistId: playlistId,
        maxResults: 50,
      });

      const videos = response.data.items.map((item) => ({
        videoId: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        position: item.snippet.position,
      }));
      res.json({success: true, videos});
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
      res.status(500).json({success: false,  message: 'Error fetching playlist videos' });
    }
  },

  // Get audience demographics (Analytics API)
  // getDemographics: async (req, res) => {
  //   const userId = req.user.userId;
  //   try {
  //     const tokens = await YoutubeModel.getTokens(userId);
  //     if (!tokens) {
  //       return res.status(401).json({success: false,  message: 'YouTube not connected' });
  //     }

  //     oauth2Client.setCredentials(tokens);
  //     const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: oauth2Client });
  //     const response = await youtubeAnalytics.reports.query({
  //       ids: 'channel==MINE',
  //       startDate: '2024-01-01', // Adjust as needed
  //       endDate: '2025-04-04',  // Current date or adjust
  //       metrics: 'viewerPercentage',
  //       dimensions: 'ageGroup,gender',
  //     });

  //     res.json( response.data.rows.map(row => ({
  //       ageGroup: row[0],
  //       gender: row[1],
  //       viewerPercentage: row[2],
  //     })));
  //   } catch (error) {
  //     console.error('Error fetching demographics:', error);
  //     res.status(500).json({success: false,  message: 'Error fetching demographics' });
  //   }
  // },

  // Get video performance over time (Analytics API)
  getVideoPerformance: async (req, res) => {
    const userId = req.user.userId;
    const { videoId } = req.params;

    try {
      const tokens = await YoutubeModel.getTokens(userId);
      if (!tokens) {
        return res.status(401).json({success: false,  message: 'YouTube not connected' });
      }

      oauth2Client.setCredentials(tokens);
      const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: oauth2Client });
      const response = await youtubeAnalytics.reports.query({
        ids: 'channel==MINE',
        startDate: '2024-01-01', // Adjust as needed
        endDate: '2025-04-04',  // Current date or adjust
        metrics: 'views,likes,comments,shares',
        dimensions: 'day',
        filters: `video==${videoId}`,
      });

      res.json(response.data.rows.map(row => ({
        date: row[0],
        views: row[1],
        likes: row[2],
        comments: row[3],
        shares: row[4],
      })));
    } catch (error) {
      console.error('Error fetching video performance:', error);
      res.status(500).json({success: false,  message: 'Error fetching video performance' });
    }
  },

  // Disconnect YouTube account
  disconnectYouTube: async (req, res) => {
    const userId = req.user.userId;
    try {
      await YoutubeModel.deleteTokens(userId);
      res.json({ message: 'YouTube account disconnected' });
    } catch (error) {
      console.error('Error disconnecting YouTube:', error);
      res.status(500).json({ message: 'Error disconnecting YouTube' });
    }
  },

  // Get video metrics
  getVideoMetrics: async (req, res) => {
    const userId = req.user.userId;
    const { videoId } = req.params;

    try {
      const tokens = await YoutubeModel.getTokens(userId);
      if (!tokens) {
        return res.status(401).json({ message: 'YouTube not connected' });
      }

      oauth2Client.setCredentials(tokens);
      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
      const response = await youtube.videos.list({
        part: 'statistics',
        id: videoId,
      });

      if (!response.data.items.length) {
        return res.status(404).json({ message: 'Video not found' });
      }

      res.json(response.data.items[0].statistics);
    } catch (error) {
      console.error('Error fetching video metrics:', error);
      res.status(500).json({ message: 'Error fetching video data' });
    }
  },
  // In YoutubeController.js
 
};

module.exports = YoutubeController;