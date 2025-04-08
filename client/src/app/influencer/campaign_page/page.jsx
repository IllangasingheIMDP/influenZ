"use client";
import api from "@/constants/api";
import { useSelector } from "react-redux";
import GradientCircularProgress from "@/components/GradientCircularProgress";
import React, { useState, useEffect } from "react";
import CampaignCard from "../../../components/campaigncard";
import OngoingCampaignCard from "@/components/ongoingCampaignCard";
import AppliedCampaigns from "@/components/AppliedCampaigns";
import { motion, AnimatePresence } from "framer-motion";

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [ongoingCampaigns, setOngoingCampaigns] = useState([]);
  const [appliedCampaigns, setAppliedCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [activeTab, setActiveTab] = useState("all");

  const { userId } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        
        const responseAllCampaigns = await api.get(
          "/campaign/campaigncarddetails"
        );
        setCampaigns(responseAllCampaigns.data.data);

        const responseOngoingCampaigns = await api.get(
          "user/getongoingcampaigns"
        );
        setOngoingCampaigns(responseOngoingCampaigns.data.data);

        const responseAppliedCampaigns = await api.get(
          "influencer/getappliedcampaigns"
        );
        setAppliedCampaigns(responseAppliedCampaigns.data.data);
        
        setTimeout(() => {
          setIsLoading(false);
        }, 600); // Adding a slight delay for smoother transitions
      } catch (err) {
        setError("Error fetching campaign data");
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filter campaigns based on search term and type
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (searchType === "name") {
      return campaign.campaign_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else {
      return campaign.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  const filteredOngoingCampaigns = ongoingCampaigns.filter((campaign) => {
    if (searchType === "name") {
      return campaign.campaign_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else {
      return campaign.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  const filteredAppliedCampaigns = appliedCampaigns.filter((campaign) => {
    if (searchType === "name") {
      return campaign.campaign_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else {
      return campaign.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-b from-amber-50 to-amber-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GradientCircularProgress size={100} />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-b from-amber-50 to-amber-100">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-50 text-red-600 p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header with subtle animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center text-amber-800 mb-2">
            Campaign Dashboard
          </h1>
          <p className="text-center text-amber-700 max-w-2xl mx-auto">
            Discover, apply and manage your marketing campaigns in one place
          </p>
        </motion.div>

        {/* Search Bar with animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative flex flex-col sm:flex-row items-center max-w-3xl mx-auto">
            <div className="relative flex-1 w-full mb-4 sm:mb-0">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search campaigns by ${
                  searchType === "name" ? "name" : "keywords"
                }...`}
                className="w-full pl-12 pr-4 py-4 rounded-full border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-md transition-all duration-300 text-amber-900 bg-white"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-400"
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
            <div className="sm:ml-4 flex items-center bg-white rounded-full p-1 shadow-md border border-amber-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchType("name")}
                className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  searchType === "name"
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-amber-700 hover:bg-amber-50"
                }`}
              >
                Name
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchType("keywords")}
                className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  searchType === "keywords"
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-amber-700 hover:bg-amber-50"
                }`}
              >
                Keywords
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Campaign Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("all")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-amber-500 text-white shadow-lg"
                  : "bg-white text-amber-700 shadow-md hover:bg-amber-50 border border-amber-200"
              }`}
            >
              All Campaigns
              <span className="ml-2 bg-amber-400 text-white px-2 py-0.5 rounded-full text-xs">
                {filteredCampaigns.length}
              </span>
            </motion.button>
            
            {filteredOngoingCampaigns.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab("ongoing")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === "ongoing"
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white text-amber-700 shadow-md hover:bg-amber-50 border border-amber-200"
                }`}
              >
                Ongoing
                <span className="ml-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {filteredOngoingCampaigns.length}
                </span>
              </motion.button>
            )}
            
            {filteredAppliedCampaigns.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab("applied")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === "applied"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-white text-amber-700 shadow-md hover:bg-amber-50 border border-amber-200"
                }`}
              >
                Applied
                <span className="ml-2 bg-purple-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {filteredAppliedCampaigns.length}
                </span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Campaign Lists with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          {activeTab === "ongoing" && filteredOngoingCampaigns.length > 0 && (
            <motion.div
              key="ongoing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-amber-800 border-b border-amber-200 pb-2">
                Your Ongoing Campaigns
              </h2>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredOngoingCampaigns.map((campaign) => (
                  <motion.div key={campaign.campaign_id} variants={itemVariants}>
                    <OngoingCampaignCard
                      campaign={campaign}
                      userId={userId}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {activeTab === "applied" && filteredAppliedCampaigns.length > 0 && (
            <motion.div
              key="applied"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-amber-800 border-b border-amber-200 pb-2">
                Your Applied Campaigns
              </h2>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredAppliedCampaigns.map((campaign) => (
                  <motion.div key={campaign.campaign_id} variants={itemVariants}>
                    <AppliedCampaigns
                      campaign={campaign}
                      userId={userId}
                      alreadyApplied={true}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {activeTab === "all" && (
            <motion.div
              key="all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-amber-800 border-b border-amber-200 pb-2">
                All Available Campaigns
              </h2>
              {filteredCampaigns.length > 0 ? (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredCampaigns.map((campaign) => (
                    <motion.div key={campaign.campaign_id} variants={itemVariants}>
                      <CampaignCard
                        campaign={campaign}
                        userId={userId}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto border border-amber-200">
                    <svg className="w-16 h-16 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-amber-800 mb-2">No campaigns found</h3>
                    <p className="text-amber-700">
                      We couldn't find any campaigns matching your search criteria. Try adjusting your search or check back later.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CampaignPage;