
import React from 'react';

interface ShibaInuIconProps {
  width?: number;
  height?: number;
  className?: string;
  variant?: 'light' | 'dark';
}

const ShibaInuIcon: React.FC<ShibaInuIconProps> = ({ 
  width = 120, 
  height = 120,
  className = "",
  variant = 'light'
}) => {
  // Colors based on theme variant
  const colors = variant === 'light' 
    ? {
        main: "#F8B878", // Main fur - warm orange/tan
        ears: "#E89C50", // Ears - darker orange
        innerEar: "#FDE1D3", // Inner ears - light pink
        eyes: "#4A4A4A", // Eyes - dark gray
        muzzle: "#FDE1D3", // Muzzle - light pink
        blush: "#FFDEE2", // Blush - light pink with opacity
      }
    : {
        main: "#333333", // Main fur - dark gray
        ears: "#222222", // Ears - darker gray
        innerEar: "#555555", // Inner ears - medium gray
        eyes: "#000000", // Eyes - black
        muzzle: "#555555", // Muzzle - medium gray
        blush: "#444444", // Blush - subtle dark gray
      };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main head shape */}
      <circle cx="60" cy="60" r="45" fill={colors.main} />
      
      {/* Ears */}
      <path 
        d="M28 35C28 35 35 15 45 25C51.4 31.4 45 45 45 45L28 35Z" 
        fill={colors.ears} 
      />
      <path 
        d="M92 35C92 35 85 15 75 25C68.6 31.4 75 45 75 45L92 35Z" 
        fill={colors.ears} 
      />
      
      {/* Inner ear details */}
      <path 
        d="M35 32C35 32 38 22 43 26C46.4 28.8 43 36 43 36L35 32Z" 
        fill={colors.innerEar} 
      />
      <path 
        d="M85 32C85 32 82 22 77 26C73.6 28.8 77 36 77 36L85 32Z" 
        fill={colors.innerEar} 
      />
      
      {/* Eyes */}
      <ellipse cx="45" cy="58" rx="5" ry="7" fill={colors.eyes} />
      <ellipse cx="75" cy="58" rx="5" ry="7" fill={colors.eyes} />
      
      {/* Eye shine - always white for visibility */}
      <circle cx="43" cy="55" r="2" fill={variant === 'light' ? "white" : "#888888"} />
      <circle cx="73" cy="55" r="2" fill={variant === 'light' ? "white" : "#888888"} />
      
      {/* Muzzle */}
      <ellipse cx="60" cy="70" rx="12" ry="8" fill={colors.muzzle} />
      
      {/* Nose */}
      <ellipse cx="60" cy="65" rx="5" ry="3" fill={colors.eyes} />
      
      {/* Mouth - small smile */}
      <path 
        d="M55 73C55 73 60 77 65 73" 
        stroke={colors.eyes} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      
      {/* Blush marks */}
      <ellipse 
        cx="40" 
        cy="68" 
        rx="5" 
        ry="3" 
        fill={colors.blush} 
        fillOpacity={variant === 'light' ? "0.6" : "0.4"} 
      />
      <ellipse 
        cx="80" 
        cy="68" 
        rx="5" 
        ry="3" 
        fill={colors.blush} 
        fillOpacity={variant === 'light' ? "0.6" : "0.4"}  
      />
    </svg>
  );
};

export default ShibaInuIcon;
