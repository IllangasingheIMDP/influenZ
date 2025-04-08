'use client';

import React from 'react';

const BrandPricingPage = () => {
  return (
    <div className="h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 flex flex-col justify-center overflow-hidden"
    style={{
      backgroundImage: "url('/pricing_page_image-01.jpeg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "bottom", // Changed to bottom to keep the walking man visible
      backgroundRepeat: "no-repeat",
      height: "100vh" // Fixed height to viewport height
    }}>
      {/* Decorative elements - kept but reduced size to fit single screen */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -left-10 top-1/4 w-40 h-40 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute right-0 top-1/2 w-40 h-40 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-3">Choose your Brand Plan</h1>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Sign up in less than 30 seconds. Try out 7 days free trial.
            Upgrade at anytime, no question, no hassle.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-indigo-900">$0</h2>
                  <span className="text-gray-500">/year</span>
                </div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-3">Free</h3>
                <p className="text-gray-600 mb-4">Perfect for startups and small businesses exploring influencer marketing.</p>
                
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Post up to 5 campaigns per year</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Standard customer support, with longer response times</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Schedule and automate 3 campaign launches</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Create 3 custom campaigns with basic targeting</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-6 pt-0 mt-auto">
                <button className="w-full py-2 px-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg transition-colors duration-300">
                  Choose plan
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative flex flex-col">
              <div className="absolute top-0 right-0">
                <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              </div>
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-indigo-900">$49</h2>
                  <span className="text-gray-500">/year</span>
                </div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-3">Premium</h3>
                <p className="text-gray-600 mb-4">Maximize your influencer marketing strategy with unlimited access.</p>
                
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Post unlimited campaigns throughout the year</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Access detailed analytics and ROI metrics</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Dedicated customer support with faster response times</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Create unlimited custom campaigns with advanced targeting</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Schedule and automate all campaign launches</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-6 pt-0 mt-auto">
                <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-300">
                  Choose plan
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 mt-6">
          Have questions? <span className="text-indigo-600 font-medium cursor-pointer hover:underline">Contact our support team</span>
        </p>
      </div>
    </div>
  );
};

export default BrandPricingPage;