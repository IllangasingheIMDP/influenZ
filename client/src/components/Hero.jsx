"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const InfluencerLandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background images with animations */}
      <div 
        className={`absolute left-20 top-0 h-full w-1/3 pointer-events-none transition-all duration-1000 ease-out ${
          isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        <Image
          src="/Left.png"
          layout="fill"
          objectFit="contain"
          objectPosition="left center"
          alt="Left background"
          priority
        />
      </div>
     
      <div 
        className={`absolute right-20 top-10 h-full w-1/3 pointer-events-none transition-all duration-1000 ease-out ${
          isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <Image
          src="/Right.png"
          layout="fill"
          objectFit="contain"
          objectPosition="right center"
          alt="Right background"
          priority
        />
      </div>
     
      {/* Centered content container with animation */}
      <div className="relative z-10 flex items-center justify-center h-screen">
        <div 
          className={`text-center max-w-2xl mx-auto px-4 transition-all duration-1000 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'
          }`}
        >
          <h1 className="text-6xl md:text-7xl font-bold leading-tight text-gray-900 mb-6">
            Influencers Are <br />Dreamers<span className="text-6xl md:text-7xl">.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 mx-auto max-w-lg">
            Influencers have specialized knowledge, authority or
            insight into a specific subject. Their pre-existing
            presence in a niche makes
          </p>
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition duration-300">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfluencerLandingPage;