'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function BrandLanding() {
  // Intersection observer hooks for different sections
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const brandsRef = useRef(null);

  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const [isTestimonialsVisible, setIsTestimonialsVisible] = useState(false);
  const [isBrandsVisible, setIsBrandsVisible] = useState(false);

  // Testimonials data
  const testimonials = [
    {
      quote: "ConnectSphere has transformed our influencer marketing strategy. We've seen a significant increase in brand awareness and engagement!",
      name: "Emily Larson",
      title: "Marketing Manager",
      company: "FashionHub",
      avatar: "/41.jpg"
    },
    {
      quote: "The platform's AI-powered matching ensures we collaborate with influencers who truly resonate with our brand. It's a game-changer.",
      name: "Michael Smith",
      title: "Head of Marketing",
      company: "HealthPlus",
      avatar: "/42.jpg"
    },
  ];

  // Sample brand profiles
  const brands = [
    {
      name: "FashionHub",
      description: "Leading the fashion industry with innovative designs and trends.",
      image: "/41.jpg",
      industry: "Fashion",
      followers: "1.2M"
    },
    {
      name: "TechGiant",
      description: "Empowering the world through cutting-edge technology and solutions.",
      image: "/42.jpg",
      industry: "Technology",
      followers: "2.5M"
    },
    {
      name: "HealthPlus",
      description: "Promoting wellness and healthy living with premium products.",
      image: "/43.jpg",
      industry: "Wellness",
      followers: "800K"
    },
    {
      name: "EcoLiving",
      description: "Sustainable and eco-friendly products for a better planet.",
      image: "/44.jpg",
      industry: "Lifestyle",
      followers: "600K"
    }
  ];

  // Set up intersection observers
  useEffect(() => {
    const options = { threshold: 0.2 };
    
    const observerCallbacks = {
      hero: (entries) => {
        if (entries[0].isIntersecting) setIsHeroVisible(true);
      },
      stats: (entries) => {
        if (entries[0].isIntersecting) setIsStatsVisible(true);
      },
      features: (entries) => {
        if (entries[0].isIntersecting) setIsFeaturesVisible(true);
      },
      testimonials: (entries) => {
        if (entries[0].isIntersecting) setIsTestimonialsVisible(true);
      },
      brands: (entries) => {
        if (entries[0].isIntersecting) setIsBrandsVisible(true);
      }
    };
    
    const heroObserver = new IntersectionObserver(observerCallbacks.hero, options);
    const statsObserver = new IntersectionObserver(observerCallbacks.stats, options);
    const featuresObserver = new IntersectionObserver(observerCallbacks.features, options);
    const testimonialsObserver = new IntersectionObserver(observerCallbacks.testimonials, options);
    const brandsObserver = new IntersectionObserver(observerCallbacks.brands, options);
    
    if (heroRef.current) heroObserver.observe(heroRef.current);
    if (statsRef.current) statsObserver.observe(statsRef.current);
    if (featuresRef.current) featuresObserver.observe(featuresRef.current);
    if (testimonialsRef.current) testimonialsObserver.observe(testimonialsRef.current);
    if (brandsRef.current) brandsObserver.observe(brandsRef.current);
    
    return () => {
      if (heroRef.current) heroObserver.unobserve(heroRef.current);
      if (statsRef.current) statsObserver.unobserve(statsRef.current);
      if (featuresRef.current) featuresObserver.unobserve(featuresRef.current);
      if (testimonialsRef.current) testimonialsObserver.unobserve(testimonialsRef.current);
      if (brandsRef.current) brandsObserver.unobserve(brandsRef.current);
    };
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-lg shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-700">
                INFL<span className="text-yellow-500">UENZ</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="px-6 py-2 rounded-lg text-purple-700 hover:text-purple-900 font-medium">
                Log In
              </Link>
              <Link href="/brand-signup" className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col lg:flex-row items-center gap-12"
            initial="hidden"
            animate={isHeroVisible ? "visible" : "hidden"}
            variants={staggerChildren}
          >
            {/* Left side content */}
            <motion.div className="w-full lg:w-1/2" variants={fadeIn}>
              <div className="mb-6">
                <span className="px-4 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                  Brand Platform
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-700 leading-tight">
                Amplify Your <span className="text-yellow-500">Brand</span>, Connect with <span className="text-yellow-500">Influencers</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Collaborate with top influencers, create impactful campaigns, and maximize your brand's reach. Join the community of brands achieving real results.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/brand/signup" className="px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                  Get Started Free
                </Link>
                <Link href="#how-it-works" className="px-8 py-3 rounded-lg border border-purple-300 text-purple-700 font-medium hover:bg-purple-50 transition-all duration-200">
                  Learn More
                </Link>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-purple-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-black"></div>
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <span className="text-sm font-medium text-gray-800">Trusted by 500+ brands</span>
                </div>
              </div>
            </motion.div>
            
            {/* Right side image/graphics */}
            <motion.div 
              className="w-full lg:w-1/2 relative"
              variants={fadeIn}
            >
              <div className="relative h-96 lg:h-[32rem] w-full overflow-hidden rounded-2xl p-1 bg-gradient-to-r from-yellow-300 via-purple-500 to-blue-600">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-100/30 via-purple-200/30 to-blue-100/30 backdrop-blur-sm rounded-2xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4">
                  <div className="w-full h-full relative">
                    <div className="absolute top-0 left-0 w-full h-full rounded-xl bg-black/60 backdrop-blur-md shadow-xl transform rotate-3"></div>
                    <div className="absolute top-0 right-0 w-full h-full rounded-xl bg-black/80 backdrop-blur-md shadow-xl transform -rotate-3"></div>
                    
                    {/* Central phone mockup */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/5 h-4/5 rounded-3xl border-8 border-gray-800 bg-white shadow-2xl overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50">
                        <div className="w-full h-1/3 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="h-2 bg-gray-200 rounded mb-2"></div>
                          <div className="h-2 bg-gray-200 rounded mb-2 w-3/4"></div>
                          <div className="h-8 bg-purple-100 rounded mt-4 flex items-center justify-between px-3">
                            <div className="w-1/3 h-4 bg-purple-300 rounded"></div>
                            <div className="w-1/4 h-4 bg-yellow-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating graphics */}
                    <div className="absolute top-1/4 left-0 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-70"></div>
                    <div className="absolute bottom-1/4 right-0 transform translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-70"></div>
                    <div className="absolute top-2/3 left-1/4 w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 opacity-80"></div>
                    <div className="absolute top-1/6 right-1/4 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 opacity-80"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            animate={isStatsVisible ? "visible" : "hidden"}
            variants={staggerChildren}
          >
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md text-center"
              variants={fadeIn}
            >
              <span className="block text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">500+</span>
              <span className="text-lg font-medium text-gray-700">Active Brands</span>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md text-center"
              variants={fadeIn}
            >
              <span className="block text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">600+</span>
              <span className="text-lg font-medium text-gray-700">Influencer Collaborations</span>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md text-center"
              variants={fadeIn}
            >
              <span className="block text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent mb-2">10M+</span>
              <span className="text-lg font-medium text-gray-700">Audience Reach</span>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md text-center"
              variants={fadeIn}
            >
              <span className="block text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">$5M</span>
              <span className="text-lg font-medium text-gray-700">Brand Revenue</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate={isFeaturesVisible ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
              Platform Benefits
            </span>
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-700 mb-4">
              Why Brands Choose Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our advanced platform provides everything you need to connect with influencers and create successful campaigns.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            animate={isFeaturesVisible ? "visible" : "hidden"}
            variants={staggerChildren}
          >
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
              variants={fadeIn}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">AI-powered matching</h3>
              <p className="text-gray-600">Our intelligent algorithms match you with influencers that align perfectly with your brand's values and audience demographics.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
              variants={fadeIn}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Seamless collaboration</h3>
              <p className="text-gray-600">Easily connect with influencers, negotiate terms, and manage collaborations all in one place.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
              variants={fadeIn}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Performance analytics</h3>
              <p className="text-gray-600">Track your campaign performance with detailed analytics and insights to optimize your strategies.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate={isTestimonialsVisible ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-700 mb-4">
              What Brands Are Saying
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from our community of brands who have successfully elevated their marketing strategies and expanded their reach.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            animate={isTestimonialsVisible ? "visible" : "hidden"}
            variants={staggerChildren}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                variants={fadeIn}
              >
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image src={testimonial.avatar} width={64} height={64} alt={testimonial.name} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.quote}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Brand Profiles Section */}
      <section ref={brandsRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate={isBrandsVisible ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-700 mb-4">
              Meet Our Top Brands
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover some of the most influential brands who are making waves and driving engagement on INFLUENZ.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate={isBrandsVisible ? "visible" : "hidden"}
            variants={staggerChildren}
          >
            {brands.map((brand, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                variants={fadeIn}
              >
                <div className="w-full h-64 rounded-2xl overflow-hidden mb-4">
                  <Image src={brand.image} width={320} height={256} alt={brand.name} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{brand.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{brand.industry}</p>
                <p className="text-sm text-gray-600">{brand.followers} followers</p>
                <p className="text-gray-600 mt-4">{brand.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-800 text-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-700">
                INFL<span className="text-yellow-500">UENZ</span>
              </div>
              <p className="text-sm">© 2025 INFLUENZ. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-sm hover:text-gray-400">Privacy Policy</Link>
              <Link href="/terms" className="text-sm hover:text-gray-400">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}