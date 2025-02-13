
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Webhook received. Method:", req.method);
  console.log("Headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));

  const stripeSignature = req.headers.get("stripe-signature");
  if (!stripeSignature) {
    console.error("No stripe signature in webhook request");
    return new Response(JSON.stringify({ error: "No stripe signature" }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  console.log("Environment check:", {
    hasStripeKey: !!STRIPE_SECRET_KEY,
    hasWebhookSecret: !!STRIPE_WEBHOOK_SECRET,
    hasSupabaseUrl: !!SUPABASE_URL,
    hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY
  });

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing environment variables");
    return new Response(JSON.stringify({ error: "Missing environment variables" }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
  });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const body = await req.text();
    console.log("Raw request body:", body);
    
    let event: Stripe.Event;
    try {
      // Changed from constructEvent to constructEventAsync
      event = await stripe.webhooks.constructEventAsync(
        body,
        stripeSignature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Error verifying webhook signature:", err);
      console.error("Stripe-Signature header:", stripeSignature);
      console.error("Webhook secret length:", STRIPE_WEBHOOK_SECRET?.length);
      return new Response(
        JSON.stringify({
          error: "Webhook signature verification failed",
          details: err instanceof Error ? err.message : "Unknown Error"
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("Successfully verified webhook signature. Event type:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Processing checkout.session.completed:", session.id);
        
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          console.log("Retrieved subscription details:", {
            id: subscription.id,
            status: subscription.status,
            userId: subscription.metadata.user_id,
            customerId: subscription.customer,
            priceId: subscription.items.data[0].price.id
          });
          
          const { error } = await supabase.from("subscriptions").upsert({
            stripe_subscription_id: subscription.id,
            user_id: subscription.metadata.user_id,
            status: subscription.status,
            stripe_customer_id: subscription.customer as string,
            stripe_price_id: subscription.items.data[0].price.id,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
          });

          if (error) {
            console.error("Error upserting subscription:", error);
            return new Response(JSON.stringify({ error: "Error upserting subscription", details: error }), { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          console.log("Successfully updated subscription in database for session:", session.id);
        }
        break;
      }
      
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Processing subscription event:", {
          type: event.type,
          id: subscription.id,
          status: subscription.status,
          userId: subscription.metadata.user_id,
          customerId: subscription.customer,
          priceId: subscription.items.data[0].price.id
        });
        
        const { error } = await supabase.from("subscriptions").upsert({
          stripe_subscription_id: subscription.id,
          user_id: subscription.metadata.user_id,
          status: subscription.status,
          stripe_customer_id: subscription.customer as string,
          stripe_price_id: subscription.items.data[0].price.id,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
          canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
        });

        if (error) {
          console.error("Error upserting subscription:", error);
          return new Response(JSON.stringify({ error: "Error upserting subscription", details: error }), { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        console.log("Successfully updated subscription in database for subscription:", subscription.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Processing subscription deletion:", subscription.id);
        
        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "canceled" })
          .match({ stripe_subscription_id: subscription.id });

        if (error) {
          console.error("Error updating subscription:", error);
          return new Response(JSON.stringify({ error: "Error updating subscription", details: error }), { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        console.log("Successfully marked subscription as canceled in database:", subscription.id);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response(
      JSON.stringify({ 
        error: "Webhook Error", 
        details: err instanceof Error ? err.message : "Unknown Error"
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

Deno.serve(handler);
