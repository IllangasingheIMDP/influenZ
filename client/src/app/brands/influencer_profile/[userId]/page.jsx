// pages/profile/[userId]/page.jsx
'use client';
import { useEffect, useState,use } from 'react';
import { useRouter } from 'next/navigation';
import Chart from 'chart.js/auto';
import api from '@/utils/api';

const PublicProfilePage = ({ params }) => {
    const { userId } = use(params);
  const [influencerProfile, setInfluencerProfile] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [demographics, setDemographics] = useState({ gender: [], ageGroup: [], country: [] });
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRefs = {
    gender: null,
    ageGroup: null,
    country: null,
    performance: null,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch influencer profile data
        const influencerRes = await api.get(`/influencer/profile/${userId}`);
        if (influencerRes.data.success) {
          setInfluencerProfile(influencerRes.data.influencer);
        }

        // Fetch YouTube data
        const youtubeRes = await api.get(`/youtube/all-data/${userId}`);
        const { profile, metrics, demographics, performance } = youtubeRes.data;
        console.log(youtubeRes.data);
        setMetrics(metrics.success ? metrics.data : {});
        setDemographics(demographics.success ? demographics.data : { gender: [], ageGroup: [], country: [] });
        setPerformance(performance.success ? performance.data : []);

      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);
    useEffect(() => {
      // Gender Chart
      if (demographics.gender && demographics.gender.length > 0) {
        if (chartRefs.gender) chartRefs.gender.destroy();
        chartRefs.gender = new Chart(document.getElementById('genderChart'), {
          type: 'pie',
          data: {
            labels: demographics.gender.map(d => d.gender),
            datasets: [{
              data: demographics.gender.map(d => d.viewerPercentage),
              backgroundColor: ['#36A2EB', '#FF6384'],
            }],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
            },
          },
        });
      }
  
      // Age Group Chart
      if (demographics.ageGroup && demographics.ageGroup.length > 0) {
        if (chartRefs.ageGroup) chartRefs.ageGroup.destroy();
        chartRefs.ageGroup = new Chart(document.getElementById('ageChart'), {
          type: 'bar',
          data: {
            labels: demographics.ageGroup.map(d => d.ageGroup),
            datasets: [{
              label: 'Viewer Percentage',
              data: demographics.ageGroup.map(d => d.viewerPercentage),
              backgroundColor: '#36A2EB',
            }],
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentage' } },
              x: { title: { display: true, text: 'Age Group' } },
            },
          },
        });
      }
  
      // Country Chart
      if (demographics.country && demographics.country.length > 0) {
        if (chartRefs.country) chartRefs.country.destroy();
        chartRefs.country = new Chart(document.getElementById('countryChart'), {
          type: 'bar',
          data: {
            labels: demographics.country.map(d => d.country),
            datasets: [{
              label: 'Viewer Percentage',
              data: demographics.country.map(d => d.viewerPercentage),
              backgroundColor: '#FFCE56',
            }],
          },
          options: {
            responsive: true,
            indexAxis: 'y',
            scales: {
              x: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentage' } },
              y: { title: { display: true, text: 'Country' } },
            },
          },
        });
      }
  
      // Performance Chart
      if (performance && performance.length > 0) {
        if (chartRefs.performance) chartRefs.performance.destroy();
        chartRefs.performance = new Chart(document.getElementById('performanceChart'), {
          type: 'line',
          data: {
            labels: performance.map(p => p.date),
            datasets: [
              {
                label: 'Views',
                data: performance.map(p => p.views),
                borderColor: '#36A2EB',
                fill: false,
              },
              {
                label: 'Likes',
                data: performance.map(p => p.likes),
                borderColor: '#FF6384',
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: { title: { display: true, text: 'Date' } },
              y: { beginAtZero: true, title: { display: true, text: 'Count' } },
            },
          },
        });
      }
  
      // Cleanup on unmount
      return () => {
        Object.values(chartRefs).forEach(chart => {
          if (chart) chart.destroy();
        });
      };
    }, [demographics, performance]);
    if (loading) return <div className="min-h-screen bg-[#f5f5e5] flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen bg-[#f5f5e5] flex items-center justify-center text-red-500">{error}</div>;
    return (
        <div className="min-h-screen bg-[#f5f5e5] p-6 font-sans">
          {/* Profile Section */}
          <div className="bg-[#fff3cd] p-6 rounded-lg shadow-md mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={influencerProfile?.profile_pic || '/default-profile.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{influencerProfile?.name}</h2>
                <p className="text-gray-600">{influencerProfile?.description}</p>
                
                <div className="mt-4">
                  <button className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors">
                    Connect
                  </button>
                </div>
              </div>
            </div>
    
            {/* Social Media Metrics */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-600">Subscribers</h3>
                <p className="text-2xl font-semibold text-gray-800">{metrics.total_subscribers || '0'}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-600">Avg. Likes/Video</h3>
                <p className="text-2xl font-semibold text-gray-800">{metrics.avg_likes_per_video?.toFixed(2) || '0'}</p>
              </div>
    
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-600">Total Views</h3>
                <p className="text-2xl font-semibold text-gray-800">{metrics.total_views || '0'}</p>
              </div>
    
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-600">Personal Details</h3>
                <div className="space-y-1 mt-2">
                  {influencerProfile?.country && (
                    <p className="text-gray-800">
                      <span className="font-medium">Country:</span> {influencerProfile.country}
                    </p>
                  )}
                  {influencerProfile?.age && (
                    <p className="text-gray-800">
                      <span className="font-medium">Age:</span> {influencerProfile.age}
                    </p>
                  )}
                  {influencerProfile?.gender && (
                    <p className="text-gray-800">
                      <span className="font-medium">Gender:</span> {influencerProfile.gender}
                    </p>
                  )}
                </div>
              </div>
            </div>
    
            {/* Tags Display */}
            <div className="mt-4 flex flex-wrap gap-2">
              {influencerProfile?.tags?.map((tag, index) => (
                <span key={index} className="bg-pink-200 text-pink-800 text-sm px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-[#fff3cd] p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Audience Demographics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gender Chart */}
          <div>
            <h4 className="text-gray-700 font-semibold mb-2">Gender</h4>
            {demographics.gender && demographics.gender.length > 0 ? (
              <canvas id="genderChart" className="w-full h-48"></canvas>
            ) : (
              <p className="text-gray-500">No gender data available</p>
            )}
          </div>
          {/* Age Group Chart */}
          <div>
            <h4 className="text-gray-700 font-semibold mb-2">Age Group</h4>
            {demographics.ageGroup && demographics.ageGroup.length > 0 ? (
              <canvas id="ageChart" className="w-full h-48"></canvas>
            ) : (
              <p className="text-gray-500">No age group data available</p>
            )}
          </div>
          {/* Country Chart */}
          <div>
            <h4 className="text-gray-700 font-semibold mb-2">Country</h4>
            {demographics.country && demographics.country.length > 0 ? (
              <canvas id="countryChart" className="w-full h-48"></canvas>
            ) : (
              <p className="text-gray-500">No country data available</p>
            )}
          </div>
        </div>
      </div>
      <div className="bg-[#fff3cd] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Over Time</h3>
        {performance && performance.length > 0 ? (
          <canvas id="performanceChart" className="w-full h-64"></canvas>
        ) : (
          <p className="text-gray-500">No performance data available</p>
        )}
      </div>
      </div>
  );
};

export default PublicProfilePage;    
