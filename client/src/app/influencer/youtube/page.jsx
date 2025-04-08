// app/influencer/youtube/page.jsx
'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api'; // Import your axios instance

export default function YoutubeDashboard() {
    const [profileData, setProfileData] = useState(null);
    const [videoMetrics, setVideoMetrics] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [playlistVideos, setPlaylistVideos] = useState([]);
    const [demographics, setDemographics] = useState([]);
    const [videoPerformance, setVideoPerformance] = useState([]);
    const [videoId, setVideoId] = useState('');
    const [playlistId, setPlaylistId] = useState('');
    const [error, setError] = useState(null);

  // Fetch profile data on mount (after OAuth redirect)
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Connect YouTube account
  const connectYouTube = async () => {
    try {
      const response = await api.get('/youtube/get-auth-url');
       
      const data = await response.data;
      if (data.success) {
        window.location.href = data.authUrl;
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect YouTube');
    }
  };

  // Fetch profile data (subscriber count)
  const fetchProfileData = async () => {
    try {
      const response = await api.get('/youtube/profile');
      setProfileData(response.data);
    } catch (err) {
      setError(err.response?.status === 401 ? 'Please connect YouTube' : 'Error fetching profile');
    }
  };

  const fetchVideoMetrics = async () => {
    try {
      const response = await api.get(`/youtube/video/${videoId}`);
      setVideoMetrics(response.data);
    } catch (err) {
      setError('Error fetching video metrics');
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await api.get('/youtube/playlists');
      setPlaylists(response.data);
    } catch (err) {
      setError('Error fetching playlists');
    }
  };

  const fetchPlaylistVideos = async () => {
    try {
      const response = await api.get(`/youtube/playlist-videos/${playlistId}`);
      setPlaylistVideos(response.data);
    } catch (err) {
      setError('Error fetching playlist videos');
    }
  };

  const fetchDemographics = async () => {
    try {
      const response = await api.get('/youtube/demographics');
      setDemographics(response.data);
    } catch (err) {
      setError('Error fetching demographics');
    }
  };

  const fetchVideoPerformance = async () => {
    try {
      const response = await api.get(`/youtube/video-performance/${videoId}`);
      setVideoPerformance(response.data);
    } catch (err) {
      setError('Error fetching video performance');
    }
  };

  const disconnectYouTube = async () => {
    try {
      await api.delete('/youtube/disconnect');
      setProfileData(null);
      setVideoMetrics(null);
      setPlaylists([]);
      setPlaylistVideos([]);
      setDemographics([]);
      setVideoPerformance([]);
      setError('YouTube disconnected');
    } catch (err) {
      setError('Error disconnecting YouTube');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-red-600 mb-2">YouTube Dashboard</h1>
        <div className="h-1 w-24 bg-red-600"></div>
      </header>
      
      {!profileData && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <img src="/youtube-logo.svg" alt="YouTube" className="w-24 h-24 mx-auto mb-6" />
          <p className="text-gray-600 mb-6">Connect your YouTube account to view your analytics</p>
          <button 
            onClick={connectYouTube}
            className="bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Connect YouTube
          </button>
        </div>
      )}
      
      {profileData && (
        <div className="space-y-8">
          {/* Profile Stats */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Channel Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500 mb-1">Subscribers</p>
                <p className="text-3xl font-bold text-gray-800">{profileData.subscriberCount}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500 mb-1">Total Views</p>
                <p className="text-3xl font-bold text-gray-800">{profileData.viewCount}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-gray-500 mb-1">Videos</p>
                <p className="text-3xl font-bold text-gray-800">{profileData.videoCount}</p>
              </div>
            </div>
          </section>

          {/* Video Metrics */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Video Metrics</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input 
                value={videoId} 
                onChange={(e) => setVideoId(e.target.value)} 
                placeholder="Enter Video ID" 
                className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button 
                onClick={fetchVideoMetrics}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Get Metrics
              </button>
            </div>
            
            {videoMetrics && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-gray-500 mb-1">Views</p>
                    <p className="text-2xl font-bold text-gray-800">{videoMetrics.viewCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 mb-1">Likes</p>
                    <p className="text-2xl font-bold text-gray-800">{videoMetrics.likeCount}</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Playlists */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Playlists</h2>
            <button 
              onClick={fetchPlaylists}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors mb-4"
            >
              Get Playlists
            </button>
            
            {playlists.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {playlists.map((pl) => (
                    <li key={pl.id} className="py-3 flex justify-between items-center">
                      <span className="font-medium">{pl.title}</span>
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                        {pl.videoCount} videos
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Playlist Videos */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Playlist Videos</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input 
                value={playlistId} 
                onChange={(e) => setPlaylistId(e.target.value)} 
                placeholder="Enter Playlist ID" 
                className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button 
                onClick={fetchPlaylistVideos}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Get Videos
              </button>
            </div>
            
            {playlistVideos.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {playlistVideos.map((vid) => (
                    <li key={vid.videoId} className="py-3">
                      {vid.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Demographics */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Demographics</h2>
            <button 
              onClick={fetchDemographics}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors mb-4"
            >
              Get Demographics
            </button>
            
            {demographics.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {demographics.map((demo, i) => (
                    <li key={i} className="bg-white p-3 rounded border border-gray-200 flex justify-between">
                      <span>{demo.ageGroup}, {demo.gender}</span>
                      <span className="font-semibold">{demo.viewerPercentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Video Performance */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Video Performance</h2>
            <button 
              onClick={fetchVideoPerformance}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors mb-4"
            >
              Get Performance
            </button>
            
            {videoPerformance.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {videoPerformance.map((perf, i) => (
                    <li key={i} className="py-3 flex justify-between">
                      <span>{perf.date}</span>
                      <span className="font-semibold">{perf.views} views</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Disconnect */}
          <div className="text-center pt-4">
            <button 
              onClick={disconnectYouTube}
              className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
            >
              Disconnect YouTube
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}