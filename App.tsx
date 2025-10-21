
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import ZapierChatbot from './components/ZapierChatbot';
import { vapiService } from './services/vapiService';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main>
        <Hero />
        <Features />
        <ContactForm />
      </main>
      <Footer />
      <ZapierChatbot />
    </div>
  );
};

export default App;
