
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing environment variables:", {
      hasStripeKey: !!STRIPE_SECRET_KEY,
      hasSupabaseUrl: !!SUPABASE_URL,
      hasServiceRoleKey: !!SUPABASE_SERVICE_ROLE_KEY
    });
    return new Response(JSON.stringify({ error: "Server configuration error" }), { 
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
    const { priceId, userId } = await req.json();
    console.log("Received request for price:", priceId, "user:", userId);

    // Create or retrieve customer
    let { data: subscriptions, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (subscriptionError) {
      console.error("Error fetching subscription:", subscriptionError);
      throw new Error("Error fetching subscription data");
    }

    let customerId = subscriptions?.stripe_customer_id;

    if (!customerId) {
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        throw new Error("Error fetching user profile");
      }

      if (!userProfile?.email) {
        console.error("No email found for user:", userId);
        throw new Error("User email not found");
      }

      const customer = await stripe.customers.create({
        email: userProfile.email,
        metadata: {
          user_id: userId,
        },
      });
      customerId = customer.id;
      console.log("Created new Stripe customer:", customerId);
    }

    console.log("Using customer ID:", customerId);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?success=true`,
      cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
      subscription_data: {
        metadata: {
          user_id: userId,
        },
      },
    });

    console.log("Created checkout session:", session.id);

    return new Response(
      JSON.stringify({ url: session.url }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error("Error in checkout process:", err);
    return new Response(
      JSON.stringify({ 
        error: err instanceof Error ? err.message : "Unknown error occurred",
        details: err instanceof Error ? err.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

Deno.serve(handler);
