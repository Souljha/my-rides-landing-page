
import React from 'react';

export const TagIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.53 0 1.04.21 1.41.59L19 9l-7 7-6-6-6 6V3h5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.121l-7.07-7.07m7.07 0L20 9l-7.07 7.071M3 8v8l8-8-8 8z"/>
  </svg>
);
