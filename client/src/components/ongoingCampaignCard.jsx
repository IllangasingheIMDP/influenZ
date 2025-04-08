"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/constants/api";

const OngoingComponentCard = ({ campaign, userId, alreadyApplied }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState(null);
  const [taskLinks, setTaskLinks] = useState({});
  const data = campaign;

  // Fetch tasks of the campaign and initialize taskLinks with existing links
  const fetchTasks = async (campaignId) => {
    setIsLoadingTasks(true);
    try {
      const response = await api.get(`/user/getcampaigntasks/${campaignId}`);
      const fetchedTasks = response.data.data;
      setTasks(fetchedTasks);
      console.log("fetchedTasks", fetchedTasks);

      const initialTaskLinks = {};
      fetchedTasks.forEach((task) => {
        if (task.link) {
          initialTaskLinks[task.task_id] = task.link;
        }
      });
      setTaskLinks(initialTaskLinks);
      console.log("taskLinks", initialTaskLinks);

      setIsLoadingTasks(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setIsLoadingTasks(false);
    }
  };

  // Handle saving or updating a link for a task
  const handleSaveLink = async (taskId) => {
    const link = taskLinks[taskId];
    console.log("Saving/Updating link:", link, "for task ID:", taskId);
    if (!link) {
      setError("Please enter a link before saving.");
      return;
    }

    try {
      const response = await api.post("/influencer/savelink", {
        task_id: taskId,
        link: link,
        userId: userId,
      });

      if (response.data.success) {
        alert(`Link ${tasks.find(t => t.task_id === taskId)?.link ? "updated" : "saved"} successfully!`);
        fetchTasks(data.campaign_id); // Refresh tasks to sync with backend
        setError(null); // Clear any previous errors
      } else {
        setError(response.data.message || "Failed to save/update the link.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while saving/updating the link."
      );
      console.error("Error saving/updating link:", err);
    }
  };

  // Handle link input change
  const handleLinkChange = (taskId, value) => {
    setTaskLinks((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  // Format date - card version (short format)
  const formatCardDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format date - modal version (long format)
  const formatModalDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
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
      {/* Premium Campaign Card */}
      <div
        className="relative w-72 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-out bg-gradient-to-b from-white to-yellow-50"
        style={{
          transform: isHovered ? "translateY(-12px)" : "translateY(0)",
          boxShadow: isHovered
            ? "0 20px 30px rgba(255, 230, 0, 0.2), 0 10px 15px rgba(255, 220, 0, 0.15)"
            : "0 8px 20px rgba(255, 230, 0, 0.1)",
          height: "440px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-52 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"
            style={{
              opacity: isHovered ? 0.9 : 0.7,
              transition: "opacity 0.4s ease, transform 0.5s ease",
            }}
          />
          <div className="relative w-full h-full">
            <Image
              src={data.imageUrl || "/loginwomen.svg"}
              alt={data.name || "Campaign Image"}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover transition-transform duration-700 ease-out"
              style={{ 
                transform: isHovered ? "scale(1.08)" : "scale(1)",
                animation: isHovered ? "pulse 2s infinite" : "none",
              }}
            />
          </div>
          <div 
            className="absolute top-3 right-3 bg-white/90 text-xs font-semibold px-3 py-1.5 rounded-full z-20 shadow-md"
            style={{
              animation: isHovered ? "float 3s ease-in-out infinite" : "none",
            }}
          >
            <span className="text-black">{formatCardDate(data.startdate)}</span>
          </div>
        </div>

        <div className="p-5">
          <h3
            className="text-xl font-bold mb-1.5 transition-colors duration-300"
            style={{ 
              color: "#000",
              position: "relative",
              display: "inline-block",
              animation: isHovered ? "glow 1.5s ease-in-out infinite alternate" : "none",
            }}
          >
            {data.campaign_name}
          </h3>
          <p className="text-sm mb-4 text-gray-800">
            by <span className="font-medium text-black">{data.company_name}</span>
          </p>

          <div className="mb-14">
            <div className="flex flex-wrap gap-1.5">
              {data.keywords &&
                data.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="text-xs px-2.5 py-1.5 rounded-full transition-all duration-300"
                    style={{
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                      background: "#fff9c2",
                      color: "#000",
                      boxShadow: isHovered ? "0 2px 5px rgba(255, 230, 0, 0.2)" : "none",
                      animation: isHovered ? `fadeIn 0.5s ease forwards ${index * 0.1}s` : "none",
                      opacity: isHovered ? 1 : 0.9,
                    }}
                  >
                    {keyword}
                  </span>
                ))}
            </div>
          </div>

          <div className="absolute bottom-5 left-5 right-5">
            <button
              onClick={openModal}
              className="w-full py-3 rounded-lg font-medium transition-all duration-500 ease-out text-black text-sm"
              style={{
                background: isHovered
                  ? "#ffd700"
                  : "#ffe500",
                boxShadow: isHovered
                  ? "0 8px 15px rgba(255, 230, 0, 0.3)"
                  : "0 4px 8px rgba(255, 230, 0, 0.2)",
                transform: isHovered ? "scale(1.03)" : "scale(1)",
                animation: isHovered ? "pulse 2s infinite" : "none",
              }}
            >
              View Campaign
            </button>
          </div>
        </div>

        {data.isPremium && (
          <div 
            className="absolute top-0 left-0 z-20"
            style={{
              animation: "shimmer 2s infinite linear",
            }}
          >
            <div
              className="font-bold py-1.5 px-4 text-black text-xs tracking-wider"
              style={{
                background: "#ffe500",
                borderBottomRightRadius: "0.75rem",
                boxShadow: "2px 2px 5px rgba(255, 230, 0, 0.25)",
              }}
            >
              PREMIUM
            </div>
          </div>
        )}
      </div>

      {/* Campaign Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 animate-fadeIn">
          <div 
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn"
            style={{
              background: "linear-gradient(to bottom, white, #fffef0)",
              boxShadow: "0 25px 50px -12px rgba(255, 230, 0, 0.25)"
            }}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-yellow-50 transition-colors duration-300 z-50 animate-fadeIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
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

            <div className="relative h-80 w-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="relative w-full h-full">
                <Image
                  src={data.imageUrl || "/loginwomen.svg"}
                  alt={data.name || "Campaign Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover animate-kenBurns"
                />
              </div>

              <div className="absolute bottom-0 left-0 z-20 p-8 w-full animate-slideInUp">
                <h2 className="text-3xl font-bold text-white">
                  {data.campaign_name}
                </h2>
                <p className="text-white/90 text-lg mt-1">by {data.company_name}</p>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="animate-fadeInDelay">
                <h3 className="text-xl font-semibold mb-3 text-black">
                  Description
                </h3>
                <p className="text-gray-800 leading-relaxed">{data.description}</p>
              </div>

              <div className="animate-fadeInDelay" style={{ animationDelay: "100ms" }}>
                <h3 className="text-xl font-semibold mb-3 text-black">
                  Campaign Goals
                </h3>
                <p className="text-gray-800 leading-relaxed">{data.goals}</p>
              </div>

              <div className="animate-fadeInDelay" style={{ animationDelay: "200ms" }}>
                <h3 className="text-xl font-semibold mb-3 text-black">
                  Budget
                </h3>
                <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg p-4 inline-block shadow-sm">
                  <span className="text-black font-semibold text-lg">
                    {data.budget}
                  </span>
                </div>
              </div>

              <div className="animate-fadeInDelay" style={{ animationDelay: "300ms" }}>
                <h3 className="text-xl font-semibold mb-3 text-black">
                  Campaign Period
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg p-4 shadow-sm transition-transform duration-300 hover:transform hover:scale-105">
                    <p className="text-sm text-black font-medium">Start Date</p>
                    <p className="font-semibold text-black">
                      {formatModalDate(data.startdate)}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-yellow-400"
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
                  <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg p-4 shadow-sm transition-transform duration-300 hover:transform hover:scale-105">
                    <p className="text-sm text-black font-medium">End Date</p>
                    <p className="font-semibold text-black">
                      {formatModalDate(data.enddate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tasks with Input Fields and Save/Update Buttons */}
              <div className="animate-fadeInDelay" style={{ animationDelay: "400ms" }}>
                <h3 className="text-xl font-semibold mb-3 text-black">
                  Tasks
                </h3>
                {isLoadingTasks ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                  </div>
                ) : (
                  <ul className="list-none space-y-6">
                    {tasks.length > 0 ? (
                      tasks.map((task, index) => (
                        <li key={index} className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-5 rounded-xl shadow-sm animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="mb-2">
                            <strong className="text-black">{task.description}</strong>
                            <div className="text-sm text-black mt-1 font-medium">
                              Due: {task.due_date}
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <input
                              type="text"
                              placeholder="Enter link"
                              value={taskLinks[task.task_id] || ""}
                              onChange={(e) =>
                                handleLinkChange(task.task_id, e.target.value)
                              }
                              className="border border-yellow-300 rounded-lg p-3 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                            />
                            <button
                              onClick={() => handleSaveLink(task.task_id)}
                              className="font-medium py-3 px-6 rounded-lg text-black transition-all duration-300 hover:shadow-lg hover:scale-105"
                              style={{
                                background: "#ffe500",
                              }}
                            >
                              {task.link ? "Update" : "Save"}
                            </button>
                          </div>
                          {task.link && (
                            <p className="text-sm text-green-600 mt-2 bg-green-50 p-2 rounded-lg inline-block">
                              Current link: {task.link}
                            </p>
                          )}
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-800 italic p-4 bg-gray-50 rounded-lg">No tasks available for this campaign.</p>
                    )}
                  </ul>
                )}
              </div>

              <div className="animate-fadeInDelay" style={{ animationDelay: "500ms" }}>
                <h3 className="text-xl font-semibold mb-3 text-black">
                  Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.keywords &&
                    data.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="text-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                        style={{
                          background: "#fff9c2",
                          color: "#000",
                          boxShadow: "0 2px 5px rgba(255, 230, 0, 0.15)",
                          animation: `fadeInTag 0.5s ease-out forwards ${index * 0.1}s`
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                </div>
              </div>

              <div className="pt-6 border-t border-yellow-200 animate-fadeInDelay" style={{ animationDelay: "600ms" }}>
                {error && <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-lg">{error}</p>}
                {!alreadyApplied ? (
                  <button
                    onClick={() => handleApplyToCampaign(data.campaign_id, userId)}
                    className="w-full py-4 text-black font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-500 disabled:bg-gray-400 text-lg hover:scale-101"
                    style={{
                      background: isApplying 
                        ? "#f0e100"
                        : "#ffe500",
                      boxShadow: "0 8px 20px rgba(255, 230, 0, 0.25)",
                      animation: "pulse 2s infinite"
                    }}
                    disabled={isApplying}
                  >
                    {isApplying ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                        Applying...
                      </div>
                    ) : (
                      <>
                        Apply for Campaign
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 animate-bounce"
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
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        @keyframes glow {
          from {
            text-shadow: 0 0 2px #ffe500, 0 0 5px rgba(255, 230, 0, 0.5);
          }
          to {
            text-shadow: 0 0 6px #ffe500, 0 0 12px rgba(255, 230, 0, 0.8);
          }
        }
        
        @keyframes shimmer {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDelay {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInTag {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes kenBurns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.05);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.7s ease-out forwards;
        }
        
        .animate-kenBurns {
          animation: kenBurns 10s ease-out infinite alternate;
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }
      `}</style>
    </>
  );
};

export default OngoingComponentCard;