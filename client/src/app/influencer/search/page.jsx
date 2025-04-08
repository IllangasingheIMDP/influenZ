'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SocialIcon } from 'react-social-icons';
import api from '@/utils/api';


export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showInfluencers, setShowInfluencers] = useState(true);
  const [showBrands, setShowBrands] = useState(true);
  const [selectedTiers, setSelectedTiers] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [ageRange, setAgeRange] = useState({ min: 0, max: 100 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ influencers: [], brands: [] });
  const router = useRouter();

  // Update searchQuery when URL param changes
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/influencer/verified-influencers-and-brands');
        setData({
          influencers: res.data.influencers,
          brands: res.data.brands
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get unique filter options
  const uniqueGenders = [...new Set(data.influencers.map(i => i.gender))].filter(Boolean);
  const uniqueCountries = [...new Set(data.influencers.map(i => i.country))].filter(Boolean);
  const uniqueTags = [...new Set(data.influencers.flatMap(i => i.tags || []))].filter(Boolean);

  const getTier = (subscribers) => {
    if (subscribers < 100) return 'Nano';
    if (subscribers < 1000) return 'Micro';
    if (subscribers < 5000) return 'Mid Tier';
    return 'Top Tier';
  };

  const filteredInfluencers = data.influencers.filter(influencer => {
    const matchesSearch = influencer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesSearch &&
      (!selectedGender || influencer.gender === selectedGender) &&
      (!selectedCountry || influencer.country === selectedCountry) &&
      (!selectedTags.length || (influencer.tags && selectedTags.every(tag => influencer.tags.includes(tag)))) &&
      (!selectedTiers.length || selectedTiers.includes(getTier(influencer.total_subscribers))) &&
      influencer.age >= ageRange.min &&
      influencer.age <= ageRange.max
    );
  });

  const filteredBrands = data.brands.filter(brand => 
    brand.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Update URL with search query
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-pink-600 font-medium">Loading results...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
        <div className="text-red-500 text-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-center mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header and Search Bar */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-pink-600">Discover Creators & Brands</h1>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden bg-white p-2 rounded-lg shadow text-pink-600"
            >
              {sidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search influencers and brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-12 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              type="submit"
              className="absolute right-0 inset-y-0 px-6 rounded-r-full bg-pink-500 text-white font-medium hover:bg-pink-600 transition duration-200"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block bg-white rounded-2xl shadow-lg p-6 w-full md:w-80 lg:w-96 h-fit sticky top-6`}>
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Filter Results</h2>
                
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mb-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showInfluencers}
                      onChange={(e) => setShowInfluencers(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Influencers</span>
                  </label>
                </div>

                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mb-6">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showBrands}
                      onChange={(e) => setShowBrands(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Brands</span>
                  </label>
                </div>
              </div>

              {showInfluencers && (
                <div className="space-y-6 divide-y divide-gray-100">
                  {/* Age Filter */}
                  <div className="pt-4">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Age Range
                    </h3>
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">{ageRange.min}</span>
                        <span className="text-sm text-gray-600">{ageRange.max}</span>
                      </div>
                      <div className="pt-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={ageRange.min}
                          onChange={(e) => setAgeRange({...ageRange, min: parseInt(e.target.value)})}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={ageRange.max}
                          onChange={(e) => setAgeRange({...ageRange, max: parseInt(e.target.value)})}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gender Filter */}
                  <div className="pt-4">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Gender
                    </h3>
                    <div className="space-y-2">
                      <label className="inline-flex items-center bg-gray-50 px-3 py-2 rounded-lg w-full hover:bg-gray-100 transition cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          checked={selectedGender === ''}
                          onChange={() => setSelectedGender('')}
                          className="form-radio text-pink-500"
                        />
                        <span className="ml-2">All Genders</span>
                      </label>
                      {uniqueGenders.map(gender => (
                        <label key={gender} className="inline-flex items-center bg-gray-50 px-3 py-2 rounded-lg w-full hover:bg-gray-100 transition cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            checked={selectedGender === gender}
                            onChange={() => setSelectedGender(gender)}
                            className="form-radio text-pink-500"
                          />
                          <span className="ml-2">{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Country Filter */}
                  <div className="pt-4">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      Country
                    </h3>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    >
                      <option value="">All Countries</option>
                      {uniqueCountries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tier Filter */}
                  <div className="pt-4">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Tier
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['Nano', 'Micro', 'Mid Tier', 'Top Tier'].map(tier => (
                        <label 
                          key={tier} 
                          className={`inline-flex justify-center items-center px-4 py-2 rounded-lg border ${
                            selectedTiers.includes(tier) 
                              ? 'bg-pink-500 text-white border-pink-500' 
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          } cursor-pointer transition-colors`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTiers.includes(tier)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTiers([...selectedTiers, tier]);
                              } else {
                                setSelectedTiers(selectedTiers.filter(t => t !== tier));
                              }
                            }}
                            className="sr-only"
                          />
                          <span>{tier}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div className="pt-4">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Tags
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {uniqueTags.map(tag => (
                        <label key={tag} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTags([...selectedTags, tag]);
                              } else {
                                setSelectedTags(selectedTags.filter(t => t !== tag));
                              }
                            }}
                            className="form-checkbox text-pink-500 rounded"
                          />
                          <span className="text-sm">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Reset Filters Button */}
                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setSelectedGender('');
                        setSelectedCountry('');
                        setSelectedTags([]);
                        setSelectedTiers([]);
                        setAgeRange({ min: 0, max: 100 });
                      }}
                      className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Stats */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow">
              <div className="flex justify-between items-center">
                <h2 className="font-medium">
                  Showing {(showInfluencers ? filteredInfluencers.length : 0) + (showBrands ? filteredBrands.length : 0)} results
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select className="bg-gray-50 border border-gray-200 text-gray-700 py-1 px-2 rounded leading-tight focus:outline-none focus:bg-white focus:border-pink-500">
                    <option>Relevance</option>
                    <option>Popularity</option>
                    <option>Recent</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showInfluencers && filteredInfluencers.length > 0 && filteredInfluencers.map(influencer => (
                <div
                  key={influencer.user_id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => router.push(`/influencer/influencer_profile/${influencer.user_id}`)}
                >
                  <div className="h-24 bg-gradient-to-r from-pink-400 to-yellow-400"></div>
                  <div className="px-6 pt-0 pb-6 relative">
                    <div className="flex justify-between items-start">
                      <img
                        src={influencer.profile_pic || '/default-profile.png'}
                        alt={influencer.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white -mt-10 shadow-md"
                        onError={(e) => e.target.src = '/default-profile.png'}
                      />
                      <span className={`
                        mt-2 px-3 py-1 rounded-full text-xs font-medium 
                        ${getTier(influencer.total_subscribers) === 'Nano' ? 'bg-blue-100 text-blue-700' : ''}
                        ${getTier(influencer.total_subscribers) === 'Micro' ? 'bg-green-100 text-green-700' : ''}
                        ${getTier(influencer.total_subscribers) === 'Mid Tier' ? 'bg-purple-100 text-purple-700' : ''}
                        ${getTier(influencer.total_subscribers) === 'Top Tier' ? 'bg-yellow-100 text-yellow-700' : ''}
                      `}>
                        {getTier(influencer.total_subscribers)}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-gray-800">{influencer.name}</h3>
                      <div className="text-sm text-gray-600 mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {influencer.country}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <div className="mr-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {influencer.gender}
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {influencer.age} years
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-4">
                      {influencer.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                      {influencer.tags?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          +{influencer.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-3">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Subscribers</p>
                          <p className="font-semibold">{influencer.total_subscribers?.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Avg Likes</p>
                          <p className="font-semibold">{influencer.avg_likes_per_video?.toLocaleString()}</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors text-sm font-medium">
                        Connect
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-100 mt-4 pt-4 flex">
                      {influencer.social_media_handles && Object.entries(influencer.social_media_handles).map(([platform, handle]) => (
                        <SocialIcon
                          key={platform}
                          url={`https://${platform}.com/${handle}`}
                          style={{ width: 28, height: 28 }}
                          className="mr-2"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {showBrands && filteredBrands.length > 0 && filteredBrands.map(brand => (
                <div
                  key={brand.user_id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => router.push(`/influencer/brand_profile/${brand.user_id}`)}
                >
                  <div className="h-24 bg-gradient-to-r from-indigo-400 to-cyan-400"></div>
                  <div className="px-6 pt-0 pb-6 relative">
                    <div className="flex justify-between items-start">
                      <img
                        src={brand.company_pic || '/default-company.png'}
                        alt={brand.company_name}
                        className="w-20 h-20 rounded-lg object-cover border-4 border-white -mt-10 shadow-md"
                        onError={(e) => e.target.src = '/default-company.png'}
                      />
                      <span className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        Brand
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-gray-800">{brand.company_name}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{brand.company_details}</p>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors text-sm font-medium">
                        Connect
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-100 mt-4 pt-4 flex">
                      {brand.social_media_handles && Object.entries(brand.social_media_handles).map(([platform, handle]) => (
                        <SocialIcon
                          key={platform}
                          url={`https://${platform}.com/${handle}`}
                          style={{ width: 28, height: 28 }}
                          className="mr-2"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {((showInfluencers && filteredInfluencers.length > 0) || (showBrands && filteredBrands.length > 0)) && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center bg-white px-4 py-3 rounded-lg shadow">
                  <button className="px-2 py-1 rounded-md text-gray-500 hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="px-3 py-1 rounded-md bg-pink-500 text-white mx-1">1</button>
                  <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 mx-1">2</button>
                  <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 mx-1">3</button>
                  <span className="px-3 py-1 text-gray-500">...</span>
                  <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 mx-1">10</button>
                  <button className="px-2 py-1 rounded-md text-gray-500 hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}