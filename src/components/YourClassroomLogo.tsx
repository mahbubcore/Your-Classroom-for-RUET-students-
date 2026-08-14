import React from 'react';

interface YourClassroomLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const YourClassroomLogo: React.FC<YourClassroomLogoProps> = ({
  className = '',
  size = 40,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Precision Vector Emblem matching 'Your classroom for RUET students' */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md select-none"
      >
        <defs>
          <radialGradient id="gearGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#102e50" />
            <stop offset="100%" stopColor="#0a1f38" />
          </radialGradient>
          <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 10 Gear Teeth / Cog projections around circle */}
        <g id="gear-teeth" fill="#0b2440">
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
            <rect
              key={deg}
              x="92.5"
              y="14"
              width="15"
              height="22"
              rx="2"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}
        </g>

        {/* Main Navy Cog Base Circle */}
        <circle
          cx="100"
          cy="100"
          r="73"
          fill="url(#gearGradient)"
          stroke="#07192c"
          strokeWidth="3"
        />

        {/* Inner Golden Ring */}
        <circle
          cx="100"
          cy="100"
          r="63"
          fill="none"
          stroke="#c98a18"
          strokeWidth="3.2"
        />

        {/* Central Open Book Symbol */}
        <g id="open-book" transform="translate(100, 100) scale(0.95) translate(-100, -100)">
          {/* Left Page */}
          <path
            d="M 58 75 
               C 70 73, 85 75, 96 80 
               L 96 122 
               C 85 117, 70 115, 58 117 
               C 53 117, 50 113, 50 108 
               L 50 84 
               C 50 79, 53 75, 58 75 Z"
            fill="#FAF6EB"
          />
          {/* Right Page */}
          <path
            d="M 142 75 
               C 130 73, 115 75, 104 80 
               L 104 122 
               C 115 117, 130 115, 142 117 
               C 147 117, 150 113, 150 108 
               L 150 84 
               C 150 79, 147 75, 142 75 Z"
            fill="#FAF6EB"
          />
          {/* Center Spine Divider */}
          <line
            x1="100"
            y1="79"
            x2="100"
            y2="123"
            stroke="#0b2440"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Optional Full Lockup Text */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-base sm:text-lg tracking-tight text-white leading-snug">
            Your <span className="text-cyan-400">Classroom</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium tracking-wide">
            for RUET students
          </span>
        </div>
      )}
    </div>
  );
};
