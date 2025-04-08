"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import api from "@/constants/api"; // Import your API instance
import { FaFacebookF, FaYoutube, FaInstagram, FaTiktok, FaCalendarAlt, FaClipboardList, FaPlus, FaFlag } from "react-icons/fa";
import { motion } from "framer-motion";

const CampaignTasks = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const campaign_id = searchParams.get("campaign_id"); // Extract campaign_id from URL

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        description: "",
        due_date: "",
        goal: "",
        platforms: { facebook: false, youtube: false, instagram: false, tiktok: false },
    });

    useEffect(() => {
        if (campaign_id) fetchTasks();
    }, [campaign_id]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/brand/addtask/${campaign_id}`);
            setTasks(response.data.tasks || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            platforms: type === "checkbox" ? { ...prev.platforms, [name]: checked } : prev.platforms,
            ...(type !== "checkbox" && { [name]: value }),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!campaign_id) return;

        try {
            await api.post(`/brand/addtask/${campaign_id}`, formData);
            fetchTasks();
            setFormData({
                description: "",
                due_date: "",
                goal: "",
                platforms: { facebook: false, youtube: false, instagram: false, tiktok: false },
            });
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Platform configuration with their respective colors and icons
    const platformConfig = {
        facebook: { 
            icon: <FaFacebookF />, 
            color: "bg-blue-600", 
            hoverColor: "hover:bg-blue-700", 
            label: "Facebook" 
        },
        youtube: { 
            icon: <FaYoutube />, 
            color: "bg-red-600", 
            hoverColor: "hover:bg-red-700", 
            label: "YouTube" 
        },
        instagram: { 
            icon: <FaInstagram />, 
            color: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500", 
            hoverColor: "hover:bg-pink-600", 
            label: "Instagram" 
        },
        tiktok: { 
            icon: <FaTiktok />, 
            color: "bg-black", 
            hoverColor: "hover:bg-gray-800", 
            label: "TikTok" 
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Campaign Tasks</h2>
                            <p className="mt-1 text-gray-500">Manage and organize your campaign deliverables</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                Campaign ID: {campaign_id || "None"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Task Form */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                        <FaPlus className="text-indigo-500 mr-2" /> Add New Task
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Task Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="Describe the task in detail..."
                                rows="3"
                                required
                            ></textarea>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Date
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaCalendarAlt className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        id="due_date"
                                        name="due_date"
                                        value={formData.due_date}
                                        onChange={handleInputChange}
                                        className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                                    Goal (Numeric)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaFlag className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        id="goal"
                                        name="goal"
                                        value={formData.goal}
                                        onChange={handleInputChange}
                                        className="pl-10 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Enter numeric goal"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="block text-sm font-medium text-gray-700 mb-3">Target Platforms</p>
                            <div className="flex flex-wrap gap-4">
                                {Object.entries(platformConfig).map(([platform, config]) => (
                                    <label 
                                        key={platform} 
                                        className={`flex items-center px-4 py-2 rounded-lg border transition-all cursor-pointer
                                            ${formData.platforms[platform] 
                                                ? `${config.color} text-white border-transparent` 
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        <input
                                            type="checkbox"
                                            name={platform}
                                            checked={formData.platforms[platform]}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <span className="mr-2">{config.icon}</span>
                                        {config.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className={`w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all flex items-center justify-center
                                    ${!campaign_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!campaign_id}
                            >
                                <FaPlus className="mr-2" /> Add Task
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tasks List */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                        <FaClipboardList className="text-indigo-500 mr-2" /> Current Tasks
                    </h3>
                    
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-indigo-600"></div>
                            <p className="mt-2 text-gray-500">Loading tasks...</p>
                        </div>
                    ) : tasks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tasks.map((task, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-semibold text-lg text-gray-800">Task {index + 1}</h4>
                                            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">
                                                Due: {new Date(task.due_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-3">{task.description}</p>
                                        {task.goal && (
                                            <div className="mb-3 flex items-center text-sm">
                                                <FaFlag className="text-indigo-500 mr-1" />
                                                <span>Goal: <strong>{task.goal}</strong></span>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            {/* Check each platform directly at the task root level */}
                                            {task.facebook && (
                                                <span 
                                                    className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${platformConfig.facebook.color} text-white`}
                                                >
                                                    <span className="mr-1">{platformConfig.facebook.icon}</span>
                                                    {platformConfig.facebook.label}
                                                </span>
                                            )}
                                            {task.youtube && (
                                                <span 
                                                    className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${platformConfig.youtube.color} text-white`}
                                                >
                                                    <span className="mr-1">{platformConfig.youtube.icon}</span>
                                                    {platformConfig.youtube.label}
                                                </span>
                                            )}
                                            {task.instagram && (
                                                <span 
                                                    className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${platformConfig.instagram.color} text-white`}
                                                >
                                                    <span className="mr-1">{platformConfig.instagram.icon}</span>
                                                    {platformConfig.instagram.label}
                                                </span>
                                            )}
                                            {task.tiktok && (
                                                <span 
                                                    className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${platformConfig.tiktok.color} text-white`}
                                                >
                                                    <span className="mr-1">{platformConfig.tiktok.icon}</span>
                                                    {platformConfig.tiktok.label}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <div className="text-gray-400 inline-block mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                            <h4 className="text-xl font-medium text-gray-800 mb-2">No Tasks Created</h4>
                            <p className="text-gray-500">Start by adding your first task above.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignTasks;