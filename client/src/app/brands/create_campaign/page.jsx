'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaYoutube, FaFacebook, FaInstagram, FaTiktok, FaImage } from 'react-icons/fa';
import api from '@/constants/api';

export default function CreateCampaign() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expectedReach: 1000,
    budget: 100,
    startDate: '',
    endDate: '',
    youtube: false,
    facebook: false,
    instagram: false,
    tiktok: false,
    camp_img: '' // Adding image URL field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size validation (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // File type validation
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, or WEBP)');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      // Create a FormData object to send the file to Cloudinary
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'campaign_images'); // Replace with your Cloudinary upload preset

      // Upload to Cloudinary
      const response = await fetch('https://api.cloudinary.com/v1_1/dacknfqtw/image/upload', {
        method: 'POST',
        body: data
      });

      const imageData = await response.json();
      console.log(imageData)
      
      if (imageData.error) {
        throw new Error(imageData.error.message);
      }

      // Set the image URL in form data
      setFormData(prev => ({
        ...prev,
        camp_img: imageData.secure_url
      }));

      // Set preview
      setImagePreview(imageData.secure_url);
    } catch (err) {
      setError('Failed to upload image: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/brand/create_campaign', formData);

      const campaign = response.data?.campaign;

      if (!campaign || !campaign.campaign_id) {
        throw new Error('Invalid response from server');
      }

      // Navigate to AddTask page with campaign_id as a query parameter
      router.push(`/brands/AddTask?campaign_id=${campaign.campaign_id}`);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-yellow-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create a Campaign</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              ></textarea>
            </div>

            {/* Image Upload Section */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Campaign Image:</label>
              <div className="flex items-center">
                <div className="relative mr-4">
                  <input
                    type="file"
                    id="imageUpload"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="imageUpload"
                    className="flex items-center gap-2 cursor-pointer bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-md py-2 px-4 transition duration-200"
                  >
                    <FaImage className="text-indigo-600" />
                    <span>{uploadingImage ? 'Uploading...' : 'Browse Image'}</span>
                  </label>
                </div>
                {formData.camp_img && (
                  <span className="text-green-600 text-sm">✓ Image uploaded</span>
                )}
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <div className="relative w-48 h-48 border rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Campaign preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <p className="block text-gray-700 font-medium mb-2">Open platforms:</p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <FaYoutube className="text-red-600 text-2xl" />
                  <input
                    type="checkbox"
                    id="youtube"
                    name="youtube"
                    checked={formData.youtube}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FaTiktok className="text-black text-2xl" />
                  <input
                    type="checkbox"
                    id="tiktok"
                    name="tiktok"
                    checked={formData.tiktok}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FaFacebook className="text-blue-600 text-2xl" />
                  <input
                    type="checkbox"
                    id="facebook"
                    name="facebook"
                    checked={formData.facebook}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FaInstagram className="text-pink-600 text-2xl" />
                  <input
                    type="checkbox"
                    id="instagram"
                    name="instagram"
                    checked={formData.instagram}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Expected Reaches</label>
                <input
                  type="number"
                  id="expectedReach"
                  name="expectedReach"
                  value={formData.expectedReach}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">Start date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">Expire date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">Budget</label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-yellow-500">$</span>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md shadow-md transition duration-200 disabled:opacity-70"
              >
                {loading ? 'Creating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}