import { Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingPlan } from "./types";

interface PricingCardProps {
  plan: PricingPlan;
  billingInterval: string;
  onSelectPlan: (plan: PricingPlan) => void;
}

export const PricingCard = ({ plan, billingInterval, onSelectPlan }: PricingCardProps) => {
  const calculatePrice = (price: number) => {
    if (billingInterval === "annually") {
      return (price * 12) * 0.75;
    }
    return price;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="relative flex flex-col border border-primary/20 hover:border-primary/50 transition-all duration-300 backdrop-blur-sm bg-card/95 hover:shadow-xl hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-lg" />
      <CardHeader className="text-center pb-8 relative">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          {plan.name}
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
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
          onClick={() => onSelectPlan(plan)}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
};