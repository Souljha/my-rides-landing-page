// API endpoint to receive Zapier webhook data and trigger Vapi callbacks
import { vapiService } from '../services/vapiService';

export interface ZapierWebhookData {
  name: string;
  phone: string;
  email?: string;
  // Add any other fields your Zapier chatbot collects
  interested_service?: string;
  preferred_time?: string;
  message?: string;
}

/**
 * Webhook handler for Zapier chatbot submissions
 * This will be called when someone provides their details via Zapier chat
 */
export async function handleZapierWebhook(data: ZapierWebhookData) {
  try {
    console.log('Received Zapier webhook data:', data);

    // Validate required fields
    if (!data.name || !data.phone) {
      throw new Error('Missing required fields: name and phone');
    }

    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = data.phone.replace(/[^\d+]/g, '');

    // Schedule callback with 2-minute delay
    const callbackData = {
      name: data.name,
      phone: cleanPhone,
      email: data.email,
      source: 'zapier_chatbot',
      additionalInfo: {
        interested_service: data.interested_service,
        preferred_time: data.preferred_time,
        message: data.message
      }
    };

    // Schedule the callback
    await scheduleCallback(callbackData, 2); // 2 minutes delay

    return {
      success: true,
      message: `Callback scheduled for ${data.name} at ${data.phone} in 2 minutes`
    };

  } catch (error) {
    console.error('Zapier webhook error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process webhook'
    };
  }
}

/**
 * Schedules a Vapi callback with a delay
 */
async function scheduleCallback(data: any, delayMinutes: number) {
  const delayMs = delayMinutes * 60 * 1000; // Convert minutes to milliseconds

  console.log(`Scheduling callback for ${data.name} in ${delayMinutes} minutes...`);

  // In a production environment, you'd want to use a proper job queue
  // For now, we'll use setTimeout (note: this won't persist across server restarts)
  setTimeout(async () => {
    try {
      console.log(`Initiating callback for ${data.name}...`);

      // Create enhanced AI agent with customer context
      // For testing, use simulation mode
      const result = await vapiService.simulateCallbackWithContext(data);
      // For production: const result = await vapiService.requestCallbackWithContext(data);

      if (result.success) {
        console.log(`Callback initiated successfully for ${data.name}:`, result.callId);

        // Optional: Log to your analytics or CRM
        await logCallbackAttempt(data, result);
      } else {
        console.error(`Callback failed for ${data.name}:`, result.message);

        // Optional: Retry logic or notification to admin
        await handleCallbackFailure(data, result.message);
      }

    } catch (error) {
      console.error(`Scheduled callback error for ${data.name}:`, error);
    }
  }, delayMs);

  return {
    success: true,
    scheduledFor: new Date(Date.now() + delayMs).toISOString()
  };
}

/**
 * Logs callback attempts for analytics
 */
async function logCallbackAttempt(data: any, result: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    customer: data.name,
    phone: data.phone,
    source: data.source,
    callId: result.callId,
    status: 'initiated'
  };

  console.log('Callback attempt logged:', logEntry);
  // In production: save to database, send to analytics, etc.
}

/**
 * Handles callback failures
 */
async function handleCallbackFailure(data: any, error: string) {
  const failureLog = {
    timestamp: new Date().toISOString(),
    customer: data.name,
    phone: data.phone,
    error: error,
    status: 'failed'
  };

  console.error('Callback failure logged:', failureLog);

  // In production:
  // - Retry with exponential backoff
  // - Send notification to admin
  // - Log to error tracking service
  // - Fallback to email/SMS notification
}

// For Express.js or similar server
export const zapierWebhookHandler = async (req: any, res: any) => {
  try {
    const result = await handleZapierWebhook(req.body);

    res.status(200).json(result);
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// For testing purposes - simulate webhook data
export const simulateZapierWebhook = async (testData: ZapierWebhookData) => {
  console.log('🧪 SIMULATING Zapier webhook...');
  return await handleZapierWebhook(testData);
};