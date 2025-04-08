"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/constants/api';
import moment from 'moment';
import Image from 'next/image';

const OngoingCampaignCard = ({ campaign, userId }) => {
  const router = useRouter();
  const [taskLinks, setTaskLinks] = useState({});
  const [savingStatus, setSavingStatus] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [error, setError] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const handleViewDetails = () => {
    setIsModalOpen(true);
    fetchTasks();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchTasks = async () => {
    if (!campaign.tasks) {
      setIsLoadingTasks(true);
      try {
        // If tasks aren't already included in the campaign object, fetch them
        const response = await api.get(`/campaign-tasks/${campaign.campaign_id}`);
        setTasks(response.data || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      } finally {
        setIsLoadingTasks(false);
      }
    } else {
      // Use the tasks already included in the campaign object
      setTasks(campaign.tasks);
    }
  };

  const handleInputChange = (taskId, value) => {
    setTaskLinks(prev => ({
      ...prev,
      [taskId]: value
    }));
  };

  const handleSaveLink = async (taskId) => {
    if (!taskLinks[taskId]) return;
    
    setSavingStatus(prev => ({ ...prev, [taskId]: 'saving' }));
    
    try {
      await api.post('/savelink', {
        user_id: userId,
        campaign_id: campaign.campaign_id,
        task_id: taskId,
        link: taskLinks[taskId]
      });
      
      setSavingStatus(prev => ({ ...prev, [taskId]: 'success' }));
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSavingStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[taskId];
          return newStatus;
        });
      }, 3000);
      
    } catch (error) {
      console.error("Error saving link:", error);
      setSavingStatus(prev => ({ ...prev, [taskId]: 'error' }));
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSavingStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[taskId];
          return newStatus;
        });
      }, 3000);
    }
  };

  const handleApplyToCampaign = async (campaignId, userId) => {
    setIsApplying(true);
    setError(null);
    
    try {
      await api.post('/apply-campaign', {
        user_id: userId,
        campaign_id: campaignId
      });
      setAlreadyApplied(true);
    } catch (error) {
      console.error("Error applying to campaign:", error);
      setError("Failed to apply for this campaign. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const formatModalDate = (date) => {
    return moment(date).format('MMM DD, YYYY');
  };

  const renderSaveButton = (taskId) => {
    const status = savingStatus[taskId];
    
    if (status === 'saving') {
      return (
        <button disabled className="ml-2 px-3 py-1 bg-gray-400 text-white rounded-md flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving
        </button>
      );
    } else if (status === 'success') {
      return (
        <button disabled className="ml-2 px-3 py-1 bg-green-500 text-white rounded-md flex items-center">
          <svg className="-ml-1 mr-2 h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Saved
        </button>
      );
    } else if (status === 'error') {
      return (
        <button disabled className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md flex items-center">
          <svg className="-ml-1 mr-2 h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Error
        </button>
      );
    }
    
    return (
      <button 
        onClick={() => handleSaveLink(taskId)}
        className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
      >
        Save
      </button>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl">
        {/* Campaign Image */}
        <div className="h-48 w-full relative overflow-hidden">
          <img 
            src={campaign.campaign_img || '/images/default-campaign.jpg'} 
            alt={campaign.campaign_name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-70"></div>
          <div className="absolute bottom-4 left-4">
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
              Ongoing
            </span>
          </div>
        </div>

        <div className="p-5">
          {/* Campaign Name and Description */}
          <h3 className="text-xl font-bold mb-2 line-clamp-1">{campaign.campaign_name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.campaign_description || campaign.description}</p>
          
          {/* Campaign Details */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="text-sm text-gray-600">
                {moment(campaign.start_date || campaign.startdate).format('MMM DD')} - {moment(campaign.end_date || campaign.enddate).format('MMM DD, YYYY')}
              </span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm text-gray-600">${campaign.budget}</span>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Tasks:</h4>
            <ul className="space-y-3">
              {campaign.tasks && campaign.tasks.map((task) => (
                <li key={task.task_id} className="border-b border-gray-100 pb-3">
                  <p className="text-sm mb-2">{task.task_description || task.description}</p>
                  <div className="flex flex-wrap items-center">
                    <input
                      type="text"
                      placeholder="Add link for this task"
                      value={taskLinks[task.task_id] || ''}
                      onChange={(e) => handleInputChange(task.task_id, e.target.value)}
                      className="flex-1 text-sm px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {renderSaveButton(task.task_id)}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Keywords */}
          {campaign.keywords && campaign.keywords.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {campaign.keywords.map((keyword, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* View Details Button */}
          <button
            onClick={handleViewDetails}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium mt-2"
          >
            View Details
          </button>
        </div>
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
                  src={campaign.campaign_img || campaign.imageUrl || "/loginwomen.svg"}
                  alt={campaign.campaign_name || "Campaign Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
              </div>

              {/* Campaign name overlay */}
              <div className="absolute bottom-0 left-0 z-20 p-6 w-full">
                <h2 className="text-2xl font-bold text-white">
                  {campaign.campaign_name}
                </h2>
                <p className="text-white/90 text-lg">by {campaign.company_name}</p>
              </div>
            </div>

            {/* Campaign details */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600">{campaign.campaign_description || campaign.description}</p>
              </div>

              {/* Goals */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Campaign Goals
                </h3>
                <p className="text-gray-600">{campaign.goals}</p>
              </div>

              {/* Budget */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Budget
                </h3>
                <div className="bg-blue-50 rounded-lg p-3 inline-block">
                  <span className="text-blue-600 font-semibold">
                    ${campaign.budget}
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
                      {formatModalDate(campaign.start_date || campaign.startdate)}
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
                      {formatModalDate(campaign.end_date || campaign.enddate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tasks with input fields for links */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Tasks
                </h3>
                {isLoadingTasks ? (
                  <p>Loading tasks...</p>
                ) : (
                  <ul className="space-y-4">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <li key={task.task_id} className="border-b border-gray-100 pb-4">
                          <div className="mb-2">
                            <strong className="text-gray-700">{task.task_description || task.description}</strong>
                            <div className="text-sm text-gray-500">
                              Due: {task.due_date ? formatModalDate(task.due_date) : 'Not specified'}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center mt-2">
                            <input
                              type="text"
                              placeholder="Add link for this task"
                              value={taskLinks[task.task_id] || ''}
                              onChange={(e) => handleInputChange(task.task_id, e.target.value)}
                              className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {renderSaveButton(task.task_id)}
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
                  {campaign.keywords &&
                    campaign.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                </div>
              </div>

              {/* Apply Button - Only shown if needed (keeping from original modal) */}
              <div className="pt-4 border-t border-gray-200">
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                
                {!alreadyApplied ? (
                  <button
                    onClick={() => handleApplyToCampaign(campaign.campaign_id, userId)}
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
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OngoingCampaignCard;