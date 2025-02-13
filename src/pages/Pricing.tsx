
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createCheckoutSession } from "@/lib/stripe";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/AppHeader";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubscribe = async (priceId: string) => {
    try {
      if (!user) {
        // Include the current path as the return URL
        navigate(`/login?returnTo=${encodeURIComponent('/pricing')}`);
        return;
      }
      await createCheckoutSession(priceId);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to start checkout process. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative bg-[#1A1F2C] overflow-hidden">
      {/* Background effects - matching Landing page style */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[#1A1F2C]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-30" />
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-0 -right-40 w-80 h-80 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
        <div className="absolute inset-0 backdrop-blur-[100px]" />
      </div>

      {/* Use AppHeader instead of custom header */}
      <AppHeader />

      {/* Pricing Content */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the plan that's right for you and start improving your trading journey today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Monthly Plan */}
            <div className="relative p-8 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Monthly Plan</h3>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">$9</span>
                  <span className="text-gray-300 text-sm">/month</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6">Get all the exclusive benefits of a yearly plan—without any long-term commitment or hidden fees</p>
              <ul className="space-y-4 mb-8">
                {[
                  "Live Trading Journal",
                  "Backtesting Journal",
                  "Detailed Emotion Analysis",
                  "Unlimited Trades",
                  "Psychological Pattern Diagnosis",
                  "MFE / MAE",
                  "AI-Powered Analytics",
                  "Best Price In the Market (By Far)",
                ].map((feature) => (
                  <li key={feature} className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-white/10 hover:bg-white/20 text-white"
                onClick={() => handleSubscribe("price_1Qs2QGI2A6O6E8LHv6mgd8nT")}
              >
                Get Started
              </Button>
            </div>

            {/* Yearly Plan */}
            <div className="relative p-8 rounded-xl backdrop-blur-sm bg-primary/10 border border-primary/20">
              <div className="absolute -top-4 right-4 bg-primary/20 text-primary-light px-4 py-1 rounded-full text-sm">
                Save 20%
              </div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Yearly Plan</h3>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">$90</span>
                  <span className="text-gray-300 text-sm">/year</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6">The premiere trading journal that focuses on essential features and eliminates the rest</p>
              <ul className="space-y-4 mb-8">
                {[
                  "Live Trading Journal",
                  "Backtesting Journal",
                  "Detailed Emotion Analysis",
                  "Unlimited Trades",
                  "Psychological Pattern Diagnosis",
                  "MFE / MAE",
                  "AI-Powered Analytics",
                  "Best Price In the Market (By Far)",
                ].map((feature) => (
                  <li key={feature} className="flex items-center text-gray-300">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => handleSubscribe("price_1Qs2QaI2A6O6E8LH8YdwlxiE")}
              >
                Get Yearly Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
