
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TELEGRAM_API_KEY = "7733675635:AAHmhH1jtGxs8KKF8dZmRyp6xPqKIuWiqSs"
const CHAT_ID = "1349542277"

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method === 'POST') {
      const update = await req.json()
      
      // Extract the message from the Telegram update
      const message = update.message || update.callback_query?.message
      
      if (!message || !message.text) {
        return new Response(
          JSON.stringify({ success: true, message: 'No message received' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      // Process commands
      const text = message.text

      // Handle approve command
      if (text.startsWith('/approve_')) {
        const [_, userId, subscriptionType] = text.split('_')
        
        if (userId && subscriptionType) {
          // In a real implementation, you would update the user's subscription in your database
          // This is a simplified example
          await sendTelegramMessage(`✅ Approved subscription for user ${userId} to ${subscriptionType} plan`)
          
          return new Response(
            JSON.stringify({ success: true, message: 'Subscription approved' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
      
      // Handle reject command
      if (text.startsWith('/reject_')) {
        const userId = text.split('_')[1]
        
        if (userId) {
          // In a real implementation, you would handle the rejection in your database
          await sendTelegramMessage(`❌ Rejected subscription request for user ${userId}`)
          
          return new Response(
            JSON.stringify({ success: true, message: 'Subscription rejected' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
      
      // Default response for other messages
      return new Response(
        JSON.stringify({ success: true, message: 'Command not recognized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

async function sendTelegramMessage(text: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_API_KEY}/sendMessage`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'Markdown',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to send Telegram message: ${error}`)
  }

  return await response.json()
}
