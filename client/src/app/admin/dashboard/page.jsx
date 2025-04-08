'use client';
import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { motion } from 'framer-motion';

const PendingInfluencersPage = () => {
  // State to store influencers, loading status, error, and which influencers' details to show
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewing, setReviewing] = useState([]); // Array of user_ids being reviewed
  const [fullSizeImage, setFullSizeImage] = useState(null); // For full size image modal

  // Fetch pending influencers on component mount
  useEffect(() => { 
    const fetchPendingInfluencers = async () => {
      try {
        const response = await api.get('/admin/get-pending-influencers');
        setInfluencers(response.data.influencers);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPendingInfluencers();
  }, []);

  // Handle accepting an influencer
  const handleAccept = async (userId) => {
    try {
      await api.post('/admin/verify-influencer', { userId });
      // Remove influencer from list after acceptance
      setInfluencers(influencers.filter((inf) => inf.user_id !== userId));
    } catch (err) {
      console.error('Error accepting influencer:', err);
      setError('Failed to accept influencer');
    }
  };

  // Handle rejecting an influencer
  const handleReject = async (userId) => {
    try {
      await api.post('/admin/reject-influencer', { userId });
      // Remove influencer from list after rejection
      setInfluencers(influencers.filter((inf) => inf.user_id !== userId));
    } catch (err) {
      console.error('Error rejecting influencer:', err);
      setError('Failed to reject influencer');
    }
  };

  // Toggle review details visibility
  const toggleReview = (userId) => {
    setReviewing((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Get initials for avatar
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial || 'U';
  };

  // Open image in full size
  const openFullSizeImage = (imageUrl) => {
    setFullSizeImage(imageUrl);
  };

  // Close full size image
  const closeFullSizeImage = () => {
    setFullSizeImage(null);
  };

  // Loading state with animation
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-amber-50">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-amber-200 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-amber-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  // Error state with animation
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center items-center h-screen bg-amber-50"
      >
        <div className="bg-white p-8 rounded-lg shadow-xl border-l-4 border-red-600 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Occurred</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 pt-12 pb-16">
      {/* Full size image modal */}
      {fullSizeImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={closeFullSizeImage}
              className="absolute -top-12 right-0 bg-white text-amber-800 rounded-full p-2 shadow-lg hover:bg-amber-100 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-2 rounded-lg shadow-2xl"
            >
              <img 
                src={fullSizeImage} 
                alt="Identity Card Full View" 
                className="w-full h-auto rounded-md"
              />
            </motion.div>
          </div>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold mb-6 text-amber-900 border-b-2 border-amber-300 pb-4 inline-block"
          >
            Pending Influencers
          </motion.h1>
          
          {influencers.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-600">No pending influencers at the moment.</p>
              <p className="text-sm text-gray-500 mt-2">All verification requests have been processed.</p>
            </motion.div>
          ) : (
            <motion.ul 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
              className="space-y-6"
            >
              {influencers.map((influencer, index) => (
                <motion.li
                  key={influencer.user_id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-amber-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6 bg-gradient-to-r from-amber-50 to-white">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Left Section: Email, Avatar, Verification Status */}
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {getInitials(influencer.firstName, influencer.lastName)}
                        </div>
                        <div>
                          <span className="text-sm text-gray-800">
                            {influencer.email || `User ID: ${influencer.user_id}`}
                          </span>
                          <p className="text-xs text-amber-700">Verification Pending</p>
                        </div>
                      </div>
                      
                      {/* Middle Section: Full Name */}
                      <div className="flex items-center justify-center">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {influencer.firstName && influencer.lastName 
                            ? `${influencer.firstName} ${influencer.lastName}`
                            : "Unknown Name"}
                        </h3>
                      </div>
                      
                      {/* Right Section: Action Buttons */}
                      <div className="flex flex-wrap gap-2 justify-end">
                        <button
                          onClick={() => handleAccept(influencer.user_id)}
                          className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(influencer.user_id)}
                          className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                        <button
                          onClick={() => toggleReview(influencer.user_id)}
                          className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 py-2 rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {reviewing.includes(influencer.user_id) ? 'Hide Details' : 'Review Details'}
                        </button>
                      </div>
                    </div>

                    {/* Review Details Section with animation */}
                    {reviewing.includes(influencer.user_id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6"
                      >
                        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                          <h3 className="font-semibold text-amber-800 text-xl mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Verification Details
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                              <div className="mb-4">
                                <h4 className="font-medium text-amber-700 mb-2">Personal Information:</h4>
                                <p className="text-gray-700 mb-1">
                                  <span className="font-medium">Full Name:</span>{' '}
                                  {`${influencer.firstName || ''} ${influencer.lastName || ''}`}
                                </p>
                                <p className="text-gray-700">
                                  <span className="font-medium">Email:</span>{' '}
                                  {influencer.email || 'Not available'}
                                </p>
                              </div>
                              <div className="mt-4">
                                <h4 className="font-medium text-amber-700 mb-2 flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  Social Media Handles:
                                </h4>
                                {influencer.social_media_handles ? (
                                  <ul className="space-y-2">
                                    {Object.entries(influencer.social_media_handles).map(
                                      ([platform, handle]) => (
                                        <li key={platform} className="flex items-center bg-amber-50 p-2 rounded-md">
                                          <span className="w-24 font-medium text-amber-900">{platform}:</span>
                                          <span className="text-gray-700">{handle}</span>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  <p className="text-gray-500 italic">No social media handles provided.</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                              <h4 className="font-medium text-amber-700 mb-3 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>
                                National Identity Card:
                              </h4>
                              {influencer.identity_card_url ? (
                                <div className="relative group">
                                  <img
                                    src={influencer.identity_card_url}
                                    alt="Identity Card"
                                    className="rounded-lg border border-amber-200 shadow-sm w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-center">
                                    <button 
                                      onClick={() => openFullSizeImage(influencer.identity_card_url)}
                                      className="bg-white text-amber-800 px-3 py-1 rounded-full mb-4 text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                    >
                                      View Full Size
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-amber-50 rounded-lg p-6 flex flex-col items-center justify-center h-32">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <p className="text-amber-700 text-center">No identity card uploaded.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PendingInfluencersPage;