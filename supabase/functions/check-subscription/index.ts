
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'

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
    // Get auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Initialize Supabase client with service role key for full access
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get user from token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Error getting user: ' + userError?.message)
    }

    console.log('Checking subscription for user:', user.id, 'email:', user.email);

    // Check if user has an active subscription
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*, stripe_subscription_id, stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError) {
      console.error('Error fetching subscription:', subError);
      throw new Error('Error fetching subscription: ' + subError.message);
    }

    console.log('Found subscription:', subscription);

    // Check if there's a subscription but it's not marked as active
    if (subscription && subscription.stripe_subscription_id && subscription.status !== 'active') {
      console.log('Found subscription but status is not active, updating status...');
      
      // Update subscription status to active
      const { error: updateError } = await supabaseClient
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('id', subscription.id);

      if (updateError) {
        console.error('Error updating subscription status:', updateError);
        throw new Error('Error updating subscription status: ' + updateError.message);
      }

      // Return success with updated subscription status
      return new Response(
        JSON.stringify({ 
          subscribed: true,
          userId: user.id,
          subscription: { ...subscription, status: 'active' }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        subscribed: subscription?.status === 'active',
        userId: user.id,
        subscription: subscription // Include subscription details for debugging
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error checking subscription:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
