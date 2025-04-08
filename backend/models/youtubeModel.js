const pool = require('../db');

const YoutubeModel = {
  // Save or update tokens for a user
  saveTokens: async (userId, tokens) => {
    const query = `
      INSERT INTO youtube_tokens (user_id, access_token, refresh_token, expiry_date)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id)
      DO UPDATE SET access_token = $2, refresh_token = $3, expiry_date = $4
    `;
    const values = [
      userId,
      tokens.access_token,
      tokens.refresh_token,
      tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    ];
    await pool.query(query, values);
  },

  // Get tokens for a user
  getTokens: async (userId) => {
    const query = 'SELECT * FROM youtube_tokens WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  },
  // Delete tokens for a user
  deleteTokens: async (userId) => {
    const query = 'DELETE FROM youtube_tokens WHERE user_id = $1';
    await pool.query(query, [userId]);
  },
  // New methods for metrics (using influencer_id)
  saveMetrics: async (influencerId, metrics) => {
    const query = `
      INSERT INTO influencer_youtube_metrics (
        influencer_id, total_subscribers, total_views, total_videos,
        avg_likes_per_video, avg_engagement_per_video, last_updated
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (influencer_id)
      DO UPDATE SET
        total_subscribers = $2,
        total_views = $3,
        total_videos = $4,
        avg_likes_per_video = $5,
        avg_engagement_per_video = $6,
        last_updated = NOW()
    `;
    const values = [
      influencerId,
      metrics.totalSubscribers,
      metrics.totalViews,
      metrics.totalVideos,
      metrics.avgLikesPerVideo,
      metrics.avgEngagementPerVideo,
    ];
    await pool.query(query, values);
  },
  getAllInfluencersMetrics: async () => {
    const query = 'SELECT * FROM influencer_youtube_metrics';
    const result = await pool.query(query);
    return result.rows;
  },

  getMetrics: async (influencerId) => {
    const query = 'SELECT * FROM influencer_youtube_metrics WHERE influencer_id = $1';
    const result = await pool.query(query, [influencerId]);
    return result.rows[0] || null;
  },

  saveChannelPerformance: async (influencerId, performanceData) => {
    try {
      // Using transaction for batch insert
      await pool.query('BEGIN');
      
      for (const day of performanceData) {
        await pool.query(`
          INSERT INTO youtube_channel_performance (
            influencer_id, date, views, likes, comments, shares
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (influencer_id, date)
          DO UPDATE SET
            views = EXCLUDED.views,
            likes = EXCLUDED.likes,
            comments = EXCLUDED.comments,
            shares = EXCLUDED.shares,
            last_updated = NOW()
        `, [
          influencerId,
          day.date,
          day.views || 0,
          day.likes || 0,
          day.comments || 0,
          day.shares || 0
        ]);
      }
      
      await pool.query('COMMIT');
      return true;
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Error saving channel performance:', error);
      throw error;
    }
  },
  saveTitleDescription:async (influencerId, title, description) => {
    try {
      await pool.query(`
        INSERT INTO influencer_youtube_metrics (influencer_id, title, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (influencer_id)
        DO UPDATE SET
          title = $2,
          description = $3,
          last_updated = NOW()
      `, [influencerId, title, description]);
      return true;
    } catch (error) {
      console.error('Error saving title and description:', error);
      throw error;
    }
  },
  getTitleDescription: async (influencerId) => {
    try {
      const result = await pool.query(`
        SELECT title, description
        FROM influencer_youtube_metrics
        WHERE influencer_id = $1
      `, [influencerId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching title and description:', error);
      throw error;
    }
  },
  // Get stored performance data
  getChannelPerformance: async (influencerId, startDate, endDate) => {
    try {
      const result = await pool.query(`
        SELECT date, views, likes, comments, shares
        FROM youtube_channel_performance
        WHERE influencer_id = $1
        AND date BETWEEN $2 AND $3
        ORDER BY date ASC
      `, [influencerId, startDate, endDate]);
      
      return result.rows;
    } catch (error) {
      console.error('Error fetching channel performance:', error);
      throw error;
    }
  },
  // New methods for demographics (using influencer_id)
  saveDemographics: async (influencerId, demographics) => {
    // Delete existing demographics for this influencer
    
    const query = `
      INSERT INTO youtube_audience_demographics (
    influencer_id, dimension, value, viewer_percentage, last_updated
)
VALUES ($1, $2, $3, $4, NOW())
ON CONFLICT (influencer_id, dimension, value)
DO UPDATE SET
    viewer_percentage = EXCLUDED.viewer_percentage,
    last_updated = NOW()
    `;

    // Insert gender data
    for (const gender of demographics.gender || []) {
      await pool.query(query, [influencerId, 'gender', gender.gender, gender.viewerPercentage]);
    }
    // Insert age group data
    for (const ageGroup of demographics.ageGroup || []) {
      await pool.query(query, [influencerId, 'ageGroup', ageGroup.ageGroup, ageGroup.viewerPercentage]);
    }
    // Insert country data
    for (const country of demographics.country || []) {
      await pool.query(query, [influencerId, 'country', country.country, country.viewerPercentage]);
    }
  },

  saveCountries: async (influencerId, languages) => {
    const query = `
      INSERT INTO youtube_audience_demographics (influencer_id, dimension, value, viewer_percentage, last_updated)
      VALUES ($1, 'country', $2, $3, NOW())
      ON CONFLICT (influencer_id, dimension, value)
      DO UPDATE SET viewer_percentage = $3, last_updated = NOW()
    `;
    for (const lang of languages) {
      await pool.query(query, [influencerId, lang.language, lang.percentage]);
    }
  },

  getDemographics: async (influencerId) => {
    const query = 'SELECT dimension, value, viewer_percentage FROM youtube_audience_demographics WHERE influencer_id = $1';
    const result = await pool.query(query, [influencerId]);
    const demographics = { gender: [], ageGroup: [], country: [], language: [] };
    result.rows.forEach(row => {
      if (row.dimension === 'gender') demographics.gender.push({ gender: row.value, viewerPercentage: row.viewer_percentage });
      else if (row.dimension === 'ageGroup') demographics.ageGroup.push({ ageGroup: row.value, viewerPercentage: row.viewer_percentage });
      else if (row.dimension === 'country') demographics.country.push({ country: row.value, viewerPercentage: row.viewer_percentage });
      else if (row.dimension === 'language') demographics.language.push({ language: row.value, percentage: row.viewer_percentage });
    });
    return demographics;
  },
};

module.exports = YoutubeModel;