
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
  const message = `
🔔 *New Subscription Payment*

*User:* ${paymentData.userName}
*Email:* ${paymentData.userEmail}
*Plan:* ${paymentData.subscriptionType}
*Transaction ID:* ${paymentData.transactionId}
*User ID:* ${paymentData.userId}

Use the following commands to approve or reject:
/approve_${paymentData.userId}_${paymentData.subscriptionType}
/reject_${paymentData.userId}
  `

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
