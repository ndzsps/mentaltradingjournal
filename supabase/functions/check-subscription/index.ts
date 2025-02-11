
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

    // First, let's get ALL subscriptions for this user to debug
    const { data: allSubs, error: allSubsError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id);

    console.log('All subscriptions found:', allSubs);

    // Now check for active subscription
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*, stripe_subscription_id, stripe_customer_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (subError) {
      console.error('Error fetching subscription:', subError);
      throw new Error('Error fetching subscription: ' + subError.message);
    }

    console.log('Active subscription found:', subscription);

    // Return subscription status
    return new Response(
      JSON.stringify({ 
        subscribed: subscription !== null,  // true if there's an active subscription
        userId: user.id,
        subscription: subscription,
        debug: {
          allSubscriptions: allSubs,
          userEmail: user.email
        }
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
