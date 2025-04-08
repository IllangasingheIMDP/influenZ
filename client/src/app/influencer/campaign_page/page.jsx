"use client";
import api from '@/constants/api';
import { useSelector } from 'react-redux';
import GradientCircularProgress from '@/components/GradientCircularProgress';
import React, { useState, useEffect } from 'react';
import CampaignCard from '../../../components/campaigncard';
import OngoingCampaignCard from '@/components/ongoingCampaignCard';

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [ongoingCampaigns, setOngoingCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name'); // 'name' or 'keywords'

  const { userId } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const responseAllCampaigns = await api.get('/campaign/campaigncarddetails');
        setCampaigns(responseAllCampaigns.data.data);

        const responseOngoingCampaigns = await api.get('user/getongoingcampaigns');
        setOngoingCampaigns(responseOngoingCampaigns.data.data);
        setIsLoading(false);
      } catch (err) {
        setError('Error fetching campaign data');
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filter campaigns based on search term and type
  const filteredCampaigns = campaigns.filter(campaign => {
    if (searchType === 'name') {
      return campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return campaign.keywords?.some(keyword => 
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  const filteredOngoingCampaigns = ongoingCampaigns.filter(campaign => {
    if (searchType === 'name') {
      return campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return campaign.keywords?.some(keyword => 
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  if (isLoading) {
    return (
      <div className='w-full h-screen flex justify-center items-center'>
        <GradientCircularProgress size={100} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Campaigns</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative flex items-center max-w-2xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search campaigns by ${searchType === 'name' ? 'name' : 'keywords'}...`}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          {/* Toggle between name and keyword search */}
          <div className="ml-4 flex items-center bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setSearchType('name')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                searchType === 'name'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Name
            </button>
            <button
              onClick={() => setSearchType('keywords')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                searchType === 'keywords'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Keywords
            </button>
          </div>
        </div>
      </div>

      {/* Your ongoing campaigns */}
      {filteredOngoingCampaigns.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Ongoing Campaigns</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredOngoingCampaigns.map((campaign) => (
              <OngoingCampaignCard key={campaign.campaign_id}  campaign={campaign} userId={userId} />
            ))}
          </div>
        </div>
      )}

      {/* All campaigns */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">All Campaigns</h2>
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.campaign_id} campaign={campaign} userId={userId} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No campaigns found matching your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default CampaignPage;