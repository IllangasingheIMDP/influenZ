'use client';

import React from 'react';

const PricingPage = () => {
  return (
    <div 
      className="min-h-screen flex flex-col justify-between overflow-hidden" 
      style={{
        backgroundImage: "url('/pricing_page_image-01.jpeg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "bottom", // Changed to bottom to keep the walking man visible
        backgroundRepeat: "no-repeat",
        height: "100vh" // Fixed height to viewport height
      }}
    >
      <div className="container mx-auto px-4 relative z-10 py-8">
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-2">Choose your Plan</h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Sign up in less than 30 seconds. Try out 7 days free trial.
            Upgrade at anytime, no question, no hassle.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Free Plan */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-indigo-900">$0</h2>
                  <span className="text-gray-500">/year</span>
                </div>
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">Free</h3>
                <p className="text-sm text-gray-600 mb-3">Perfect for new influencers starting their journey.</p>
                
                <ul className="space-y-1 mb-3">
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Engage in up to 10 campaigns per year</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Standard priority in brand searches</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Participate in one campaign at a time</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Basic analytics</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 pt-0 mt-auto">
                <button className="w-full py-2 px-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg transition-colors duration-300">
                  Choose plan
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden relative flex flex-col">
              <div className="absolute top-0 right-0">
                <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              </div>
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-indigo-900">$29</h2>
                  <span className="text-gray-500">/year</span>
                </div>
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">Premium</h3>
                <p className="text-sm text-gray-600 mb-3">Unlock your full potential with advanced features.</p>
                
                <ul className="space-y-1 mb-3">
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Unlimited campaigns per year</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Higher priority in brand searches</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Participate in up to 5 campaigns simultaneously</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Advanced analytics and insights</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-1">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-700">Priority customer support</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 pt-0 mt-auto">
                <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-300">
                  Choose plan
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Have questions? <span className="text-indigo-600 font-medium cursor-pointer hover:underline">Contact our support team</span>
        </p>
      </div>
    </div>
  );
};

export default PricingPage;