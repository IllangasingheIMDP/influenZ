// app/search/page.jsx
'use client'
import { useState, useEffect } from 'react';
import { useRouter,useSearchParams } from 'next/navigation';
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
    const matchesSearch = influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    brand.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-yellow-50 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-yellow-50 flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-yellow-50 flex">
      {/* Filters Sidebar */}
      <div className="w-64 p-4 bg-white border-r border-yellow-200">
        <div className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showInfluencers}
                onChange={(e) => setShowInfluencers(e.target.checked)}
                className="form-checkbox text-pink-500"
              />
              <span>Influencers</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showBrands}
                onChange={(e) => setShowBrands(e.target.checked)}
                className="form-checkbox text-pink-500"
              />
              <span>Brands</span>
            </label>
          </div>

          {showInfluencers && (
            <div className="space-y-4">
              {/* Age Filter */}
              <div className="space-y-2">
                <h3 className="font-semibold">Age Range</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={ageRange.min}
                    onChange={(e) => setAgeRange({...ageRange, min: e.target.value})}
                    className="w-1/2 p-1 border rounded"
                  />
                  <input
                    type="number"
                    value={ageRange.max}
                    onChange={(e) => setAgeRange({...ageRange, max: e.target.value})}
                    className="w-1/2 p-1 border rounded"
                  />
                </div>
              </div>

              {/* Gender Filter */}
              <div className="space-y-2">
                <h3 className="font-semibold">Gender</h3>
                {uniqueGenders.map(gender => (
                  <label key={gender} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="gender"
                      checked={selectedGender === gender}
                      onChange={() => setSelectedGender(gender)}
                      className="form-radio text-pink-500"
                    />
                    <span>{gender}</span>
                  </label>
                ))}
              </div>

              {/* Country Filter */}
              <div className="space-y-2">
                <h3 className="font-semibold">Country</h3>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Countries</option>
                  {uniqueCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Tags Filter */}
              <div className="space-y-2">
                <h3 className="font-semibold">Tags</h3>
                {uniqueTags.map(tag => (
                  <label key={tag} className="flex items-center space-x-2">
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
                      className="form-checkbox text-pink-500"
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>

              {/* Tier Filter */}
              <div className="space-y-2">
                <h3 className="font-semibold">Tier</h3>
                {['Nano', 'Micro', 'Mid Tier', 'Top Tier'].map(tier => (
                  <label key={tier} className="flex items-center space-x-2">
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
                      className="form-checkbox text-pink-500"
                    />
                    <span>{tier}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showInfluencers && filteredInfluencers.map(influencer => (
            <div
              key={influencer.user_id}
              className="bg-gradient-to-r from-pink-200 to-yellow-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
              onClick={()=>router.push(`/brands/influencer_profile/${influencer.user_id}`)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={influencer.profile_pic || '/default-profile.png'}
                  alt={influencer.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => e.target.src = '/default-profile.png'}
                />
                <div>
                  <h3 className="text-xl font-bold">{influencer.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{influencer.country}</p>
                    <p>Age: {influencer.age}</p>
                    <p>Gender: {influencer.gender}</p>
                  </div>
                  <span className="inline-block px-2 py-1 mt-1 text-sm bg-yellow-100 rounded-full">
                    {getTier(influencer.total_subscribers)}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {influencer.tags?.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm">Subscribers: {influencer.total_subscribers}</p>
                  <p className="text-sm">Avg Likes: {influencer.avg_likes_per_video?.toLocaleString()}</p>
                </div>
                <button className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors">
                  Connect
                </button>
              </div>
              <div className="mt-4 flex space-x-2">
                {influencer.social_media_handles && Object.entries(influencer.social_media_handles).map(([platform, handle]) => (
                  <SocialIcon
                    key={platform}
                    url={`https://${platform}.com/${handle}`}
                    style={{ width: 32, height: 32 }}
                  />
                ))}
              </div>
            </div>
          ))}

          {showBrands && filteredBrands.map(brand => (
            <div
              key={brand.user_id}
              className="bg-gradient-to-r from-pink-200 to-yellow-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => router.push(`/brands/brand_profile/${brand.user_id}`)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={brand.company_pic}
                  alt={brand.company_name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold">{brand.company_name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{brand.company_details}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors">
                  Connect
                </button>
              </div>
              <div className="mt-4 flex space-x-2">
                {brand.social_media_handles && Object.entries(brand.social_media_handles).map(([platform, handle]) => (
                  <SocialIcon
                    key={platform}
                    url={`https://${platform}.com/${handle}`}
                    style={{ width: 32, height: 32 }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}