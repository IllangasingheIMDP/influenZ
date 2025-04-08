"use client";
// pages/brand-register.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Image from 'next/image';
import api from '@/constants/api';
import { useRouter } from 'next/navigation';
import GradientCircularProgress from '@/components/GradientCircularProgress';

export default function BrandRegister() {
  // Form data state with fields for brands
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    contactInfo: '',
    role: 'brand', // Hardcoded for brand signup
    company_name: '',
    company_details: '',
    social_media_handles: '' // Will be set dynamically as JSON string
  });

  // State for brand logo file
  const [profilePic, setProfilePic] = useState(null);

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for social media handles
  const [socialHandles, setSocialHandles] = useState({
    tiktok: '',
    youtube: '',
    facebook: '',
    instagram: ''
  });

  const router = useRouter();

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: 'Too weak',
    color: 'bg-red-500'
  });

  const [validationErrors, setValidationErrors] = useState({
    uppercase: false,
    lowercase: false,
    special: false,
    length: false
  });

  // Password validation logic
  useEffect(() => {
    const password = formData.password;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasMinLength = password.length >= 8;

    setValidationErrors({
      uppercase: hasUpperCase,
      lowercase: hasLowerCase,
      special: hasSpecialChar,
      length: hasMinLength
    });

    let score = 0;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasSpecialChar) score++;
    if (hasMinLength) score++;

    let message = '';
    let color = '';

    switch (score) {
      case 0:
      case 1:
        message = 'Too weak';
        color = 'bg-red-500';
        break;
      case 2:
        message = 'Could be stronger';
        color = 'bg-orange-500';
        break;
      case 3:
        message = 'Good';
        color = 'bg-yellow-500';
        break;
      case 4:
        message = 'Strong';
        color = 'bg-green-500';
        break;
      default:
        message = 'Too weak';
        color = 'bg-red-500';
    }

    setPasswordStrength({ score, message, color });
  }, [formData.password]);

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle input changes for social media handles
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSocialHandles((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const allRequirementsMet = Object.values(validationErrors).every((value) => value === true);
    if (allRequirementsMet && profilePic) {
      setIsSubmitting(true);

      // Create JSON object with only non-empty social media handles
      const handlesObject = {};
      if (socialHandles.tiktok) handlesObject.tiktok = socialHandles.tiktok;
      if (socialHandles.youtube) handlesObject.youtube = socialHandles.youtube;
      if (socialHandles.facebook) handlesObject.facebook = socialHandles.facebook;
      if (socialHandles.instagram) handlesObject.instagram = socialHandles.instagram;

      // Convert to JSON string
      const socialMediaJson = JSON.stringify(handlesObject);

      // Update formData with JSON string
      const updatedFormData = {
        ...formData,
        social_media_handles: socialMediaJson
      };

      const submitData = new FormData();
      for (const key in updatedFormData) {
        submitData.append(key, updatedFormData[key]);
      }
      submitData.append('file', profilePic);

      try {
        const response = await api.post('/auth/signup', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const data = response.data;
        if (data.success) {
          console.log(data.message);
          router.push('/login');
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred during signup. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Please meet all password requirements and upload a brand logo.');
    }
  };

  return (
    <>
      <Head>
        <title>Register | Brand Signup</title>
        <meta name="description" content="Sign up as a brand" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen w-full overflow-y-auto bg-gradient-to-br from-blue-50 to-white">
        {/* Left Section - Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center"
        >
          <div className="max-w-md mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-5">Register Your Brand</h1>
            </motion.div>

            <form className="overflow-y-auto" onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. hello@acme.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    required
                  />
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    required
                  />
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Password strength:</span>
                      <span className="text-xs font-medium" style={{ color: passwordStrength.color.replace('bg-', 'text-') }}>
                        {passwordStrength.message}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${validationErrors.uppercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-xs text-gray-600">Uppercase</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${validationErrors.lowercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-xs text-gray-600">Lowercase</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${validationErrors.special ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-xs text-gray-600">Special char</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${validationErrors.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-xs text-gray-600">8+ chars</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* First Name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="e.g. John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    required
                  />
                </motion.div>

                {/* Last Name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="e.g. Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    required
                  />
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                  <input
                    type="tel"
                    name="contactInfo"
                    placeholder="e.g. +1234567890"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    required
                  />
                </motion.div>

                {/* Company Name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder="e.g. Acme Inc."
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    required
                  />
                </motion.div>

                {/* Company Details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Details</label>
                  <textarea
                    name="company_details"
                    placeholder="Tell us about your company"
                    value={formData.company_details}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    rows="4"
                    required
                  ></textarea>
                </motion.div>

                {/* Social Media Handles */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Handles</label>
                  <div className="space-y-3">
                    {/* TikTok */}
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-gray-600">TikTok</label>
                      <input
                        type="text"
                        name="tiktok"
                        placeholder="@handle"
                        value={socialHandles.tiktok}
                        onChange={handleSocialChange}
                        className="flex-1 px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                      />
                    </div>
                    {/* YouTube */}
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-gray-600">YouTube</label>
                      <input
                        type="text"
                        name="youtube"
                        placeholder="@handle"
                        value={socialHandles.youtube}
                        onChange={handleSocialChange}
                        className="flex-1 px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                      />
                    </div>
                    {/* Facebook */}
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-gray-600">Facebook</label>
                      <input
                        type="text"
                        name="facebook"
                        placeholder="@handle"
                        value={socialHandles.facebook}
                        onChange={handleSocialChange}
                        className="flex-1 px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                      />
                    </div>
                    {/* Instagram */}
                    <div className="flex items-center">
                      <label className="w-24 text-sm text-gray-600">Instagram</label>
                      <input
                        type="text"
                        name="instagram"
                        placeholder="@handle"
                        value={socialHandles.instagram}
                        onChange={handleSocialChange}
                        className="flex-1 px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Brand Logo */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Logo</label>
                  <input
                    type="file"
                    onChange={(e) => setProfilePic(e.target.files[0])}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    required
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  whileHover={{ scale: 1.02, backgroundColor: '#e7b844' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-500 text-center rounded-md text-gray-800 font-medium shadow-sm transition duration-200 mt-6 mb-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <GradientCircularProgress size={24} /> : 'Continue'}
                </motion.button>

                {/* Login Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                  className="text-center mt-4"
                >
                  <span className="text-gray-600 mt-0.5">Already have an account? </span>
                  <a href="/login" className="text-blue-600 hover:underline font-medium">Login</a>
                </motion.div>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Right Section - Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-300 to-blue-500 relative overflow-hidden"
        >
          <div className="absolute top-10 left-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
             <Image
              src="/logo_inf.png"
              width={50}
              height={50}
              alt="Register Image"
            />
            </motion.div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-tl-lg rounded-bl-lg">
            <Image
              src="/brand_reg.jpg"
              width={500}
              height={500}
              alt="Register Image"
            />
          </div>
          <motion.div
            animate={{
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.05, 1, 1.05, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: 'easeInOut'
            }}
            className="absolute -bottom-32 -right-32 w-64 h-64 bg-orange-200 rounded-full opacity-30"
          />
          <motion.div
            animate={{
              rotate: [0, -10, 0, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: 'easeInOut'
            }}
            className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100 rounded-full opacity-20"
          />
        </motion.div>
      </div>
    </>
  );
}