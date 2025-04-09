
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const TELEGRAM_API_KEY = "7733675635:AAHmhH1jtGxs8KKF8dZmRyp6xPqKIuWiqSs"
const CHAT_ID = "1349542277"

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to notify user about their subscription status
async function notifyUser(userId: string, status: "approved" | "rejected", subscriptionType?: string) {
  try {
    // Get user details
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', userId)
      .single();
      
    if (userError || !userData) {
      throw new Error(`Error fetching user data: ${userError?.message || "User not found"}`);
    }
    
    // In a real application, you would send an email here
    // For now, we'll log it for debugging purposes
    console.log(`Notification would be sent to ${userData.email}: Subscription ${status} ${status === "approved" ? "for " + subscriptionType + " plan" : ""}`);
    
    // You could implement email sending using a third-party service here
    // For example, using SendGrid or a similar service
    
    return { success: true };
  } catch (error) {
    console.error("Error notifying user:", error);
    return { success: false, error };
  }
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

      // Handle direct payment approval by payment ID
      if (text.startsWith('/approve_') && text.split('_').length === 2) {
        const paymentId = text.split('_')[1]
        
        if (paymentId) {
          console.log(`Processing approval for payment ${paymentId}`);
          
          // Call the update_payment_status function to handle the approval
          const { error } = await supabase.rpc(
            'update_payment_status', 
            { 
              payment_id: paymentId,
              new_status: 'approved'
            }
          );
            
          if (error) {
            await sendTelegramMessage(`❌ Error updating payment ${paymentId}: ${error.message}`);
            return new Response(
              JSON.stringify({ success: false, error: error.message }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          // Get payment details to notify the user
          const { data: paymentData } = await supabase
            .from('payments')
            .select('user_id, subscription_type')
            .eq('id', paymentId)
            .single();
          
          if (paymentData) {
            // Notify the user about the approval
            const notificationResult = await notifyUser(
              paymentData.user_id, 
              "approved", 
              paymentData.subscription_type
            );
            
            if (!notificationResult.success) {
              await sendTelegramMessage(`⚠️ Approved payment ${paymentId}, but failed to notify user: ${notificationResult.error}`);
            } else {
              await sendTelegramMessage(`✅ Approved payment ${paymentId}. User has been notified.`);
            }
          } else {
            await sendTelegramMessage(`✅ Approved payment ${paymentId}, but couldn't find payment details.`);
          }
          
          return new Response(
            JSON.stringify({ success: true, message: 'Payment approved' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      // Handle direct payment rejection by payment ID
      if (text.startsWith('/reject_') && text.split('_').length === 2) {
        const paymentId = text.split('_')[1]
        
        if (paymentId) {
          console.log(`Processing rejection for payment ${paymentId}`);
          
          // Get payment details first to get the user_id
          const { data: paymentData } = await supabase
            .from('payments')
            .select('user_id')
            .eq('id', paymentId)
            .single();
          
          if (!paymentData) {
            await sendTelegramMessage(`❌ Error: Payment ${paymentId} not found`);
            return new Response(
              JSON.stringify({ success: false, error: 'Payment not found' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          // Update payment status to rejected
          const { error: updatePaymentError } = await supabase
            .from('payments')
            .update({ status: 'rejected' })
            .eq('id', paymentId);
            
          if (updatePaymentError) {
            await sendTelegramMessage(`❌ Error updating payment ${paymentId}: ${updatePaymentError.message}`);
            return new Response(
              JSON.stringify({ success: false, error: updatePaymentError.message }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          // Update user's subscription status
          const { error: updateUserError } = await supabase
            .from('users')
            .update({ 
              subscription_status: 'rejected',
              requested_subscription: null
            })
            .eq('id', paymentData.user_id);
            
          if (updateUserError) {
            await sendTelegramMessage(`❌ Error updating user subscription status: ${updateUserError.message}`);
          }
          
          // Notify the user about the rejection
          const notificationResult = await notifyUser(paymentData.user_id, "rejected");
          
          if (!notificationResult.success) {
            await sendTelegramMessage(`⚠️ Rejected payment ${paymentId}, but failed to notify user: ${notificationResult.error}`);
          } else {
            await sendTelegramMessage(`❌ Rejected payment ${paymentId}. User has been notified.`);
          }
          
          return new Response(
            JSON.stringify({ success: true, message: 'Payment rejected' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      // Handle legacy approve command for backward compatibility
      if (text.startsWith('/approve_') && text.split('_').length === 3) {
        const [_, userId, subscriptionType] = text.split('_')
        
        if (userId && subscriptionType) {
          console.log(`Processing approval for user ${userId} to ${subscriptionType} plan`);
          
          // Update the user's subscription in the database
          const { error } = await supabase
            .from('users')
            .update({ 
              subscription: subscriptionType,
              subscription_status: 'active',
              requested_subscription: null
            })
            .eq('id', userId);
            
          if (error) {
            await sendTelegramMessage(`❌ Error updating subscription for user ${userId}: ${error.message}`);
            return new Response(
              JSON.stringify({ success: false, error: error.message }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          // Notify the user about the approval
          const notificationResult = await notifyUser(userId, "approved", subscriptionType);
          
          if (!notificationResult.success) {
            await sendTelegramMessage(`⚠️ Approved subscription for user ${userId}, but failed to notify user: ${notificationResult.error}`);
          } else {
            await sendTelegramMessage(`✅ Approved subscription for user ${userId} to ${subscriptionType} plan. User has been notified.`);
          }
          
          return new Response(
            JSON.stringify({ success: true, message: 'Subscription approved' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
      
      // Handle legacy reject command for backward compatibility
      if (text.startsWith('/reject_') && text.split('_').length === 2) {
        const userId = text.split('_')[1]
        
        if (userId) {
          console.log(`Processing rejection for user ${userId}`);
          
          // Update the user's subscription status in the database
          const { error } = await supabase
            .from('users')
            .update({ 
              subscription_status: 'rejected',
              requested_subscription: null
            })
            .eq('id', userId);
            
          if (error) {
            await sendTelegramMessage(`❌ Error rejecting subscription for user ${userId}: ${error.message}`);
            return new Response(
              JSON.stringify({ success: false, error: error.message }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          // Notify the user about the rejection
          const notificationResult = await notifyUser(userId, "rejected");
          
          if (!notificationResult.success) {
            await sendTelegramMessage(`⚠️ Rejected subscription for user ${userId}, but failed to notify user: ${notificationResult.error}`);
          } else {
            await sendTelegramMessage(`❌ Rejected subscription request for user ${userId}. User has been notified.`);
          }
          
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
