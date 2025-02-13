
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response("Missing environment variables", { status: 500 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
  });

  try {
    const { priceId, userId } = await req.json();

    // Create or retrieve customer
    const { data: subscriptions } = await createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    let customerId = subscriptions?.stripe_customer_id;

    if (!customerId) {
      const { data: userProfile } = await createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .single();

      const customer = await stripe.customers.create({
        email: userProfile.email,
        metadata: {
          user_id: userId,
        },
      });
      customerId = customer.id;
    }

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

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

Deno.serve(handler);
