'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isHovered, setIsHovered] = useState({ influencer: false, brand: false });

  // Navigate after animation completes
  useEffect(() => {
    if (selectedOption) {
      const timer = setTimeout(() => {
        router.push(selectedOption === 'influencer' ? '/influencer_landing' : '/brand_landing');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [selectedOption, router]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const floatingShapes = [
    { top: '15%', left: '10%', delay: 0 },
    { top: '65%', left: '5%', delay: 0.5 },
    { top: '25%', left: '90%', delay: 1 },
    { top: '75%', left: '85%', delay: 1.5 },
    { top: '40%', left: '50%', delay: 2 },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-black opacity-80 z-0"></div>
      
      {/* Animated Background Shapes */}
      {floatingShapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute w-48 h-48 rounded-full bg-gradient-to-r ${
            index % 2 === 0 ? 'from-yellow-400 to-purple-600' : 'from-blue-900 to-purple-700'
          } opacity-20 blur-lg`}
          style={{ top: shape.top, left: shape.left }}
          animate={{
            x: [0, 30, 0, -30, 0],
            y: [0, 20, 0, -20, 0],
          }}
          transition={{
            duration: 15,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
            repeat: Infinity,
            delay: shape.delay,
          }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-30 z-10"></div>

      {/* Main Content */}
      <motion.div 
        className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={selectedOption ? "exit" : undefined}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-600">
            INFLUEN<span className="text-white">Z</span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 max-w-xl mx-auto">
            Where influential voices and innovative brands create powerful collaborations
          </p>
        </motion.div>

        {/* Option Cards */}
        <motion.div 
          className="flex flex-col md:flex-row gap-8 w-full max-w-4xl"
          variants={itemVariants}
        >
          {/* Influencer Card */}
          <motion.div
            className={`flex-1 rounded-2xl p-1 cursor-pointer transform transition-all duration-300 ${
              selectedOption === 'influencer' ? 'scale-105' : 
              isHovered.influencer ? 'scale-105' : 'scale-100'
            }`}
            style={{
              background: 'linear-gradient(45deg, #FFD700, #9333EA, #3B82F6)',
              boxShadow: isHovered.influencer || selectedOption === 'influencer' ? 
                '0 0 30px rgba(147, 51, 234, 0.6)' : '0 0 15px rgba(147, 51, 234, 0.4)'
            }}
            onClick={() => setSelectedOption('influencer')}
            onMouseEnter={() => setIsHovered(prev => ({ ...prev, influencer: true }))}
            onMouseLeave={() => setIsHovered(prev => ({ ...prev, influencer: false }))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-black bg-opacity-70 rounded-xl p-8 h-full">
              <div className="flex flex-col items-center text-center h-full">
                <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-purple-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">I'm an Influencer</h2>
                <p className="text-purple-200 mb-6">Showcase your unique voice and connect with premium brands that align with your vision</p>
                <motion.div 
                  className="mt-auto py-3 px-6 rounded-lg bg-gradient-to-r from-yellow-400 to-purple-600 text-black font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Brand Card */}
          <motion.div
            className={`flex-1 rounded-2xl p-1 cursor-pointer transform transition-all duration-300 ${
              selectedOption === 'brand' ? 'scale-105' : 
              isHovered.brand ? 'scale-105' : 'scale-100'
            }`}
            style={{
              background: 'linear-gradient(45deg, #3B82F6, #9333EA, #FFD700)',
              boxShadow: isHovered.brand || selectedOption === 'brand' ? 
              '0 0 30px rgba(59, 130, 246, 0.6)' : '0 0 15px rgba(59, 130, 246, 0.4)'
            }}
            onClick={() => setSelectedOption('brand')}
            onMouseEnter={() => setIsHovered(prev => ({ ...prev, brand: true }))}
            onMouseLeave={() => setIsHovered(prev => ({ ...prev, brand: false }))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-black bg-opacity-70 rounded-xl p-8 h-full">
              <div className="flex flex-col items-center text-center h-full">
                <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">I'm a Brand</h2>
                <p className="text-purple-200 mb-6">Find authentic influencers who resonate with your brand values and audience</p>
                <motion.div 
                  className="mt-auto py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-black font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="absolute bottom-8 text-center"
          variants={itemVariants}
        >
          <p className="text-purple-300 text-sm">
            Empowering authentic partnerships in the digital landscape
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}