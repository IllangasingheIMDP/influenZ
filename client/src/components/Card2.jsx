"use client"
import React, { useEffect, useRef } from 'react';

const MovingBallsComponent = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const balls = [];
    const ballCount = 8;
    
    // Set canvas to full width of parent
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = 400; // Fixed height or adjust as needed
    };
    
    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create balls
    for (let i = 0; i < ballCount; i++) {
      balls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 15 + Math.random() * 45, // Random size between 15 and 60
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        opacity: 0.3 + Math.random() * 0.4 // Random opacity between 0.3 and 0.7
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      balls.forEach(ball => {
        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Bounce off edges
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
          ball.dx = -ball.dx;
        }
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
          ball.dy = -ball.dy;
        }
        
        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 224, 71, ${ball.opacity})`;
        ctx.fill();
        ctx.closePath();
      });
      
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <div className="w-full my-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-10 relative overflow-hidden shadow-lg">
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full"
          />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6 text-black">
              Join our growing community
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl">
              Connect with like-minded creators and innovators. Share ideas, build relationships, 
              and take your influence to the next level with our premium tools and resources.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-medium py-3 px-8 rounded-full transition duration-300">
                Get Started
              </button>
              <button className="bg-transparent border border-yellow-400 text-black hover:bg-yellow-400 hover:bg-opacity-10 font-medium py-3 px-8 rounded-full transition duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovingBallsComponent;