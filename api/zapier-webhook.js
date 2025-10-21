// Vercel API Route for Zapier Webhook
// This file will be accessible at: https://your-site.vercel.app/api/zapier-webhook

// Vapi Configuration
const VAPI_API_KEY = '720168a0-f369-4355-9f7e-242799b4e268';
const VAPI_ASSISTANT_ID = '23ed55e3-0ba4-4b9f-87f2-80c539c72b19';
const VAPI_PHONE_NUMBER_ID = '0e0a14cf-c747-44df-add1-3d6a3c3e409c';

// Function to create a Vapi phone call
async function createVapiCall(customerData) {
  try {
    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId: VAPI_ASSISTANT_ID,
        phoneNumberId: VAPI_PHONE_NUMBER_ID,
        customer: {
          number: customerData.phone,
          name: customerData.name,
          email: customerData.email || null,
        },
        // Optional: Pass additional context to the assistant
        assistantOverrides: {
          variableValues: {
            customer_name: customerData.name,
            interested_service: customerData.interested_service || 'Not specified',
            preferred_time: customerData.preferred_time || 'Not specified',
            message: customerData.message || 'No message provided',
          }
        }
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Vapi API error: ${JSON.stringify(result)}`);
    }

    return result;
  } catch (error) {
    console.error('❌ Vapi call creation failed:', error);
    throw error;
  }
}

// Simple webhook handler for Vercel
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    });
  }

  try {
    const data = req.body;

    console.log('📞 Zapier webhook received:', data);

    // Validate required fields
    if (!data.name || !data.phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name and phone'
      });
    }

    // Clean phone number - ensure it has country code
    let cleanPhone = data.phone.replace(/[^\d+]/g, '');

    // If phone doesn't start with +, assume South African number
    if (!cleanPhone.startsWith('+')) {
      cleanPhone = '+27' + cleanPhone;
    }

    // Log the customer info
    const customerData = {
      name: data.name,
      phone: cleanPhone,
      email: data.email,
      interested_service: data.interested_service,
      preferred_time: data.preferred_time,
      message: data.message,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Customer data processed:', customerData);

    // Create Vapi phone call
    console.log(`📞 Initiating Vapi call to ${customerData.name} at ${cleanPhone}...`);

    const vapiCall = await createVapiCall(customerData);

    console.log('✅ Vapi call created successfully:', vapiCall);

    return res.status(200).json({
      success: true,
      message: `Call initiated for ${data.name}`,
      data: {
        name: data.name,
        phone: cleanPhone,
        callId: vapiCall.id,
        status: vapiCall.status,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}