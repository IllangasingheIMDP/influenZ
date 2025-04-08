"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FaUser, FaYoutube } from "react-icons/fa";
import api from "@/constants/api"

const CampaignTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const campaign_id = searchParams.get('campaign_id');
    
    if (!campaign_id) {
      setLoading(false);
      setError("Campaign ID is missing");
      return;
    }
    
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/brand/tasks/${campaign_id}`);
        setTasks(response.data);
      } catch (err) {
        setError("Failed to load tasks");
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [searchParams]);
  
  // Function to extract YouTube video ID from link
  const extractYoutubeVideoId = (url) => {
    if (!url) return null;
    
    // Handle various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  // Group tasks by description
  const groupedTasks = tasks.reduce((acc, task) => {
    const taskName = task.description || `Task ${task.task_id}`;
    
    if (!acc[taskName]) {
      acc[taskName] = {
        id: taskName.replace(/[^a-zA-Z0-9]/g, ''),
        name: taskName,
        participants: []
      };
    }
    
    acc[taskName].participants.push(task);
    return acc;
  }, {});
  
  // Calculate completion percentages for each task group
  Object.values(groupedTasks).forEach(taskGroup => {
    const completedTasks = taskGroup.participants.filter(task => 
      task.status === "completed" || task.got >= task.expected
    ).length;
    
    taskGroup.completionPercentage = Math.round((completedTasks / taskGroup.participants.length) * 100);
    taskGroup.usersCount = taskGroup.participants.length;
  });
  
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-xl font-semibold mb-2">Loading tasks...</div>
      </div>
    </div>
  );
  
  if (error) return <p className="text-red-500">{error}</p>;
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* YouTube Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full overflow-hidden">
              <div className="p-4 flex justify-between items-center border-b">
                <h3 className="font-semibold text-lg">YouTube Video</h3>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Campaign Tasks</h1>
            
            {tasks.length === 0 ? (
              <p className="text-center py-12 text-gray-500">No tasks available for this campaign.</p>
            ) : (
              Object.values(groupedTasks).map((taskGroup) => (
                <div key={taskGroup.id} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      <span className="text-sm">{taskGroup.id.substring(0, 2)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{taskGroup.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{taskGroup.usersCount} Users participating</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-blue-600">{taskGroup.completionPercentage || 0}%</span>
                          <span>Completion Percentage</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-100 rounded-lg overflow-hidden mb-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500">
                          <th className="py-3 px-4 text-left font-medium">Influencer</th>
                          <th className="py-3 px-4 text-left font-medium">Due Date</th>
                          <th className="py-3 px-4 text-left font-medium">Status</th>
                          <th className="py-3 px-4 text-left font-medium">Completion</th>
                          <th className="py-3 px-4 text-left font-medium">Reach</th>
                          <th className="py-3 px-4 text-left font-medium">Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {taskGroup.participants.map((task) => {
                          // Calculate individual completion percentage
                          const completionPercentage = task.expected > 0 
                            ? Math.min(Math.round((task.got / task.expected) * 100), 100) 
                            : (task.status === "completed" ? 100 : 0);
                          
                          // Extract YouTube video ID
                          const videoId = extractYoutubeVideoId(task.link);
                          
                          return (
                            <tr key={task.task_id} className="border-t border-gray-100">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                    <FaUser />
                                  </div>
                                  <span className="font-medium">{task.firstName} {task.lastName}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-gray-600">{task.due_date || "N/A"}</td>
                              <td className="py-3 px-4 text-gray-600">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  task.status === "completed" 
                                    ? "bg-green-100 text-green-600" 
                                    : task.status === "in_progress" 
                                      ? "bg-yellow-100 text-yellow-600" 
                                      : "bg-gray-100 text-gray-600"
                                }`}>
                                  {task.status || "Pending"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        completionPercentage === 100 
                                          ? 'bg-green-500' 
                                          : completionPercentage >= 75 
                                            ? 'bg-yellow-500' 
                                            : 'bg-blue-500'
                                      }`}
                                      style={{ width: `${completionPercentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="font-medium">{completionPercentage}%</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                  {task.got}/{task.expected}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {videoId ? (
                                  <button
                                    onClick={() => setSelectedVideo(videoId)}
                                    className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                  >
                                    <FaYoutube className="text-lg" />
                                    <span>Watch</span>
                                  </button>
                                ) : task.link ? (
                                  <a
                                    href={task.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                                  >
                                    View Link
                                  </a>
                                ) : (
                                  <span className="text-gray-500">No link</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignTasks;