"use client";
// pages/register.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Image from 'next/image';
import api from '@/constants/api';
import { useRouter } from 'next/navigation';
import GradientCircularProgress from '@/components/GradientCircularProgress'; // Import the component

export default function Register() {
  // Form data state with new fields for influencers
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    contactInfo: '',
    role: 'influencer', // Hardcoded as this is the influencer signup page
    gender: '',
    age: '',
    country: ''
  });

  // Separate state for profile picture file
  const [profilePic, setProfilePic] = useState(null);

  // State to track form submission
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading

  const router = useRouter();

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

  // Password validation and strength calculation
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
    
    switch(score) {
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

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission with FormData
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password requirements and profile picture
    const allRequirementsMet = Object.values(validationErrors).every(value => value === true);
    if (allRequirementsMet && profilePic) {
      setIsSubmitting(true); // Start loading animation

      // Create FormData object for multipart/form-data submission
      const submitData = new FormData();
      for (const key in formData) {
        submitData.append(key, formData[key]);
      }
      submitData.append('file', profilePic); // File must be appended with key 'file' for multer

      try {
        const response = await api.post('/auth/signup', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' } // Optional with axios
        });
        
        console.log(response);
        const data = response.data;
        if (data.success) {
          console.log(data.message);
          router.push('/login');
        } else {
          console.log(data.message);
          alert(data.message); // Show error message from backend
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred during signup. Please try again.');
      } finally {
        setIsSubmitting(false); // Stop loading animation
      }
    } else {
      alert('Please meet all password requirements and upload a profile picture before submitting');
    }
  };

  return (
    <>
      <Head>
        <title>Register | Influencer Signup</title>
        <meta name="description" content="Sign up as an influencer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen w-full overflow-y-auto bg-gradient-to-br from-blue-50 to-white">
        {/* Left section - Form */}
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-5">Become an Influencer</h1>
            </motion.div>

            <form className='overflow-y-auto' onSubmit={handleSubmit}>
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
                    placeholder="balamia@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    required
                  />
                </motion.div>

                {/* Password with strength meter */}
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
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${validationErrors.uppercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-xs text-gray-600">Uppercase letter</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${validationErrors.lowercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-xs text-gray-600">Lowercase letter</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${validationErrors.special ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-xs text-gray-600">Special character</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${validationErrors.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-xs text-gray-600">8+ characters</span>
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
                    placeholder="e.g. Nimesh"
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
                    placeholder="e.g. Jayasinghe"
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
                    placeholder="Your phone number"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    required
                  />
                </motion.div>

                {/* Gender */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </motion.div>

                {/* Age */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    required
                  />
                </motion.div>

                {/* Country */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    required
                  />
                </motion.div>

                {/* Profile Picture */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <input
                    type="file"
                    onChange={(e) => setProfilePic(e.target.files[0])}
                    className="w-full px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200"
                    required
                  />
                </motion.div>

                {/* Continue Button with Loading Animation */}
                <motion.button
                  type="submit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  whileHover={{ scale: 1.02, backgroundColor: '#e7b844' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-500 text-center rounded-md text-gray-800 font-medium shadow-sm transition duration-200 mt-6 mb-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting} // Disable button during submission
                >
                  {isSubmitting ? <GradientCircularProgress size={24} /> : 'Continue'} {/* Show loader or text */}
                </motion.button>

                {/* Login Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                  className="text-center mt-4"
                >
                  <span className="text-gray-600 mt-0.5">Already Have an Account? </span>
                  <a href="/login" className="text-blue-600 hover:underline font-medium">Login</a>
                </motion.div>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Right section - Image */}
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
              src={'/registorlady.png'}
              width={500}
              height={500}
              alt='Register Image'
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
              ease: "easeInOut"
            }}
            className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-200 rounded-full opacity-30"
          />
          <motion.div
            animate={{ 
              rotate: [0, -10, 0, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 15,
              ease: "easeInOut" 
            }}
            className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100 rounded-full opacity-20"
          />
        </motion.div>
      </div>
    </>
  );
}