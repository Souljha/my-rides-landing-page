import React, { useEffect } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'zapier-interfaces-chatbot-embed': {
        'is-popup'?: string;
        'chatbot-id'?: string;
      };
    }
  }
}

const ZapierChatbot: React.FC = () => {
  useEffect(() => {
    // Load the Zapier interfaces script if it's not already loaded
    const existingScript = document.querySelector('script[src*="zapier-interfaces"]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.type = 'module';
      script.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <zapier-interfaces-chatbot-embed
      is-popup="true"
      chatbot-id="cmg55gkbf0021agukjmz069ju"
    />
  );
};

export default ZapierChatbot;