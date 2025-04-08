import { useState, useEffect } from "react";
import api from "@/constants/api"; // Adjust path based on your project structure

export default function BrandCard({ userId }) {
  const [brand, setBrand] = useState({
    company_name: "",
    reputation_score: 0,
    company_details: "",
    social_media_handles: {},
    company_pic: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrandDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/brand/details/${userId}`);
        console.log("Brand details:", response.data);
        
        // Clean up potentially inappropriate content
        const cleanedData = {
          ...response.data,
          company_details: sanitizeContent(response.data.company_details)
        };
        console.log("Cleaned data:", cleanedData);
        setBrand(cleanedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch brand details", err);
        setError("Failed to load brand details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandDetails();
  }, []);

  // Function to sanitize content
  const sanitizeContent = (content) => {
    if (!content) return "";
    
    // Replace inappropriate content with a placeholder
    const inappropriate = /\b(fuck|shit|ass|damn|bitch|cunt|dick)\b/gi;
    return content.replace(inappropriate, "***");
  };

  // Helper function to transform social media handles into array format
  const getSocialMediaArray = () => {
    if (!brand.social_media_handles) return [];
    
    const socialMedia = [];
    if (brand.social_media_handles.youtube) {
      socialMedia.push({ platform: "Youtube", handle: brand.social_media_handles.youtube });
    }
    if (brand.social_media_handles.facebook) {
      socialMedia.push({ platform: "Facebook", handle: brand.social_media_handles.facebook });
    }
    // Add more platforms as needed
    return socialMedia;
  };

  // Display loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  const socialMediaArray = getSocialMediaArray();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      {/* Header with logo and name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-shrink-0">
          {brand.company_pic ? (
            <img 
              src={brand.company_pic} 
              alt={brand.company_name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `<div class="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">${brand.company_name ? brand.company_name.charAt(0).toUpperCase() : "?"}</div>`;
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
              {brand.company_name ? brand.company_name.charAt(0).toUpperCase() : "?"}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{brand.company_name}</h2>
            <div className="bg-green-500 text-white rounded-full p-1 shadow-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center mt-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => {
                // Calculate filled stars based on reputation score
                const filledStars = Math.round(brand.reputation_score / 20);
                return (
                  <svg 
                    key={i} 
                    className={`h-5 w-5 ${i < filledStars ? 'text-yellow-400' : 'text-gray-200'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                );
              })}
            </div>
            <span className="ml-2 text-gray-600 text-sm">{brand.reputation_score}/100</span>
          </div>
        </div>
      </div>
      
      {/* About section */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-2">ABOUT</h3>
        <p className="text-gray-700">
          {brand.company_details && brand.company_details.trim() !== "" 
            ? brand.company_details 
            : "No information available about this brand yet."}
        </p>
      </div>
      
      {/* Social Media section */}
      {socialMediaArray.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">SOCIAL MEDIA</h3>
          <div className="grid grid-cols-1 gap-3">
            {socialMediaArray.map((social, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                {social.platform === "Youtube" ? (
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                ) : social.platform === "Facebook" ? (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="text-base font-medium text-gray-800">{social.platform}</p>
                  <p className="text-sm text-gray-500">{social.handle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      {/* <div className="pt-4 border-t border-gray-100 flex justify-between">
        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-md transition-colors flex items-center">
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Profile
        </button>
        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors flex items-center">
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          View Analytics
        </button>
      </div> */}
    </div>
  );
}