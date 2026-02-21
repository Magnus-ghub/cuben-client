import React from 'react';

export const UnivoLogo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="univoMain" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>

    {/* Main U Shape */}
    <path
      d="M25 35 Q25 80 50 80 Q75 80 75 35"
      stroke="url(#univoMain)"
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
    />

    {/* Student Dot */}
    <circle cx="50" cy="22" r="6" fill="url(#univoMain)" />
  </svg>
);