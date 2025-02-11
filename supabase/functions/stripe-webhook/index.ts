
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripeSignature = req.headers.get('stripe-signature')
    if (!stripeSignature) {
      throw new Error('No Stripe signature found')
    }

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing Stripe configuration')
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })

    // Get the raw body
    const body = await req.text()

    // Verify the webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        stripeSignature,
        STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error('Error verifying webhook signature:', err)
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        console.log('Processing checkout session:', session.id)

        // Update or create subscription record
        const { error: upsertError } = await supabaseClient
          .from('subscriptions')
          .upsert({
            user_id: session.metadata?.supabase_user_id || session.client_reference_id,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            status: subscription.status,
          })

        if (upsertError) {
          console.error('Error updating subscription:', upsertError)
          throw upsertError
        }

        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        console.log('Processing subscription update:', subscription.id)

        // Update subscription status
        const { error: updateError } = await supabaseClient
          .from('subscriptions')
          .update({ 
            status: subscription.status,
          })
          .eq('stripe_subscription_id', subscription.id)

        if (updateError) {
          console.error('Error updating subscription:', updateError)
          throw updateError
        }

        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
