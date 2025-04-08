import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/constants/api"; // Adjust path based on your project structure

export default function CampaignsCard({userId,public_available}) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/brand/active-campaigns/${userId}`);
        
        // Fix: Access the campaigns array from the response data
        setCampaigns(response.data.campaigns || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
        setError("Failed to load campaigns. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleViewDetails = (campaignId) => {
    router.push(`/brands/CampaignDetails?campaign_id=${campaignId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Active Campaigns</h2>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow mb-6">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {!loading && !error && campaigns.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500">No active campaigns found.</p>
        </div>
      )}

      <div className="space-y-4">
        {campaigns.map((campaign, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-gray-800">{campaign.name}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">Active</span>
            </div>

            <p className="text-gray-600 text-sm mb-3">{campaign.description}</p>

            <div className="grid grid-cols-2 gap-y-4 mb-3">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Start</p>
                  <p className="font-medium">{new Date(campaign.start_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center">
                <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">End</p>
                  <p className="font-medium">{new Date(campaign.end_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center">
                <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Reach</p>
                  <p className="font-medium">{campaign.goals}</p>
                </div>
              </div>

              <div className="flex items-center">
                <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="font-medium text-green-600">${campaign.budget}</p>
                </div>
              </div>
            </div>

            {!public_available && <div className="flex justify-end">
              <button 
                onClick={() => handleViewDetails(campaign.campaign_id)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 px-4 py-1 rounded-md transition-colors"
              >
                View Details
              </button>
            </div>}

            {index < campaigns.length - 1 && (
              <div className="h-1 w-full bg-gradient-to-r from-indigo-400 to-purple-500 mt-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}