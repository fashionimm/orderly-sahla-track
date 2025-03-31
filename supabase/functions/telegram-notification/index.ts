import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TELEGRAM_API_KEY = "7733675635:AAHmhH1jtGxs8KKF8dZmRyp6xPqKIuWiqSs"
const CHAT_ID = "1349542277"

type PaymentData = {
  userId: string
  userName: string
  userEmail: string
  subscriptionType: string
  transactionId: string
  binanceId?: string
  binanceEmail?: string
}

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sendTelegramMessage(paymentData: PaymentData) {
  // Create commands with clearer formatting
  const approveCommand = `/approve_${paymentData.userId}_${paymentData.subscriptionType}`;
  const rejectCommand = `/reject_${paymentData.userId}`;

  // Build a clean message that keeps transaction ID separate from optional Binance details
  let message = `
🔔 *New Subscription Payment*

*User:* ${paymentData.userName}
*Email:* ${paymentData.userEmail}
*Plan:* ${paymentData.subscriptionType}
*Transaction ID:* ${paymentData.transactionId}
*User ID:* ${paymentData.userId}
`;

  // Only add Binance details if provided
  if (paymentData.binanceId || paymentData.binanceEmail) {
    message += "\n*Binance Details:*";
    
    if (paymentData.binanceId) {
      message += `\nBinance ID: ${paymentData.binanceId}`;
    }
    
    if (paymentData.binanceEmail) {
      message += `\nBinance Email: ${paymentData.binanceEmail}`;
    }
  }

  // Add commands at the end
  message += `

*Commands:*
\`${approveCommand}\` - To approve
\`${rejectCommand}\` - To reject
`;

  const url = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/sendMessage`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to send Telegram message: ${error}`)
  }

  return await response.json()
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method === 'POST') {
      const paymentData = await req.json() as PaymentData
      
      // Send notification to Telegram
      const telegramResponse = await sendTelegramMessage(paymentData)
      
      return new Response(
        JSON.stringify({ success: true, message: 'Telegram notification sent' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
