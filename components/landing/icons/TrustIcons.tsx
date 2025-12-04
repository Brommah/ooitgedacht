import React from 'react';

/**
 * Shield with checkmark - Security & Transparency
 */
export const ShieldIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <path 
      d="M22 4L6 10v12c0 9.55 6.84 18.48 16 20.5 9.16-2.02 16-10.95 16-20.5V10L22 4z" 
      stroke="url(#shieldGrad)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
    <path 
      d="M14 22l5 5 11-11" 
      stroke="url(#shieldGrad)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Certificate badge - Expert validated
 */
export const CertifiedIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="certGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <circle cx="22" cy="18" r="12" stroke="url(#certGrad)" strokeWidth="2.5" fill="none" />
    <path d="M17 18l3.5 3.5L25 14" stroke="url(#certGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 28l-2 12 8-4 8 4-2-12" stroke="url(#certGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/**
 * Live chart - Real-time data
 */
export const LiveDataIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dataGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <rect x="6" y="28" width="6" height="10" rx="1" fill="url(#dataGrad)" opacity="0.6" />
    <rect x="15" y="20" width="6" height="18" rx="1" fill="url(#dataGrad)" opacity="0.8" />
    <rect x="24" y="12" width="6" height="26" rx="1" fill="url(#dataGrad)" />
    <rect x="33" y="6" width="6" height="32" rx="1" fill="url(#dataGrad)" opacity="0.9" />
    <circle cx="36" cy="6" r="3" fill="#60a5fa">
      <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);

/**
 * Document with stamp - Permit ready
 */
export const PermitIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="permitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <path 
      d="M10 6h18l8 8v24a2 2 0 01-2 2H10a2 2 0 01-2-2V8a2 2 0 012-2z" 
      stroke="url(#permitGrad)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M28 6v8h8" stroke="url(#permitGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="14" y1="20" x2="30" y2="20" stroke="url(#permitGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <line x1="14" y1="26" x2="26" y2="26" stroke="url(#permitGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <circle cx="30" cy="32" r="6" stroke="url(#permitGrad)" strokeWidth="2" fill="none" />
    <path d="M27.5 32l2 2 3.5-3.5" stroke="url(#permitGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);




