
import React from 'react';
import { ClockIcon } from './icons/ClockIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { TagIcon } from './icons/TagIcon';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
    <div className="inline-block bg-primary-dark/10 text-primary-dark p-4 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-secondary mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Features: React.FC = () => {
  const features = [
    {
      icon: <TagIcon className="w-8 h-8" />,
      title: 'Your City, Your Ride',
      description: 'Get where you need to go with My Rides. Fast, safe, and reliable rides at your fingertips.'
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: 'Fast & Reliable',
      description: 'Get a ride in minutes. Our network of drivers is always ready to take you to your destination, 24/7.'
    },
    {
      icon: <ShieldIcon className="w-8 h-8" />,
      title: 'Safety First',
      description: 'Your safety is our priority. All our drivers are vetted, and you can share your trip details with loved ones.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-secondary">Why Ride With Us?</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            We are dedicated to providing you with the best e-hailing experience possible.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
