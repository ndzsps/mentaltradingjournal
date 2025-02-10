
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, DollarSign } from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();

  const features = [
    {
      name: "Accounts",
      description: "Manage multiple trading accounts in one place",
      monthly: "1",
      yearly: "Unlimited",
    },
    {
      name: "Data Storage",
      description: "Store your trading data securely",
      monthly: "1GB",
      yearly: "Unlimited",
    },
    {
      name: "Trade Imports",
      description: "Import your trading history from various brokers using auto-sync, file upload or manual input",
      monthly: "Limited",
      yearly: "Unlimited",
    },
    {
      name: "Trade Sharing",
      description: "Share trades or analysis with other traders",
      monthly: true,
      yearly: true,
    },
    {
      name: "Commissions & Fees",
      description: "Factor in and analyze commissions and fees paid",
      monthly: true,
      yearly: true,
    },
    {
      name: "Multiple Currency Support",
      description: "Select from various currencies to track your performance",
      monthly: true,
      yearly: true,
    },
    {
      name: "Breakeven Settings",
      description: "Define your breakeven range for a precise analysis",
      monthly: true,
      yearly: true,
    },
  ];

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

      {/* Header - matching Landing page style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/5 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              Mental
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/5"
              onClick={() => navigate("/features")}
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/5"
              onClick={() => navigate("/pricing")}
            >
              Pricing
            </Button>
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/5"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button
              className="bg-primary/20 hover:bg-primary/30 text-primary-light border border-primary/20 backdrop-blur-sm"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

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

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            {/* Monthly Plan */}
            <div className="relative p-8 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Monthly Plan</h3>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">$9</span>
                  <span className="text-gray-300 text-sm">/month</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6">Commitment-free with all the benefits of a yearly plan</p>
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
                onClick={() => navigate("/login")}
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
                  <span className="text-2xl font-bold text-white">$99</span>
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
                onClick={() => navigate("/login")}
              >
                Get Yearly Plan
              </Button>
            </div>
          </div>

          {/* Features Comparison Table */}
          <div className="max-w-5xl mx-auto mt-20">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Compare Features
            </h2>
            <div className="space-y-8">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b border-white/10"
                >
                  <div className="md:col-span-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                  <div className="md:col-span-3 text-center">
                    <div className="text-gray-300">
                      {typeof feature.monthly === "boolean" ? (
                        feature.monthly ? (
                          <Check className="h-6 w-6 mx-auto text-primary" />
                        ) : (
                          "—"
                        )
                      ) : (
                        <span className="text-primary font-medium">
                          {feature.monthly}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-3 text-center">
                    <div className="text-gray-300">
                      {typeof feature.yearly === "boolean" ? (
                        feature.yearly ? (
                          <Check className="h-6 w-6 mx-auto text-primary" />
                        ) : (
                          "—"
                        )
                      ) : (
                        <span className="text-primary-light font-medium">
                          {feature.yearly}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

