import React from 'react';

/**
 * Stylish housing-themed background pattern for OoitGedacht
 * Features subtle house silhouettes, geometric shapes, and construction motifs
 */
export const HousingPatternBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* SVG Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* House pattern */}
          <pattern id="house-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Simple house silhouette */}
            <path 
              d="M20 60 L20 90 L50 90 L50 60 L35 45 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1"
            />
            {/* Door */}
            <rect x="30" y="70" width="10" height="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            {/* Window */}
            <rect x="22" y="62" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            
            {/* Second house - offset */}
            <path 
              d="M80 80 L80 110 L110 110 L110 80 L95 65 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1"
            />
            
            {/* Geometric accents */}
            <circle cx="100" cy="30" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <line x1="60" y1="20" x2="60" y2="40" stroke="currentColor" strokeWidth="0.5" />
            <line x1="50" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          
          {/* Grid pattern */}
          <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#house-pattern)" className="text-white" />
        <rect width="100%" height="100%" fill="url(#grid-pattern)" className="text-green-500" opacity="0.3" />
      </svg>
      
      {/* Floating house icons with subtle animation */}
      <div className="absolute top-[10%] left-[5%] w-16 h-16 opacity-[0.04]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-green-400">
          <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
        </svg>
      </div>
      
      <div className="absolute top-[30%] right-[8%] w-20 h-20 opacity-[0.03] rotate-12">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-white">
          <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
        </svg>
      </div>
      
      <div className="absolute bottom-[20%] left-[12%] w-12 h-12 opacity-[0.04] -rotate-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-green-400">
          <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
        </svg>
      </div>
      
      <div className="absolute bottom-[35%] right-[15%] w-14 h-14 opacity-[0.03]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-white">
          <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
        </svg>
      </div>
      
      {/* Blueprint-style dots */}
      <div className="absolute top-[15%] right-[25%] w-2 h-2 rounded-full bg-green-500/10" />
      <div className="absolute top-[45%] left-[20%] w-1.5 h-1.5 rounded-full bg-green-500/10" />
      <div className="absolute bottom-[25%] right-[30%] w-2 h-2 rounded-full bg-white/5" />
      <div className="absolute top-[60%] left-[35%] w-1 h-1 rounded-full bg-green-500/10" />
      <div className="absolute bottom-[40%] left-[45%] w-1.5 h-1.5 rounded-full bg-white/5" />
    </div>
  );
};





