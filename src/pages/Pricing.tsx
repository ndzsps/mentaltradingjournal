import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PricingPlan = Database['public']['Tables']['pricing_plans']['Row'];

const Pricing = () => {
  const navigate = useNavigate();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['pricing-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/5 to-secondary-light/5">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-muted-foreground text-lg">
            Select the perfect plan for your trading journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans?.map((plan: PricingPlan) => (
            <Card key={plan.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: plan.currency,
                      minimumFractionDigits: 0,
                    }).format(plan.price)}
                  </span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {plan.features?.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-primary flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2">{feature.description}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;