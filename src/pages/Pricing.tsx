import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PricingCard } from "@/components/pricing/PricingCard";
import { RawPricingPlan, PricingPlan, transformPricingPlan } from "@/components/pricing/types";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [billingInterval, setBillingInterval] = useState<string>("monthly");

  const { data: plans, isLoading, error } = useQuery({
    queryKey: ["pricing-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .order("price");
      
      if (error) throw error;
      return (data as RawPricingPlan[]).map(transformPricingPlan);
    }
  });

  const handleSelectPlan = (plan: PricingPlan) => {
    navigate("/login");
    toast({
      title: "Please sign in first",
      description: "You need to be signed in to subscribe to a plan.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading pricing plans</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      
      <div className="container relative px-4 py-16 md:py-24 mx-auto">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-light to-accent">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you
          </p>
          
          <BillingToggle 
            billingInterval={billingInterval}
            setBillingInterval={setBillingInterval}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans?.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingInterval={billingInterval}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;