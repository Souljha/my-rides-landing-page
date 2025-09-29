// Vapi.ai Service for My Rides Voice Agent
export interface CallbackRequest {
  name: string;
  phone: string;
  email?: string;
}

export interface VapiCallResponse {
  success: boolean;
  callId?: string;
  message: string;
}

class VapiService {
  private apiKey: string;
  private baseUrl = 'https://api.vapi.ai';

  constructor() {
    // You'll need to set your Vapi API key here or via environment variable
    this.apiKey = process.env.VAPI_API_KEY || 'YOUR_VAPI_API_KEY_HERE';
  }

  /**
   * Creates an AI voice agent configured for My Rides callback
   */
  private createMyRidesAgent(customerContext?: any) {
    const baseSystemMessage = `You are a friendly AI voice assistant for My Rides, an e-hailing taxi service. Your job is to:

1. Introduce yourself: "Hi! This is the AI assistant from My Rides calling you back as requested."

2. Explain our service briefly:
   - We're a reliable e-hailing taxi service
   - Available 24/7 with vetted drivers
   - Fast pickup times (usually within minutes)
   - Transparent pricing with no surprises

3. Highlight our unique features:
   - "Ride now, Pay Later" option for working passengers and students
   - Safety first approach with trip sharing capabilities
   - Easy-to-use app with upfront fare estimates

4. Ask if they're interested in:
   - Downloading our app
   - Creating an account
   - Learning about specific services (airport rides, daily commutes, etc.)

5. If they're interested, offer to:
   - Text them the app download link
   - Have a human representative follow up
   - Answer any specific questions about pricing or services

6. Keep the call under 3 minutes
7. Be friendly, professional, and helpful
8. End with: "Thank you for your interest in My Rides. We look forward to serving you!"

If they're not interested, politely thank them and end the call.`;

    // Add customer context if available
    const contextualMessage = customerContext
      ? `${baseSystemMessage}\n\nCUSTOMER CONTEXT:\n- Name: ${customerContext.name}\n- Interested in: ${customerContext.additionalInfo?.interested_service || 'general service'}\n- Source: They contacted us via our website chatbot\n- Special notes: ${customerContext.additionalInfo?.message || 'None'}\n\nPersonalize the conversation based on this context.`
      : baseSystemMessage;
    return {
      model: {
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: contextualMessage
          }
        ],
        temperature: 0.7
      },
      voice: {
        provider: 'elevenlabs',
        voiceId: 'rachel', // Professional female voice
        speed: 1.0,
        stability: 0.8,
        similarityBoost: 0.8
      },
      firstMessage: "Hi! This is the AI assistant from My Rides calling you back as requested. Thanks for your interest in our ride service! Do you have a couple of minutes for me to tell you about what we offer?",
      endCallMessage: "Thank you for your time! We look forward to serving you with My Rides. Have a great day!",
      maxDurationSeconds: 180, // 3 minutes max
      silenceTimeoutSeconds: 10,
      responseDelaySeconds: 1
    };
  }

  /**
   * Initiates a callback using Vapi.ai
   */
  async requestCallback(data: CallbackRequest): Promise<VapiCallResponse> {
    try {
      const agent = this.createMyRidesAgent();

      const callPayload = {
        assistant: agent,
        customer: {
          number: data.phone,
          name: data.name,
          email: data.email
        },
        phoneNumber: {
          // You'll need to set up a phone number in Vapi dashboard
          // This should be your Vapi phone number
          twilioPhoneNumber: '+1234567890' // Replace with your Vapi phone number
        }
      };

      const response = await fetch(`${this.baseUrl}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(callPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Vapi API error: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        callId: result.id,
        message: 'Callback initiated successfully. You should receive a call within 2-5 minutes.'
      };

    } catch (error) {
      console.error('Vapi callback error:', error);

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to initiate callback. Please try again.'
      };
    }
  }

  /**
   * Initiates a callback with customer context (for Zapier integration)
   */
  async requestCallbackWithContext(customerData: any): Promise<VapiCallResponse> {
    try {
      const agent = this.createMyRidesAgent(customerData);

      const callPayload = {
        assistant: agent,
        customer: {
          number: customerData.phone,
          name: customerData.name,
          email: customerData.email
        },
        phoneNumber: {
          twilioPhoneNumber: '+1234567890' // Replace with your Vapi phone number
        }
      };

      const response = await fetch(`${this.baseUrl}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(callPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Vapi API error: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        callId: result.id,
        message: `Contextual callback initiated for ${customerData.name}. Call incoming in 30 seconds.`
      };

    } catch (error) {
      console.error('Vapi contextual callback error:', error);

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to initiate contextual callback.'
      };
    }
  }

  /**
   * For testing purposes - simulates a callback without using real credits
   */
  async simulateCallback(data: CallbackRequest): Promise<VapiCallResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Simulated Vapi callback for:', data);

    return {
      success: true,
      callId: `sim_${Date.now()}`,
      message: `SIMULATION: Callback would be made to ${data.phone} for ${data.name}. In production, this would trigger a real Vapi call.`
    };
  }

  /**
   * Simulates contextual callback for testing
   */
  async simulateCallbackWithContext(customerData: any): Promise<VapiCallResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('🧪 SIMULATED Contextual Vapi callback for:', customerData);

    return {
      success: true,
      callId: `sim_ctx_${Date.now()}`,
      message: `SIMULATION: AI would call ${customerData.name} at ${customerData.phone} with personalized context about ${customerData.additionalInfo?.interested_service || 'My Rides service'}.`
    };
  }
}

export const vapiService = new VapiService();