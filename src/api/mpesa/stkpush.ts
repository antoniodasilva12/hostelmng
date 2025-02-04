import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const { phoneNumber, amount, accountReference } = await request.json();

  // M-PESA API credentials (should be in environment variables)
  const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
  const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
  const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
  const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;

  try {
    // Get access token
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    const tokenResponse = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    
    const { access_token } = await tokenResponse.json();

    // Generate password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

    // Initiate STK Push
    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.BASE_URL}/api/mpesa/callback`,
        AccountReference: accountReference,
        TransactionDesc: `Hostel Payment - ${accountReference}`,
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('M-PESA API error:', error);
    return new Response(JSON.stringify({ error: 'Payment processing failed' }), { status: 500 });
  }
} 