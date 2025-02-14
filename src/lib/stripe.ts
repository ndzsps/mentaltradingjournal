
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function createCheckoutSession(priceId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error('User must be logged in');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        userId: session.user.id,
      },
    });

    if (error) {
      console.error('Checkout error:', error);
      toast.error("Failed to start checkout process. Please try again.");
      throw error;
    }
    if (!data?.url) throw new Error('No checkout URL returned');

    window.location.href = data.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function createPortalSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error('User must be logged in');
    }

    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: {},
    });

    if (error) throw error;
    if (!data?.url) throw new Error('No portal URL returned');

    window.location.href = data.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}
