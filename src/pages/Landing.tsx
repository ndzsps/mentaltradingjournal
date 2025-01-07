import React from "react";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Scale, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnalyticsSection } from "@/components/landing/AnalyticsSection";
import { CommunitySection } from "@/components/landing/CommunitySection";

const Landing = () => {
  const navigate = useNavigate();

  const tradingModes = [
    {
      icon: <Brain className="w-5 h-5" />,
      label: "EMOTIONAL MASTERY",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "DISCIPLINE FOCUS",
    },
    {
      icon: <Scale className="w-5 h-5" />,
      label: "RISK MANAGEMENT",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Trading psychology
              <br />
              for every decision.
            </h1>
            
            <div className="flex flex-wrap gap-3">
              {tradingModes.map((mode, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary"
                >
                  {mode.icon}
                  <span className="text-sm font-semibold">{mode.label}</span>
                </div>
              ))}
            </div>

            <p className="text-xl text-muted-foreground max-w-2xl">
              The only trading journal that adapts to your emotional state, helping you make better decisions and maintain discipline.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-base px-8"
                onClick={() => navigate("/login")}
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-base px-8"
                onClick={() => navigate("/login")}
              >
                View Demo
              </Button>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-4">FEATURED IN</p>
              <div className="flex flex-wrap gap-8 items-center opacity-50">
                <span className="font-semibold">TradingView</span>
                <span className="font-semibold">Bloomberg</span>
                <span className="font-semibold">Reuters</span>
                <span className="font-semibold">Financial Times</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50"></div>
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
              alt="Trading Dashboard"
              className="relative rounded-lg shadow-2xl animate-fade-in group-hover:scale-[1.02] transition-transform duration-500 w-full object-cover aspect-[4/3]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-lg opacity-60"></div>
          </div>
        </div>
      </section>

      <AnalyticsSection />
      <CommunitySection />
    </div>
  );
};

export default Landing;