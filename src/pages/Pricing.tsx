import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Json } from "@/integrations/supabase/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface RawPricingPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string;
  features: Json[];
  is_active: boolean | null;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: { feature: string }[];
}

const transformPricingPlan = (raw: RawPricingPlan): PricingPlan => {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description || "",
    price: raw.price,
    currency: raw.currency,
    interval: raw.interval,
    features: raw.features.map(f => {
      if (typeof f === 'object' && f !== null && 'feature' in f) {
        return { feature: String(f.feature) };
      }
      return { feature: String(f) };
    })
  };
};

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

  const calculatePrice = (price: number) => {
    if (billingInterval === "annually") {
      const annualPrice = (price * 12) * 0.75;
      return annualPrice;
    }
    return price;
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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
          
          <div className="flex flex-col items-center gap-4 mt-8">
            <ToggleGroup
              type="single"
              value={billingInterval}
              onValueChange={(value) => value && setBillingInterval(value)}
              className="inline-flex bg-muted/50 backdrop-blur-sm rounded-full p-1.5 shadow-lg"
            >
              <ToggleGroupItem
                value="annually"
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                  billingInterval === "annually" 
                    ? "bg-primary text-white shadow-md" 
                    : "hover:bg-muted"
                }`}
              >
                Billed annually
              </ToggleGroupItem>
              <ToggleGroupItem
                value="monthly"
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                  billingInterval === "monthly" 
                    ? "bg-primary text-white shadow-md" 
                    : "hover:bg-muted"
                }`}
              >
                Billed monthly
              </ToggleGroupItem>
            </ToggleGroup>
            
            {billingInterval === "annually" && (
              <p className="text-sm text-primary animate-fade-in">
                Save 25% with annual billing 🎉
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
          {plans?.map((plan) => (
            <Card 
              key={plan.id}
              className="relative flex flex-col border-2 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm bg-card/95 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-lg" />
              <CardHeader className="text-center pb-8 relative">
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-6 relative">
                <div className="text-center">
                  <span className="text-4xl font-bold">
                    {formatPrice(calculatePrice(plan.price))}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    /{billingInterval === "annually" ? "year" : "month"}
                  </span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm">{feature.feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-6 relative">
                <Button 
                  className="w-full bg-gradient-to-r from-primary via-primary-light to-accent hover:opacity-90 transition-opacity"
                  onClick={() => handleSelectPlan(plan)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;