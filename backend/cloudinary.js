import cloudinary from 'cloudinary';
require('dotenv').config(); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,      // Replace with your Cloudinary API Key
  api_secret: process.env.CLOUDINARY_API_SECRET // Replace with your Cloudinary API Secret
});

export default cloudinary;
