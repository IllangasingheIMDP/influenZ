"use client"

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const TestimonialsSection = ({ testimonials = [
  {
    quote: "Working with your design team was an absolute pleasure. The attention to detail and creativity exceeded my expectations. Thank you for making my home beautiful!",
    name: "Sophie Carter",
    avatar: "/31.jpg"
  },
  {
    quote: "Working with your design team was an absolute pleasure. The attention to detail and creativity exceeded my expectations. Thank you for making my home beautiful!",
    name: "Shasha Carter",
    avatar: "/32.jpg"
  },
  {
    quote: "The level of professionalism and expertise shown by the team was outstanding. Every detail was carefully considered, resulting in a space that truly reflects my vision.",
    name: "Robert Johnson",
    avatar: "/33.jpg"
  }
] }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-5xl px-6 py-12">
        <div 
          className={`transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
            What Our Customers Say About Us
          </h2>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto">
            {testimonials.slice(0, 2).map((testimonial, index) => (
              <div 
                key={`testimonial-${index}`}
                className={`bg-gray-800 text-white p-8 rounded-lg transition-all duration-700 ease-out transform w-full md:w-[45%] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="mb-6">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.51.88-3.995 2.907-3.995 5.093h2v10.756h-7.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.511.88-3.996 2.907-3.996 5.093h2v10.756h-8z" />
                  </svg>
                </div>
                <p className="text-white/90 text-lg leading-relaxed mb-8">
                  {testimonial.quote}
                </p>
                
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4 bg-gray-600">
                    <Image 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/48/48";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-xl text-white">{testimonial.name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;