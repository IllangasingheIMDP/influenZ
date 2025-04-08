"use client"

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const CampaignSteps = () => {
  const componentRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the component is visible
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={componentRef}
      className="w-full max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-8"
    >
      <div className="w-full md:w-1/2 space-y-6">
        <h2 
          className={`text-3xl md:text-4xl font-bold text-gray-800 tracking-tight transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Do your campaign in 3 simple steps
        </h2>

        <div className="space-y-6">
          <div 
            className={`flex items-start gap-4 transition-all duration-700 delay-300 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Influencer</h3>
              <p className="text-sm text-gray-600">Discover and choose the right influencer for your brand campaigns.</p>
            </div>
          </div>
          
          <div className="w-px h-6 bg-gray-300 ml-5"></div>
          
          <div 
            className={`flex items-start gap-4 transition-all duration-700 delay-500 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Campaign</h3>
              <p className="text-sm text-gray-600">Easily launch and manage influencer marketing campaigns for maximum impact.</p>
            </div>
          </div>
          
          <div className="w-px h-6 bg-gray-300 ml-5"></div>
          
          <div 
            className={`flex items-start gap-4 transition-all duration-700 delay-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex-shrink-0 w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Insights</h3>
              <p className="text-sm text-gray-600">Monitor performance, engagement, and ROI with real-time analytics and reports.</p>
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`w-full md:w-2/5 h-72 rounded-lg overflow-hidden shadow-md transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Replace this with your actual image */}
        <div className="w-full h-full relative">
          <Image 
            src="/www.jpg" 
            alt="Campaign visualization" 
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
            onError={(e) => {
              e.currentTarget.style.opacity = "0.7";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignSteps;