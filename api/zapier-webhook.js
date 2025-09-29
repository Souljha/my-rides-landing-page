// Vercel API Route for Zapier Webhook
// This file will be accessible at: https://your-site.vercel.app/api/zapier-webhook

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

    // Clean phone number
    const cleanPhone = data.phone.replace(/[^\d+]/g, '');

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

    // In production, this is where you would:
    // 1. Save to database
    // 2. Schedule Vapi callback
    // 3. Send notifications

    // For now, we'll simulate the callback scheduling
    console.log(`🕐 Scheduling Vapi callback for ${data.name} in 2 minutes...`);

    // Simulate delay (in production, use a proper job queue)
    setTimeout(() => {
      console.log(`📞 Would call Vapi for ${data.name} at ${cleanPhone}`);
      // This is where the actual Vapi API call would happen
    }, 2 * 60 * 1000); // 2 minutes

    return res.status(200).json({
      success: true,
      message: `Callback scheduled for ${data.name}`,
      data: {
        name: data.name,
        phone: cleanPhone,
        scheduledFor: new Date(Date.now() + 2 * 60 * 1000).toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}