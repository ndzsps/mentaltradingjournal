
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSubscription = () => {
  return useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('check_subscription');
      if (error) throw error;
      return data;
    },
    retry: false,
  });
};
