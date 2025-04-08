"use client"

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

const LogoCarousel = ({ logos = [
  '/21.jpg',
  '/22.png',
  '/23.png',
  '/24.png',
  '/25.jpg',
  '/26.png',
] }) => {
  const scrollRef = useRef(null);
  const duplicatedLogos = [...logos, ...logos]; // Duplicate logos for seamless looping

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let startTime;
    const duration = 40000; // Time to complete one full scroll in ms
    const scrollWidth = scrollContainer.scrollWidth / 2;

    const scroll = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      
      if (scrollContainer) {
        // Reset position when first set finishes to create infinite loop illusion
        if (scrollContainer.scrollLeft >= scrollWidth) {
          scrollContainer.scrollLeft = 0;
          startTime = timestamp;
        } else {
          scrollContainer.scrollLeft = progress * scrollWidth;
        }
      }
      
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    // Pause animation when user hovers
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId);
    };

    const handleMouseLeave = () => {
      startTime = null;
      animationId = requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [duplicatedLogos.length]);

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
            {duplicatedLogos.map((logo, index) => (
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