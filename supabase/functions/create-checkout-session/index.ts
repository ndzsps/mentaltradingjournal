
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Function started');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Getting auth token...');
    // Get the session or user object
    const authHeader = req.headers.get('Authorization')!
    if (!authHeader) {
      console.error('No authorization header found');
      throw new Error('No authorization header')
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )
    
    const token = authHeader.replace('Bearer ', '')
    console.log('Authenticating user...');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    if (!user?.email) {
      console.error('No email found in user data');
      throw new Error('No email found')
    }

    console.log('Accessing Stripe secret key...');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('Stripe secret key not found in environment');
      return new Response(
        JSON.stringify({ 
          error: "configuration_error",
          message: "Stripe secret key not configured"
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    try {
      console.log('Initializing Stripe...');
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16',
      })

      console.log('Finding or creating customer for:', user.email);
      let customer;
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1
      })

      if (customers.data.length > 0) {
        customer = customers.data[0]
        console.log('Found existing customer:', customer.id);
        
        console.log('Checking for active subscriptions...');
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: 'active',
          limit: 1
        })

        if (subscriptions.data.length > 0) {
          console.log('Found active subscription, returning conflict response');
          return new Response(
            JSON.stringify({ 
              error: "already_subscribed",
              message: "You already have an active subscription",
              redirectTo: "/dashboard"
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 409,
            }
          )
        }
      } else {
        console.log('Creating new customer...');
        customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabase_user_id: user.id
          }
        })
        console.log('Created new customer:', customer.id);
      }

      console.log('Creating checkout session...');
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        line_items: [
          {
            price: 'price_1QrIL9I2A6O6E8LHVoQ36VB3',
            quantity: 1,
          },
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: `${req.headers.get('origin')}/dashboard`,
        cancel_url: `${req.headers.get('origin')}/`,
      })

      console.log('Checkout session created successfully:', { sessionId: session.id, url: session.url });
      return new Response(
        JSON.stringify({ url: session.url }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } catch (stripeError) {
      console.error('Stripe API Error:', {
        name: stripeError.name,
        type: stripeError.type,
        message: stripeError.message,
        code: stripeError.code,
        statusCode: stripeError.statusCode,
        raw: stripeError
      });

      // Return detailed error information for debugging
      return new Response(
        JSON.stringify({ 
          error: stripeError.message,
          type: stripeError.type,
          code: stripeError.code,
          raw: stripeError
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: stripeError.statusCode || 500,
        }
      )
    }
  } catch (error) {
    console.error('General error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: error.type,
      code: error.code,
      raw: error
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        ...(error.message === "User from sub claim in JWT does not exist" && {
          redirectTo: "/login"
        })
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === "User from sub claim in JWT does not exist" ? 401 : 500,
      }
    )
  }
})
