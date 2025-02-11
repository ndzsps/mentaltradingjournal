
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

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get user from token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Error getting user: ' + userError?.message)
    }

    console.log('Checking subscription for user:', user.id)

    // Check subscription status using maybeSingle() instead of single()
    const { data: subscription, error: subscriptionError } = await supabaseClient
      .from('subscriptions')
      .select('is_active, stripe_subscription_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (subscriptionError) {
      console.error('Error checking subscription:', subscriptionError)
      throw new Error('Error checking subscription: ' + subscriptionError.message)
    }

    // Add debug logging
    console.log('Subscription status:', {
      subscription,
      isActive: subscription?.is_active,
      stripeSubId: subscription?.stripe_subscription_id
    })

    return new Response(
      JSON.stringify({ 
        subscribed: subscription?.is_active ?? false,
        userId: user.id,
        stripeSubscriptionId: subscription?.stripe_subscription_id
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
        status: 400, // Changed from 500 to 400 for client errors
      }
    )
  }
})
