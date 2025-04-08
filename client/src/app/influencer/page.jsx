// pages/influencer/profile.js
'use client';
import { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import api from '@/utils/api';
import { FiEdit2, FiUpload } from 'react-icons/fi';
import { useSelector } from 'react-redux';
const InfluencerProfile = () => {
  const user = useSelector((state) => state.user);
  const [profile, setProfile] = useState({});
  const [metrics, setMetrics] = useState({});
  const [demographics, setDemographics] = useState({ gender: [], ageGroup: [], country: [] });
  const [performance, setPerformance] = useState([]);
  const [error, setError] = useState(null);
  const [influencerProfile, setInfluencerProfile] = useState(null);
  const [profileUrl, setProfileUrl] = useState(null);
  const [editingTags, setEditingTags] = useState(false);
  const [tempTags, setTempTags] = useState([]);
  const [newTag, setNewTag] = useState('');


  const startEditingTags = () => {
    setTempTags([...(influencerProfile?.tags || [])]);
    setEditingTags(true);
  };

  const saveTags = async () => {
    await handleUpdateTags(tempTags);
    setEditingTags(false);
  };

  const cancelEditingTags = () => {
    setEditingTags(false);
  };

  const addTag = () => {
    if (newTag.trim() && !tempTags.includes(newTag.trim())) {
      setTempTags([...tempTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTempTags(tempTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTag();
    }
  };
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const chartRefs = {
    gender: null,
    ageGroup: null,
    country: null,
    performance: null,
  };

  const handleUpdateTags = async (tags) => {
    try {
      const response = await api.put('/influencer/update-tags', { tags });
      if (response.data.success) {
        setInfluencerProfile(prev => ({
          ...prev,
          tags: response.data.updatedInfluencer.tags
        }));
      } else {
        setError(response.data.message);
      }

    } catch (err) {
      setError('Error updating tags');
      console.error('Update tags error:', err);
    }
  };

  const handleFileChange = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;

    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Set the file immediately

    // Create and set preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileUrl(event.target.result);
    };
    reader.readAsDataURL(selectedFile);

    // Upload the file after state is updated
    await handleUploadProfilePicture(selectedFile);
  };

  const handleUploadProfilePicture = async (fileToUpload = file) => {
    if (!fileToUpload) {
      setError('Please select a file to upload');
      return;
    }

    setError('');
    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const response = await api.post('/influencer/upload-profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        // Only update with server URL if provided
        if (response.data.profilePic) {
          setInfluencerProfile(prev => ({
            ...prev,
            profile_pic:response.data.profilePic
          }));
          //setProfileUrl(response.data.profilePic);
        }
        // Clear the file input to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err) {
      setError('Failed to upload profile picture');
      console.error('Upload error:', err);
      // Revert to previous profile picture if upload fails
      const prevResponse = await api.get(`/influencer/profile-pic/${user.userId}`);
      if (prevResponse.data.success && prevResponse.data.profilePic) {
        setInfluencerProfile(prev => ({
          ...prev,
          profile_pic:response.data.profilePic
        }));
      }
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/influencer/profile/${user.userId}`);
        if (response.data.success) {
          console.log(response.data.influencer);
          setInfluencerProfile(response.data.influencer);
        }
      } catch (err) {
        console.error('Failed to fetch profile picture:', err);
      }
    };

    fetchProfile();
  }, []);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const profileRes = await api.get(`/youtube/profile/${user.userId}`);
  //       setProfile(profileRes.data.success ? profileRes.data : {});
  //     } catch (err) {
  //       console.error('Error fetching profile:', err);
  //       setError(prev => ({
  //         ...prev,
  //         profile: err.response?.data?.message || err.message || 'Failed to fetch profile'
  //       }));
  //     }
  //   };
  //   fetchProfile();
  // }, [user.userId]);

  // useEffect(() => {
  //   const fetchMetrics = async () => {
  //     try {
  //       const metricsRes = await api.get(`/youtube/average-metrics/${user.userId}`);
  //       setMetrics(metricsRes.data.success ? metricsRes.data.metrics || {} : {});
  //     } catch (err) {
  //       console.error('Error fetching metrics:', err);
  //       setError(prev => ({
  //         ...prev,
  //         metrics: err.response?.data?.message || err.message || 'Failed to fetch metrics'
  //       }));
  //     }
  //   };
  //   fetchMetrics();
  // }, [user.userId]);

  // useEffect(() => {
  //   const fetchDemographics = async () => {
  //     try {
  //       const demoRes = await api.get(`/youtube/demographics/${user.userId}`);
  //       setDemographics(demoRes.data.success ? demoRes.data.demographics : { 
  //         gender: [], 
  //         ageGroup: [], 
  //         country: [] 
  //       });
  //     } catch (err) {
  //       console.error('Error fetching demographics:', err);
  //       setError(prev => ({
  //         ...prev,
  //         demographics: err.response?.data?.message || err.message || 'Failed to fetch demographics'
  //       }));
  //     }
  //   };
  //   fetchDemographics();
  // }, [user.userId]);

  // useEffect(() => {
  //   const fetchPerformance = async () => {
  //     try {
  //       const perfRes = await api.get(`/youtube/channel-performance/${user.userId}`);
  //       setPerformance(perfRes.data.success ? perfRes.data.performance : []);
  //     } catch (err) {
  //       console.error('Error fetching performance:', err);
  //       setError(prev => ({
  //         ...prev,
  //         performance: err.response?.data?.message || err.message || 'Failed to fetch performance'
  //       }));
  //     }
  //   };
  //   fetchPerformance();
  // }, [user.userId]);
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const requests = [
  //       api.get(`/youtube/profile/${user.userId}`).catch(err => {
  //         console.error('Profile fetch failed:', err);
  //         return { data: {} }; // Return empty data on failure
  //       }),
  //       api.get(`/youtube/average-metrics/${user.userId}`).catch(err => {
  //         console.error('Metrics fetch failed:', err);
  //         return { data: { success: false, metrics: {} } };
  //       }),
  //       api.get(`/youtube/demographics/${user.userId}`).catch(err => {
  //         console.error('Demographics fetch failed:', err);
  //         return { data: { success: false, demographics: { gender: [], ageGroup: [], country: [] } } };
  //       }),
  //       api.get(`/youtube/channel-performance/${user.userId}`).catch(err => {
  //         console.error('Performance fetch failed:', err);
  //         return { data: { success: false, performance: [] } };
  //       }),
  //     ];
  
  //     try {
  //       const [profileRes, metricsRes, demoRes, perfRes] = await Promise.all(requests);
        
  //       setProfile(profileRes.data.success ? profileRes.data : {});
  //       setMetrics(metricsRes.data.success ? metricsRes.data.metrics || {} : {});
  //       setDemographics(demoRes.data.success ? demoRes.data.demographics : { gender: [], ageGroup: [], country: [] });
  //       setPerformance(perfRes.data.success ? perfRes.data.performance : []);
  //     } catch (err) {
  //       console.error('Unexpected error:', err);
  //       setError(err.message || 'An unexpected error occurred');
  //     }
  //   };
    
  //   fetchData();
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/youtube/all-data/${user.userId}`);
        const { profile, metrics, demographics, performance } = response.data;
        console.log(response.data);
        setProfile(profile.success ? profile.data : {});
        setMetrics(metrics.success ? metrics.data : {});
        setDemographics(demographics.success ? demographics.data : { gender: [], ageGroup: [], country: [] });
        setPerformance(performance.success ? performance.data : []);
      } catch (err) {
        if(err.status === 401) setError('Youtube is Unauthorized.Please verify your account');
        else{
          console.error('Error fetching all YouTube data:', err);
        setError(err.message || 'An unexpected error occurred');
        }
        
      }
    };
  
    fetchData();
  }, [user.userId]);
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


  return (
    <div className="min-h-screen bg-[#f5f5e5] p-6 font-sans">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-[#fff3cd] p-6 rounded-lg shadow-md mb-6">
  <div className="flex items-center space-x-4">
    <div className="relative inline-block sm:w-auto w-full">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Profile picture with edit button */}
      <div className="relative group">
      <img
  src={influencerProfile?.profile_pic || '/defaultDP.jpg'}
  alt="Profile"
  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
/>

        {/* Edit button */}
        <button
          onClick={triggerFileInput}
          className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 
               transform translate-x-1/4 translate-y-1/4 opacity-0 group-hover:opacity-100 
               transition-opacity duration-200 hover:bg-blue-600 focus:outline-none"
          aria-label="Edit profile picture"
        >
          <FiEdit2 size={16} />
        </button>
      </div>

      {/* Error message */}
      
    </div>
    <div>
      <h2 className="text-2xl font-bold text-gray-800">{influencerProfile && influencerProfile.name || 'Influencer Name'}</h2>
      <p className="text-gray-600">{profile.description || 'My greatest fear isn’t starting, it’s not making it to the top.'}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {!editingTags ? (
          <>
            {influencerProfile?.tags?.map((tag, index) => (
              <span key={index} className="bg-pink-200 text-pink-800 text-sm px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
            <button
              onClick={startEditingTags}
              className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
            >
              <FiEdit2 size={14} className="mr-1" /> Edit Tags
            </button>
          </>
        ) : (
          <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-2">
              {tempTags.map((tag, index) => (
                <div key={index} className="bg-pink-200 text-pink-800 text-sm px-3 py-1 rounded-full flex items-center">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-pink-600 hover:text-pink-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add new tag"
                className="border rounded px-2 py-1 text-sm flex-grow"
              />
              <button
                onClick={addTag}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={saveTags}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Save
              </button>
              <button
                onClick={cancelEditingTags}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Social Media Metrics */}
  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-gray-600">YouTube</h3>
      <p className="text-2xl font-semibold text-gray-800">{metrics.total_subscribers || '0'}</p>
      <p className="text-sm text-gray-500">Total Followers</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-gray-600">Avg. Likes/Video</h3>
      <p className="text-2xl font-semibold text-gray-800">{metrics.avg_likes_per_video?.toFixed(2) || '0'}</p>
      <p className="text-sm text-gray-500">Likes per Video</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-gray-600">Avg. Engagement</h3>
      <p className="text-2xl font-semibold text-gray-800">{metrics.avg_engagement_per_video?.toFixed(2) || '0'}</p>
      <p className="text-sm text-gray-500">Engagement per Video</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-gray-600">Total Views</h3>
      <p className="text-2xl font-semibold text-gray-800">{metrics.total_views || '0'}</p>
      <p className="text-sm text-gray-500">Total Views</p>
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

  {/* Trust Score and Verification Button */}
  <div className="mt-6 w-full md:w-1/2 flex flex-col md:flex-row gap-4">
    {/* <div className="bg-white p-4 w-full md:w-1/2 rounded-lg shadow mb-4">
      <h3 className="text-gray-600">Trust Score</h3>
      <p className="text-2xl font-semibold text-gray-800">{influencerProfile?.trust_score || '0'}</p>
    </div> */}
    {influencerProfile?.verification_status === 'pending' && (
      <div className="bg-white w-full md:w-1/2 p-4 rounded-lg shadow">
        <h3 className="text-gray-600">Verification Status</h3>
        {influencerProfile.verification_step === 1 && (
          <p className="text-yellow-600 mb-2">Verification not started</p>
        )}
        {(influencerProfile.verification_step === 2 || influencerProfile.verification_step === 3) && (
          <p className="text-yellow-600 mb-2">Verification not completed</p>
        )}
        {influencerProfile.verification_step === 4 && (
          <p className="text-yellow-600 mb-2">Waiting for admin approval</p>
        )}
        <a
          href="/influencer/verification"
          className="bg-blue-500 text-white px-4 py-2 rounded text-center block mt-2"
        >
          Go to Verification Page
        </a>
      </div>
    )}
    {influencerProfile?.verification_status === 'verified' && (
      <div className="bg-white w-full md:w-1/2 p-4 rounded-lg shadow">
        <h3 className="text-gray-600">Verification Status</h3>
        <p className="text-green-600 mb-2">Verified</p>
      </div>
    )}
  </div>
</div>

      {/* Audience Demographics Section */}
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

      {/* Performance Over Time Section */}
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

export default InfluencerProfile;