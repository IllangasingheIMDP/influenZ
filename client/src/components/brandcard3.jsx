"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/constants/api";

const MostInteractedInfluencers = ({userId}) => {
  const [influencers, setInfluencers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const res = await api.get(`/brand/most-interacted/${userId}`);
        setInfluencers(res.data.influencers || []);
      } catch (err) {
        console.error("Error fetching influencers:", err);
        setError("Failed to fetch influencers.");
      }
    };
    fetchInfluencers();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-600">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </span>
        Most Interacted Influencers
      </h2>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {influencers.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No influencer interactions found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {influencers.map((influencer, index) => (
            <div key={index} className="bg-gray-50 rounded-md p-3 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
              <div className="font-medium text-gray-800 mb-1 truncate">
                {influencer.firstName} {influencer.lastName}
              </div>
              <div className="text-sm text-gray-600 truncate">
                <span className="font-medium text-indigo-600">Email:</span> {influencer.email}
              </div>
              <div className="text-sm text-gray-600 truncate">
                <span className="font-medium text-indigo-600">Contact:</span> {influencer.contact_info}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MostInteractedInfluencers;