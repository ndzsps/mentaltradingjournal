
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  return useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      console.log('Checking subscription status...');
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        console.error('Error checking subscription:', error);
        throw error;
      }
      console.log('Subscription check result:', data);
      return data;
    },
    retry: false,
    refetchInterval: 30000, // Refetch every 30 seconds to ensure status is up to date
  });
};
