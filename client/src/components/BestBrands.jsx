'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import api from '@/constants/api'; // Adjust path if needed

const LogoCarousel = () => {
  const scrollRef = useRef(null);
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await api.get('/brand/company-pics');
        
        const pics = res.data.map(b => b.company_pic);
        setLogos([...pics, ...pics]); // duplicate for seamless scroll
      } catch (error) {
        console.error('Error fetching logos:', error);
      }
    };

    fetchLogos();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let startTime;
    const duration = 40000;
    const scrollWidth = scrollContainer.scrollWidth / 2;

    const scroll = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;

      if (scrollContainer.scrollLeft >= scrollWidth) {
        scrollContainer.scrollLeft = 0;
        startTime = timestamp;
      } else {
        scrollContainer.scrollLeft = progress * scrollWidth;
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      startTime = null;
      animationId = requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [logos]);

  return (
    <section className="w-full py-16 bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent inline-block">
            Trusted by Leading Brands
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Logo Carousel */}
        <div 
          className="relative before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[100px] before:bg-gradient-to-r before:from-gray-50 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[100px] after:bg-gradient-to-l after:from-gray-50 after:to-transparent"
        >
          <div 
            ref={scrollRef}
            className="flex items-center gap-16 overflow-x-hidden py-8 px-4 scroll-smooth"
          >
            {logos.map((logo, index) => (
              <div 
                key={`${logo}-${index}`} 
                className="flex-shrink-0 h-20 w-40 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex items-center justify-center"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={logo}
                    alt={`Partner logo ${index + 1}`}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoCarousel;
