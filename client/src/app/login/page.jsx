'use client';
import React, { useState } from 'react';
import api from '@/constants/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Login = () => {
  // State for form inputs and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('influencer'); // Default selected role
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true);

    try {

      if(role.length === 0){
        setError('Please select a role');
        return;
      }
      const response = await api.post(`/auth/${role}/login`, { email, password,role });
     
      const data =response.data;
      if (data.success) {
        console.log('Login successful:', data.message);
       if(role === 'influencer'){
        router.push('/influencer');
       }else if(role === 'brand'){
        router.push('/brands');
       }
       
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-white">
      {/* Left side with image and overlay */}
      <div className="width-full md:w-3/5 relative hidden md:block">
        <Image
          src="/loginwomen.svg"
          alt="Login Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Right side with login form */}
      <div className="flex w-full flex-col justify-center px-8 md:w-2/5 md:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="mr-2 h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-700"></div>
                <h1 className="text-3xl font-extrabold tracking-wider text-gray-800">
                  Welcome To <span className="bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">INFLUENZ</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* User Type Selection */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                I am a
              </label>
              <div className="mt-2 flex space-x-6">
                <div className="flex items-center">
                  <input
                    id="influencer-role"
                    name="role"
                    type="radio"
                    value="influencer"
                    checked={role === 'influencer'}
                    onChange={() => setRole('influencer')}
                    className="h-5 w-5 cursor-pointer text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="influencer-role" className="ml-2 cursor-pointer text-sm font-medium text-gray-700">
                    Influencer
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="brand-role"
                    name="role"
                    type="radio"
                    value="brand"
                    checked={role === 'brand'}
                    onChange={() => setRole('brand')}
                    className="h-5 w-5 cursor-pointer text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="brand-role" className="ml-2 cursor-pointer text-sm font-medium text-gray-700">
                    Brand
                  </label>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 transition duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 transition duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* Remember me and Forgot password */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div>
                <a href="#" className="text-sm font-medium text-amber-600 hover:text-amber-800">
                  Forgot Password
                </a>
              </div>
            </div>

            {/* Login Button */}
            <div className="mb-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full transform rounded-md bg-gradient-to-r from-amber-500 to-amber-700 py-3 font-medium text-white transition duration-300 hover:from-amber-600 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-50"
              >
                {isLoading ? 'Logging in...' : `Log in as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
              </button>
            </div>

            {/* Or Divider */}
            <div className="relative mb-4 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 flex-shrink text-gray-400">Or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-3 font-medium text-gray-700 transition duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50 shadow-md hover:shadow-lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="mr-3">
                <path 
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                  fill="#4285F4" 
                />
                <path 
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                  fill="#34A853" 
                />
                <path 
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                  fill="#FBBC05" 
                />
                <path 
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                  fill="#EA4335" 
                />
              </svg>
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;