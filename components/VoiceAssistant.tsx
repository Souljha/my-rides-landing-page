import React, { useState, useEffect, useRef } from 'react';

interface VoiceAssistantProps {
  onContactCapture?: (contact: { name: string; phone: string; email: string }) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onContactCapture }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [conversationStep, setConversationStep] = useState('greeting');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    destination: ''
  });

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;

    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      synthRef.current = speechSynthesis;

      recognitionRef.current.onresult = (event: any) => {
        const results = event.results;
        const lastResult = results[results.length - 1];

        if (lastResult.isFinal) {
          const speechResult = lastResult[0].transcript;
          setTranscript(speechResult);
          handleVoiceInput(speechResult);
          setIsListening(false);
        } else {
          // Show interim results
          const interimResult = lastResult[0].transcript;
          setTranscript(interimResult);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const speak = (text: string) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setTranscript(''); // Clear previous transcript

      try {
        recognitionRef.current.start();

        // Set a timeout to automatically stop listening after 10 seconds
        timeoutRef.current = setTimeout(() => {
          if (isListening) {
            stopListening();
          }
        }, 10000);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleVoiceInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    let responseText = '';

    switch (conversationStep) {
      case 'greeting':
        responseText = "Hi! I'm your My Rides voice assistant. I can help you book a ride or answer questions about our service. What would you like to do today?";
        setConversationStep('main_menu');
        break;

      case 'main_menu':
        if (lowerInput.includes('book') || lowerInput.includes('ride') || lowerInput.includes('taxi')) {
          responseText = "Great! I'll help you book a ride. First, what's your name?";
          setConversationStep('get_name');
        } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('fare')) {
          responseText = "Our pricing is transparent with no surprises. You'll see the fare estimate upfront before booking. We also offer 'Ride now, Pay Later' for working passengers and students. Would you like to book a ride?";
          setConversationStep('main_menu');
        } else if (lowerInput.includes('safe') || lowerInput.includes('security')) {
          responseText = "Safety is our top priority. All drivers are vetted, and you can share trip details with loved ones. We're available 24/7. Would you like to book a ride?";
          setConversationStep('main_menu');
        } else {
          responseText = "I can help you book a ride, answer questions about pricing, or tell you about our safety features. What interests you?";
        }
        break;

      case 'get_name':
        setCustomerInfo(prev => ({ ...prev, name: input }));
        responseText = `Nice to meet you, ${input}! What's your phone number?`;
        setConversationStep('get_phone');
        break;

      case 'get_phone':
        setCustomerInfo(prev => ({ ...prev, phone: input }));
        responseText = "Got it! What's your email address?";
        setConversationStep('get_email');
        break;

      case 'get_email':
        setCustomerInfo(prev => ({ ...prev, email: input }));
        responseText = "Perfect! Where would you like to be picked up from?";
        setConversationStep('get_location');
        break;

      case 'get_location':
        setCustomerInfo(prev => ({ ...prev, location: input }));
        responseText = "And where would you like to go?";
        setConversationStep('get_destination');
        break;

      case 'get_destination':
        const finalInfo = { ...customerInfo, destination: input };
        setCustomerInfo(finalInfo);
        responseText = `Perfect! I've got your booking request from ${finalInfo.location} to ${input}. A driver will contact you at ${finalInfo.phone} shortly. Thank you for choosing My Rides!`;
        setConversationStep('complete');

        // Call the callback function with customer info
        if (onContactCapture) {
          onContactCapture({
            name: finalInfo.name,
            phone: finalInfo.phone,
            email: finalInfo.email
          });
        }
        break;

      case 'complete':
        responseText = "Your booking is complete! Is there anything else I can help you with today?";
        setConversationStep('main_menu');
        break;

      default:
        responseText = "I'm here to help you book a ride or answer questions about My Rides. How can I assist you?";
        setConversationStep('main_menu');
    }

    setResponse(responseText);
    speak(responseText);
  };

  const resetConversation = () => {
    setConversationStep('greeting');
    setCustomerInfo({ name: '', phone: '', email: '', location: '', destination: '' });
    setTranscript('');
    setResponse('');
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      resetConversation();
      setTimeout(() => {
        const greeting = "Hello! I'm your My Rides voice assistant. How can I help you today?";
        setResponse(greeting);
        speak(greeting);
        setConversationStep('main_menu');
      }, 500);
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <>
      {/* Floating Voice Assistant Button */}
      <button
        onClick={toggleAssistant}
        className="fixed bottom-4 right-24 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300 hover:scale-110"
        aria-label="Voice Assistant"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Voice Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end p-6">
          <div className="bg-white rounded-lg shadow-2xl w-96 h-96 flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-bold text-lg">My Rides Voice Assistant</h3>
              <button
                onClick={toggleAssistant}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {response && (
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Assistant:</strong> {response}
                    </p>
                  </div>
                )}
                {transcript && (
                  <div className="bg-primary-light bg-opacity-20 p-3 rounded-lg ml-8">
                    <p className="text-sm text-gray-700">
                      <strong>You:</strong> {transcript}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 border-t">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startListening}
                  disabled={isListening}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    isListening
                      ? 'bg-red-500 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isListening ? 'Listening...' : 'Talk'}
                </button>
                <button
                  onClick={resetConversation}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Reset
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Click "Talk" and speak clearly
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;