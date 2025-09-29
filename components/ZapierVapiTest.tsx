import React, { useState } from 'react';
import { simulateZapierWebhook } from '../api/zapier-webhook';

// Test component to simulate Zapier → Vapi integration
const ZapierVapiTest: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>('');

  const testZapierIntegration = async () => {
    setIsProcessing(true);
    setResult('');

    try {
      // Simulate data that would come from Zapier chatbot
      const testCustomerData = {
        name: 'John Smith',
        phone: '+1234567890',
        email: 'john.smith@example.com',
        interested_service: 'Daily commute rides',
        preferred_time: 'Morning',
        message: 'I need a reliable ride to work every day'
      };

      console.log('🔄 Simulating Zapier chatbot submission...');
      setResult('✅ Customer provided details via Zapier chatbot\n⏱️ Scheduling Vapi callback in 2 minutes...');

      // Call our webhook handler
      const webhookResult = await simulateZapierWebhook(testCustomerData);

      if (webhookResult.success) {
        setResult(prev => prev + '\n✅ Webhook processed successfully\n🤖 AI voice agent will call customer shortly...');

        // Show success for 3 seconds then reset
        setTimeout(() => {
          setResult('Integration test completed! Check console for full details.');
        }, 3000);
      } else {
        setResult(`❌ Integration failed: ${webhookResult.message}`);
      }

    } catch (error) {
      console.error('Test error:', error);
      setResult(`❌ Test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-24 right-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors z-50"
      >
        🧪 Test Zapier Integration
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 bg-white border-2 border-purple-600 rounded-lg shadow-lg p-4 w-80 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-purple-600">Zapier → Vapi Test</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          <strong>Test Flow:</strong>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Customer chats with Zapier bot</li>
            <li>Provides contact details</li>
            <li>Webhook triggers</li>
            <li>2-minute delay</li>
            <li>Vapi calls customer</li>
          </ol>
        </div>

        <button
          onClick={testZapierIntegration}
          disabled={isProcessing}
          className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          {isProcessing ? 'Testing...' : 'Run Integration Test'}
        </button>

        {result && (
          <div className="mt-3 p-3 bg-gray-50 rounded text-xs font-mono whitespace-pre-line">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default ZapierVapiTest;