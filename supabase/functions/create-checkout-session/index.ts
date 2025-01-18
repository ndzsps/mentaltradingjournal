import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

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
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header')
      throw new Error('No authorization header')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get user data
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      console.error('User error:', userError)
      throw new Error('Unauthorized')
    }

    const email = user.email
    if (!email) {
      console.error('No email found')
      throw new Error('No email found')
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      console.error('Stripe key not configured')
      throw new Error('Stripe key not configured')
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    })

    console.log('Creating checkout session for email:', email)

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: 'price_1QiK8SI2A6O6E8LHKlfvakdi',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/journal-entry`,
      cancel_url: `${req.headers.get('origin')}/`,
    })

    console.log('Checkout session created:', session.id)

    // Return the session URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in create-checkout-session:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500,
      }
    )
  }
})