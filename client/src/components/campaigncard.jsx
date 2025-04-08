"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/constants/api";

const CampaignCard = ({ campaign, userId,alreadyApplied }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isApplying, setIsApplying] = useState(false); // Track applying state
  const [error, setError] = useState(null); // Track errors
  const data = campaign;

  // Fetch tasks of the campaign
  const fetchTasks = async (campaignId) => {
    setIsLoadingTasks(true);
    try {
      const response = await api.get(`/user/getcampaigntasks/${campaignId}`);
      setTasks(response.data.data); // Set tasks to the state
      setIsLoadingTasks(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setIsLoadingTasks(false);
    }
  };

// Handle applying to a campaign
const handleApplyToCampaign = async (campaignId, userId) => {
  if (!userId) {
    setError("User ID is missing. Please log in again.");
    return;
  }

  setIsApplying(true);
  setError(null);

  try {
    const response = await api.post("/user/applytocampaign", {
      campaign_id: campaignId,
      userId: userId,
    });

    if (response.data.success) {
      alert("Successfully applied to the campaign!");
      setIsModalOpen(false); // Close the modal after applying
    } else {
      // If the response indicates failure, display the message from the backend
      setError(response.data.message || "Failed to apply to the campaign.");
    }
  } catch (err) {
    // Check if the error response contains a message from the backend
    if (err.response && err.response.data && err.response.data.message) {
      setError(err.response.data.message); // Display the specific backend message
    } else {
      setError("An error occurred while applying to the campaign.");
    }
    console.error("Error applying to campaign:", err);
  } finally {
    setIsApplying(false);
  }
};

  // Format date - card version (short format)
  const formatCardDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format date - modal version (long format)
  const formatModalDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
    fetchTasks(data.campaign_id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  

  return (
    <>
      {/* Campaign Card */}
      <div
        className="relative w-64 h-96 rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 ease-in-out bg-white shadow-lg"
        style={{
          transform: isHovered ? "translateY(-8px)" : "translateY(0)",
          boxShadow: isHovered
            ? "0 15px 30px rgba(0, 0, 0, 0.1)"
            : "0 5px 15px rgba(0, 0, 0, 0.05)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Campaign Image with overlay */}
        <div className="relative h-40 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"
            style={{
              opacity: isHovered ? 0.9 : 0.7,
              transition: "opacity 0.3s ease",
            }}
          />
          <div className="relative w-full h-full">
            <Image
              src={data.imageUrl || "/loginwomen.svg"}
              alt={data.name || "Campaign Image"}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover transition-transform duration-500 ease-in-out"
              style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            />
          </div>
          <div className="absolute top-3 right-3 bg-white/90 text-xs font-semibold px-2 py-1 rounded-full z-20">
            {formatCardDate(data.startdate)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3
            className="text-lg font-bold text-gray-800 mb-1 transition-colors duration-300"
            style={{ color: isHovered ? "#3b82f6" : "#1f2937" }}
          >
            {data.campaign_name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            by <span className="font-medium">{data.company_name} </span>
            
          </p>

          {/* Keywords */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-1">
              {data.keywords &&
                data.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full transition-all duration-300"
                    style={{
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                      background: isHovered ? "#f3f4f6" : "#f1f1f1",
                    }}
                  >
                    {keyword}
                  </span>
                ))}
            </div>
          </div>

          {/* View More Button */}
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={openModal}
              className="w-full py-2 rounded-md font-medium transition-all duration-300 ease-in-out text-sm"
              style={{
                background: isHovered
                  ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                  : "#f3f4f6",
                color: isHovered ? "white" : "#4b5563",
              }}
            >
              View More
            </button>
          </div>
        </div>

        {/* Premium indicator */}
        {data.isPremium && (
          <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold py-1 px-3 rounded-br-lg z-20">
            PREMIUM
          </div>
        )}
      </div>

      {/* Campaign Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Campaign image with overlay */}
            <div className="relative h-64 w-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
              <div className="relative w-full h-full">
                <Image
                  src={data.imageUrl || "/loginwomen.svg"}
                  alt={data.name || "Campaign Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
              </div>

              {/* Campaign name overlay */}
              <div className="absolute bottom-0 left-0 z-20 p-6 w-full">
                <h2 className="text-2xl font-bold text-white">
                  {data.campaign_name}
                </h2>
                <p className="text-white/90 text-lg">by {data.company_name}</p>
              </div>
            </div>

            {/* Campaign details */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600">{data.description}</p>
              </div>

              {/* Goals */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Campaign Goals
                </h3>
                <p className="text-gray-600">{data.goals}</p>
              </div>

              {/* Budget */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Budget
                </h3>
                <div className="bg-blue-50 rounded-lg p-3 inline-block">
                  <span className="text-blue-600 font-semibold">
                    {data.budget}
                  </span>
                </div>
              </div>

              {/* Campaign Period */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Campaign Period
                </h3>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">
                      {formatModalDate(data.startdate)}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium">
                      {formatModalDate(data.enddate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Tasks
                </h3>
                {isLoadingTasks ? (
                  <p>Loading tasks...</p>
                ) : (
                  <ul className="list-disc pl-6">
                    {tasks.length > 0 ? (
                      tasks.map((task, index) => (
                        <li key={index} className="text-gray-600">
                          <strong>{task.description}</strong>
                          <div className="text-sm text-gray-500">
                            Due: {task.due_date}
                          </div>
                        </li>
                      ))
                    ) : (
                      <p>No tasks available for this campaign.</p>
                    )}
                  </ul>
                )}
              </div>

              {/* Keywords */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.keywords &&
                    data.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                </div>
              </div>

              {/* Apply Button */}
              
              <div className="pt-4 border-t border-gray-200">
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                
                {!alreadyApplied ? (
                  <button
                  onClick={() => handleApplyToCampaign(data.campaign_id, userId)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400"
                  disabled={isApplying}
                >
                  {isApplying ? (
                    "Applying..."
                  ) : (
                    <>
                      Apply for Campaign
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </button>
                ):<></>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CampaignCard;
