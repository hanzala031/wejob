
import React from 'react';

// Tech Icons Components
const ReactIcon = () => (
  <svg viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#61DAFB]">
    <circle cx="0" cy="0" r="2" fill="currentColor"></circle>
    <g stroke="currentColor" strokeWidth="1" fill="none">
      <ellipse rx="10" ry="4.5"></ellipse>
      <ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
      <ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
    </g>
  </svg>
);

const NextJsIcon = () => (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <path fillRule="evenodd" clipRule="evenodd" d="M90 0C40.2944 0 0 40.2944 0 90C0 139.706 40.2944 180 90 180C139.706 180 180 139.706 180 90C180 40.2944 139.706 0 90 0ZM32.4 136.8V43.2H46.8L106.56 136.21C101.321 140.45 95.8362 143.203 90 144C68.3269 144 49.0353 134.194 36.36 119.16C33.8296 124.661 32.4 130.632 32.4 136.8ZM147.6 136.8V43.2H133.2L73.44 136.21C78.6793 140.45 84.1638 143.203 90 144C111.673 144 130.965 134.194 143.64 119.16C146.17 124.661 147.6 130.632 147.6 136.8Z" fill="white"/>
  </svg>
);

const NodeJsIcon = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8">
    <path d="M16,0 L30,8 L30,24 L16,32 L2,24 L2,8 L16,0 Z" fill="#339933" />
    <path d="M16,2 L28,9 L28,23 L16,30 L4,23 L4,9 L16,2 Z" fill="#339933" />
    <path d="M12 10h8v12h-2v-4h-2v4h-2v-4h-2z" fill="white" transform="scale(0.8) translate(4, 4)"/> 
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">JS</text>
  </svg>
);

const FigmaIcon = () => (
  <svg viewBox="0 0 38 57" className="w-8 h-8" fill="none">
    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE"/>
    <path d="M0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-9.5-9.5z" fill="#0ACF83"/>
    <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#F24E1E"/>
    <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E"/>
    <path d="M0 28.5a9.5 9.5 0 0 0 9.5 9.5H19v-19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF"/>
  </svg>
);

const TypeScriptIcon = () => (
  <svg viewBox="0 0 128 128" className="w-8 h-8">
    <rect width="128" height="128" rx="20" fill="#3178C6"/>
    <path d="M77.75 99.75c-5.5 0-9.17-2.67-10.92-5.17l6.67-4.08c1.33 1.92 3.17 3.42 6.25 3.42 2.67 0 4.17-1.17 4.17-3 0-1.75-1.5-2.58-4.92-3.83-5.75-2.08-9.5-4.75-9.5-10.25 0-5.33 4.25-9.67 11.25-9.67 4.92 0 8.33 2 10.33 4.5l-6.25 4.33c-1.25-1.75-3-3-6-3-2.33 0-3.5 1.17-3.5 2.67 0 1.92 2.25 2.67 6 4 6.25 2.17 9.33 5.42 9.33 10.33 0 6.58-5.33 9.75-12.92 9.75zm-33.5-29.5v28.5h-9v-28.5H19.5v-8h33.5v8h-15.75z" fill="#FFF"/>
  </svg>
);

const TailwindIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#38BDF8]" fill="currentColor">
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
  </svg>
);

