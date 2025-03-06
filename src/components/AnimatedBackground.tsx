
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  className?: string;
  mood?: 'happy' | 'sad' | 'energetic' | 'relaxed' | 'focused' | 'romantic';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  className,
  mood = 'relaxed'
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Color mapping based on mood
  const moodGradients = {
    happy: 'from-yellow-100 via-yellow-200 to-yellow-100',
    sad: 'from-blue-100 via-blue-200 to-blue-100',
    energetic: 'from-red-100 via-red-200 to-red-100',
    relaxed: 'from-green-100 via-green-200 to-green-100',
    focused: 'from-indigo-100 via-indigo-200 to-indigo-100',
    romantic: 'from-pink-100 via-pink-200 to-pink-100'
  };
  
  const moodGradientDark = {
    happy: 'from-yellow-900/30 via-yellow-800/20 to-yellow-900/30',
    sad: 'from-blue-900/30 via-blue-800/20 to-blue-900/30',
    energetic: 'from-red-900/30 via-red-800/20 to-red-900/30',
    relaxed: 'from-green-900/30 via-green-800/20 to-green-900/30',
    focused: 'from-indigo-900/30 via-indigo-800/20 to-indigo-900/30',
    romantic: 'from-pink-900/30 via-pink-800/20 to-pink-900/30'
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const gradientClass = 'bg-gradient-to-r';
  const isDarkMode = false; // In a real app, this would come from a theme context

  return (
    <div className={cn(
      'fixed inset-0 -z-10 overflow-hidden',
      className
    )}>
      {/* Base gradient background */}
      <div 
        className={cn(
          'absolute inset-0 transition-colors duration-1000',
          gradientClass,
          isDarkMode ? moodGradientDark[mood] : moodGradients[mood]
        )}
      />
      
      {/* Floating circles with animation */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-float animation-delay-1000" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-float animation-delay-500" />
      
      {/* Mouse-following gradient */}
      <div 
        className="hidden md:block absolute w-[40vw] h-[40vw] rounded-full blur-3xl opacity-30 pointer-events-none transition-transform duration-1000"
        style={{
          background: `radial-gradient(circle, ${getColorFromMood(mood, isDarkMode)} 0%, transparent 70%)`,
          left: `${mousePosition.x - 400}px`,
          top: `${mousePosition.y - 400}px`,
          transform: 'translate(0, 0) scale(1)',
          transition: 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)'
        }}
      />
    </div>
  );
};

// Helper function to get color hex from mood
function getColorFromMood(mood: string, isDark: boolean): string {
  if (isDark) {
    return {
      happy: '#FFD166',
      sad: '#118AB2',
      energetic: '#EF476F',
      relaxed: '#06D6A0',
      focused: '#073B4C',
      romantic: '#FF9E9E'
    }[mood] || '#06D6A0';
  } else {
    return {
      happy: '#FFD166',
      sad: '#118AB2',
      energetic: '#EF476F',
      relaxed: '#06D6A0',
      focused: '#073B4C',
      romantic: '#FF9E9E'
    }[mood] || '#06D6A0';
  }
}

export default AnimatedBackground;
