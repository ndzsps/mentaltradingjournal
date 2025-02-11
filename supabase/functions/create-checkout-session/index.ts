
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

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  try {
    // Get the session or user object
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data } = await supabaseClient.auth.getUser(token)
    const user = data.user
    const email = user?.email

    if (!email) {
      throw new Error('No email found')
    }

    console.log('Creating Stripe instance with secret key...')
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('Stripe secret key not found in environment')
      throw new Error('Stripe secret key not found in environment')
    }

    // Log stripe key length for debugging (don't log the actual key!)
    console.log('Stripe key length:', stripeSecretKey.length)

    try {
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16',
      })

      console.log('Checking for existing customer with email:', email)
      const customers = await stripe.customers.list({
        email: email,
        limit: 1
      })

      let customer_id = undefined
      if (customers.data.length > 0) {
        customer_id = customers.data[0].id
        console.log('Found existing customer:', customer_id)
        
        // check if already subscribed to this price
        console.log('Checking for active subscriptions...')
        const subscriptions = await stripe.subscriptions.list({
          customer: customers.data[0].id,
          status: 'active',
          price: 'price_1QiK8SI2A6O6E8LHKlfvakdi',
          limit: 1
        })

        if (subscriptions.data.length > 0) {
          console.log('Found active subscription')
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
        console.log('No existing customer found')
      }

      console.log('Creating subscription checkout session...')
      const session = await stripe.checkout.sessions.create({
        customer: customer_id,
        customer_email: customer_id ? undefined : email,
        line_items: [
          {
            price: 'price_1QiK8SI2A6O6E8LHKlfvakdi',
            quantity: 1,
          },
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: `${req.headers.get('origin')}/dashboard`,
        cancel_url: `${req.headers.get('origin')}/`,
      })

      console.log('Checkout session created:', session.id)
      return new Response(
        JSON.stringify({ url: session.url }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } catch (stripeError) {
      console.error('Stripe API Error:', {
        type: stripeError.type,
        message: stripeError.message,
        code: stripeError.code,
        statusCode: stripeError.statusCode,
        raw: stripeError
      })

      if (stripeError instanceof Stripe.errors.StripeError) {
        return new Response(
          JSON.stringify({ 
            error: stripeError.message,
            type: stripeError.type,
            code: stripeError.code 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: stripeError.statusCode || 500,
          }
        )
      }
      throw stripeError // Re-throw if not a Stripe error
    }
  } catch (error) {
    console.error('General error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: error.type,
      code: error.code,
      raw: error
    })
    
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
