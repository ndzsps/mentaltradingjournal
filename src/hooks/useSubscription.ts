
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

      console.log('Checking subscription status with token...');
      const { data, error } = await supabase.functions.invoke(
        'check-subscription',
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          }
        }
      );
      
      if (error) {
        console.error('Error checking subscription:', error);
        throw error;
      }
      
      console.log('Subscription check result:', data);
      return data;
    },
    enabled: !!session?.access_token,
    retry: false,
    refetchInterval: 30000, // Refetch every 30 seconds to ensure status is up to date
  });
};
