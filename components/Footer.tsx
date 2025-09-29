
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; {new Date().getFullYear()} My Rides. All rights reserved.</p>
        <p className="text-sm mt-2">A modern solution for your urban transportation needs.</p>
      </div>
    </footer>
  );
};

export default Footer;
