"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from '@/constants/api';

const Campaigns = () => {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActiveCampaigns = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/brand/active-campaigns`);
                const data = response.data;
                
                if (!data.success) throw new Error(data.message);
                
                setCampaigns(data.campaigns);
            } catch (err) {
                console.error(err);
                setError(err.message || "Something went wrong");
            }
            setLoading(false);
        };
        
        fetchActiveCampaigns();
    }, []);
    
    const handleViewDetails = (campaignId) => {
        router.push(`/brands/CampaignDetails?campaign_id=${campaignId}`);
    };
    
    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">Active Campaigns</h2>
                
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
                    <div className="bg-white shadow rounded-lg p-6 text-center">
                        <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-xl text-gray-500">No active campaigns found.</p>
                    </div>
                )}
                
                <div className="grid gap-6 mt-4">
                    {campaigns.map((campaign, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:shadow-xl hover:-translate-y-1">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{campaign.name}</h3>
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">Active</span>
                                </div>
                                
                                <p className="text-gray-600 mb-6">{campaign.description}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs text-gray-500">Start Date</p>
                                            <p className="font-medium">{new Date(campaign.start_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs text-gray-500">End Date</p>
                                            <p className="font-medium">{new Date(campaign.end_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs text-gray-500">Expected Reach</p>
                                            <p className="font-medium">{campaign.goals}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs text-gray-500">Budget</p>
                                            <p className="font-medium text-green-600">${campaign.budget}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end mt-4">
                                    <button 
                                        onClick={() => handleViewDetails(campaign.campaign_id)}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                            <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Campaigns;