const CuteRobot = () => {
  return (
    <svg viewBox="0 0 200 240" className="w-72 h-72 drop-shadow-2xl filter">
      <defs>
        <linearGradient id="bodyGradient" x1="100" y1="80" x2="100" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Antenna */}
      <line x1="100" y1="40" x2="100" y2="60" stroke="#94a3b8" strokeWidth="4" />
      <circle cx="100" cy="35" r="6" fill="#3b82f6" className="animate-pulse">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Head */}
      <rect x="50" y="60" width="100" height="80" rx="25" fill="url(#bodyGradient)" stroke="#e2e8f0" strokeWidth="2" />
      
      {/* Face Screen */}
      <rect x="60" y="75" width="80" height="50" rx="12" fill="#0f172a" />
      
      {/* Face Features (Eyes & Mouth) - Static blinking */}
      <g fill="#3b82f6" filter="url(#glow)">
          <ellipse cx="85" cy="95" rx="6" ry="8">
              <animate attributeName="ry" values="8;2;8" dur="4s" repeatCount="indefinite" begin="0s" />
          </ellipse>
          <ellipse cx="115" cy="95" rx="6" ry="8">
              <animate attributeName="ry" values="8;2;8" dur="4s" repeatCount="indefinite" begin="0.1s" />
          </ellipse>
      </g>

      {/* Mouth */}
      <path 
          d="M90 110 Q100 113 110 110" 
          stroke="#3b82f6" 
          strokeWidth="2" 
          fill="none" 
          opacity="0.8" 
          strokeLinecap="round"
      />

      {/* Ears */}
      <rect x="40" y="80" width="10" height="30" rx="4" fill="#94a3b8" />
      <circle cx="45" cy="95" r="3" fill="#3b82f6" opacity="0.5" />
      
      <rect x="150" y="80" width="10" height="30" rx="4" fill="#94a3b8" />
      <circle cx="155" cy="95" r="3" fill="#3b82f6" opacity="0.5" />

      {/* Body */}
      <path d="M65 140 H135 L125 200 H75 L65 140Z" fill="url(#bodyGradient)" stroke="#e2e8f0" strokeWidth="2" />
      
      {/* Tech Details on Body */}
      <circle cx="100" cy="160" r="12" fill="#3b82f6" opacity="0.1" />
      <circle cx="100" cy="160" r="6" fill="#3b82f6" className="animate-pulse" />
      <rect x="85" y="180" width="30" height="10" rx="2" fill="#94a3b8" />

      {/* Left Arm (Static) */}
      <path d="M60 150 Q40 170 50 190" stroke="#cbd5e1" strokeWidth="12" fill="none" strokeLinecap="round" />
      
      {/* Right Arm (Static) */}
      <g>
         <path d="M140 150 Q160 170 150 190" stroke="#cbd5e1" strokeWidth="12" fill="none" strokeLinecap="round" />
         <circle cx="150" cy="190" r="7" fill="#cbd5e1" /> 
      </g>
      
      {/* Shadow */}
      <ellipse cx="100" cy="215" rx="40" ry="6" fill="#000" opacity="0.15">
         <animate attributeName="rx" values="40;35;40" dur="3s" repeatCount="indefinite" />
         <animate attributeName="opacity" values="0.15;0.25;0.15" dur="3s" repeatCount="indefinite" />
      </ellipse>
    </svg>
  );
};

const HeroIllustration: React.FC = () => {
  const icons = [
    { component: <ReactIcon />, angle: 0 },
    { component: <NextJsIcon />, angle: 60 },
    { component: <NodeJsIcon />, angle: 120 },
    { component: <FigmaIcon />, angle: 180 },
    { component: <TypeScriptIcon />, angle: 240 },
    { component: <TailwindIcon />, angle: 300 },
  ];

  return (
    <div className="relative w-full max-w-lg h-[400px] md:h-[350px] flex items-center justify-center overflow-visible mx-auto transform scale-90 md:scale-100">
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-orbit {
          animation: spin-slow 30s linear infinite;
        }
        .animate-counter-orbit {
          animation: spin-reverse-slow 30s linear infinite;
        }
        .icon-container {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 320px; /* Diameter of the circle path */
            height: 320px;
            margin-left: -160px; /* Radius */
            margin-top: -160px; /* Radius */
            border-radius: 50%;
        }
        @keyframes float-y {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-float {
            animation: float-y 4s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative Background Shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-2xl"></div>

      {/* Rotating Orbit Container */}
      <div className="icon-container animate-orbit border border-white/5 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.05)] pointer-events-none">
        {icons.map((icon, index) => {
            const radius = 160; 
            const angleRad = (icon.angle * Math.PI) / 180;
            const x = radius * Math.cos(angleRad);
            const y = radius * Math.sin(angleRad);
            
            return (
                <div
                    key={index}
                    className="absolute w-14 h-14 bg-[#1e293b] border border-white/10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300"
                    style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                >
                    <div className="animate-counter-orbit flex items-center justify-center w-full h-full">
                        {icon.component}
                    </div>
                </div>
            );
        })}
      </div>

      {/* Central Robot */}
      <div className="relative z-10 animate-float">
        <CuteRobot />
      </div>
    </div>
  );
};

export default HeroIllustration;
