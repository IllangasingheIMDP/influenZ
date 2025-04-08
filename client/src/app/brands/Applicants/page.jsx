"use client";

import { useEffect, useState } from "react";
import api from "@/constants/api";

const InfluencerApplicants = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState("");
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get("/brand/applied-influencers");
        setCampaigns(res.data.campaigns);
      } catch (err) {
        setError("Failed to load applicants.");
      }
    };
    fetchApplicants();
  }, []);

  const handleAccept = async (campaign_id, user_id) => {
    try {
      await api.post("/brand/accept-applicant", {
        campaign_id,
        user_id,
      });
      alert("Applicant accepted and tasks assigned!");
      
      // Refresh data
      setCampaigns(prevCampaigns =>
        prevCampaigns.map(c => {
          if (c.campaign_id === campaign_id) {
            return {
              ...c,
              applicants: c.applicants.filter(i => i.user_id !== user_id),
            };
          }
          return c;
        })
      );
      setSelectedInfluencer(null);
    } catch (err) {
      console.error(err);
      alert("Failed to accept applicant");
    }
  };

  const handleReject = async (campaign_id, user_id) => {
    try {
      await api.put('/brand/reject', { campaign_id, user_id });
      alert('Influencer rejected successfully');
  
      // Refresh data
      setCampaigns(prevCampaigns =>
        prevCampaigns.map(c => {
          if (c.campaign_id === campaign_id) {
            return {
              ...c,
              applicants: c.applicants.filter(i => i.user_id !== user_id),
            };
          }
          return c;
        })
      );
  
      setSelectedInfluencer(null);
    } catch (err) {
      console.error('Reject failed', err);
    }
  };

  const viewInfluencer = (influencer) => {
    setSelectedInfluencer(influencer);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-yellow-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Campaign Applicants</h1>
          <p className="text-yellow-700">Review and manage influencer applications for your campaigns</p>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {selectedInfluencer ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-yellow-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-purple-800">Influencer Profile</h2>
              <button 
                onClick={() => setSelectedInfluencer(null)}
                className="text-yellow-600 hover:text-yellow-800 transition-colors"
              >
                &times; Close
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <div className="bg-gradient-to-r from-purple-100 to-yellow-100 rounded-lg p-6 mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-yellow-500 rounded-full mb-4 mx-auto flex items-center justify-center text-3xl text-white">
                    {selectedInfluencer.firstName[0]}{selectedInfluencer.lastName[0]}
                  </div>
                  <h3 className="text-xl font-bold text-center text-purple-800">
                    {selectedInfluencer.firstName} {selectedInfluencer.lastName}
                  </h3>
                  <p className="text-yellow-700 text-center">ID: {selectedInfluencer.user_id}</p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    onClick={() => handleAccept(
                      selectedInfluencer.campaign_id, 
                      selectedInfluencer.user_id
                    )}
                  >
                    Accept Application
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    onClick={() => handleReject(
                      selectedInfluencer.campaign_id, 
                      selectedInfluencer.user_id
                    )}
                  >
                    Reject Application
                  </button>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <h4 className="font-semibold mb-4 text-purple-800">Statistics & Performance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100">
                    <p className="text-sm text-yellow-600">Followers</p>
                    <p className="text-xl font-bold text-purple-700">120K</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100">
                    <p className="text-sm text-yellow-600">Engagement</p>
                    <p className="text-xl font-bold text-purple-700">4.8%</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100">
                    <p className="text-sm text-yellow-600">Past Campaigns</p>
                    <p className="text-xl font-bold text-purple-700">12</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100">
                    <p className="text-sm text-yellow-600">Content Type</p>
                    <p className="text-xl font-bold text-purple-700">Lifestyle</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          campaigns.length > 0 ? (
            <div className="grid gap-8">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign.campaign_id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-yellow-200"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-yellow-500 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">{campaign.name}</h2>
                  </div>
                  
                  <div className="p-6">
                    {campaign.applicants.length === 0 ? (
                      <div className="text-center py-8 text-purple-600">
                        <p className="text-lg">No applicants yet</p>
                        <p className="text-sm mt-2 text-yellow-600">Applicants will appear here once they apply</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {campaign.applicants.map((influencer, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-purple-50 to-yellow-50 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-gradient-to-r hover:from-purple-100 hover:to-yellow-100 transition-colors border border-yellow-100"
                          >
                            <div className="flex items-center gap-4 w-full md:w-auto">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-medium">
                                {influencer.firstName[0]}{influencer.lastName[0]}
                              </div>
                              <div>
                                <p className="font-semibold text-purple-800">
                                  {influencer.firstName} {influencer.lastName}
                                </p>
                                <p className="text-sm text-yellow-700">ID: {influencer.user_id}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 w-full md:w-auto">
                              <button
                                className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-200 transition-colors"
                                onClick={() => handleAccept(campaign.campaign_id, influencer.user_id)}
                              >
                                Accept
                              </button>
                              <button
                                className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
                                onClick={() => handleReject(campaign.campaign_id, influencer.user_id)}
                              >
                                Reject
                              </button>
                              <button 
                                className="bg-gradient-to-r from-purple-100 to-yellow-100 text-purple-700 px-4 py-2 rounded-lg font-medium hover:from-purple-200 hover:to-yellow-200 transition-colors"
                                onClick={() => viewInfluencer({...influencer, campaign_id: campaign.campaign_id})}
                              >
                                View
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-10 text-center border border-yellow-200">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-purple-800 mb-2">No Ongoing Campaigns</h2>
              <p className="text-yellow-700">Start a new campaign to connect with influencers</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default InfluencerApplicants;