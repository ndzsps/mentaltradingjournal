
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSubscription = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['subscription-status', session?.access_token],
    queryFn: async () => {
      if (!session?.access_token) {
        console.log('No session available, skipping subscription check');
        return false;
      }

      try {
        console.log('Checking subscription status...');
        const { data, error } = await supabase.functions.invoke(
          'check-subscription',
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            }
          }
        );
        
        if (error) {
          // Log the full error for debugging
          console.error('Subscription check error:', JSON.stringify(error, null, 2));
          
          // If we get an authentication error, return false instead of throwing
          if (error.status === 401) {
            console.log('Subscription check failed due to auth error, returning false');
            return false;
          }
          throw error;
        }
        
        console.log('Subscription check result:', data);
        return data;
      } catch (error) {
        // Log the full error for debugging
        console.error('Subscription check failed:', error);
        return false;
      }
    },
    enabled: !!session?.access_token,
    retry: false,
    refetchInterval: 30000, // Refetch every 30 seconds to ensure status is up to date
  });
};
