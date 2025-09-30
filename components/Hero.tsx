
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section 
      className="relative bg-cover bg-center h-screen flex items-center justify-center text-white" 
      style={{ backgroundImage: "url('/images/Hero_bg.png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
          Ride Now, Pay Later
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md">
          My Rides allows working passengers and students to use taxi services when they lack immediate funds and pay on their payday.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="#contact"
            className="bg-primary text-secondary font-bold py-3 px-8 rounded-full text-lg hover:bg-primary-dark transition-transform transform hover:scale-105"
          >
            Book a Ride
          </a>
          <a
            href="https://myrides.co.za/home-1"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-white hover:text-secondary transition-all"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
