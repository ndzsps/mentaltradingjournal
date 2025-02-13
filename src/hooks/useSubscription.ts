
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSubscription = () => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      // Don't make the request if there's no session
      if (!session) {
        return false;
      }

      console.log('Checking subscription status...');
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        throw error;
      }
      
      console.log('Subscription check result:', data);
      return data;
    },
    // Only run the query if we have a session
    enabled: !!session,
    retry: false,
    refetchInterval: 30000, // Refetch every 30 seconds to ensure status is up to date
  });
};
