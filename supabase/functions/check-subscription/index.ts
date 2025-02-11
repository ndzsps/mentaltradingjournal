
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
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid or missing authorization header')
    }

    // Initialize Supabase client with service role key for full access
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get user from token
    const token = authHeader.replace('Bearer ', '')
    console.log('Attempting to get user from token');
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError) {
      console.error('User error:', userError);
      throw new Error('Error getting user: ' + userError.message)
    }
    
    if (!user) {
      console.error('No user found');
      throw new Error('No user found for the provided token')
    }

    console.log('Successfully found user:', user.id);

    // First, let's get ALL subscriptions for this user to debug
    const { data: allSubs, error: allSubsError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id);

    if (allSubsError) {
      console.error('Error fetching all subscriptions:', allSubsError);
    } else {
      console.log('All subscriptions found:', allSubs);
    }

    // Now check for active subscription - include 'trialing' status as it's also valid
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*, stripe_subscription_id, stripe_customer_id')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .maybeSingle();

    if (subError) {
      console.error('Error fetching subscription:', subError);
      throw new Error('Error fetching subscription: ' + subError.message);
    }

    console.log('Active subscription found:', subscription);

    // Return subscription status with detailed response
    return new Response(
      JSON.stringify({ 
        subscribed: subscription !== null,
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
    console.error('Error in check-subscription:', error);
    
    // Determine if it's an auth error
    const isAuthError = error.message?.includes('auth') || 
                       error.message?.includes('token') ||
                       error.message?.includes('Authorization');
                       
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        type: isAuthError ? 'auth_error' : 'server_error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: isAuthError ? 401 : 500,
      }
    )
  }
})
