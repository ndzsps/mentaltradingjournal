import React from "react";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Scale } from "lucide-react";
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center hero-gradient">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                Master your
                <br />
                trading psychology.
              </h1>
              
              <div className="flex flex-wrap gap-3">
                {tradingModes.map((mode, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white backdrop-blur-sm"
                  >
                    {mode.icon}
                    <span className="text-sm font-semibold">{mode.label}</span>
                  </div>
                ))}
              </div>

              <p className="text-xl text-gray-300 max-w-2xl">
                The only trading journal that adapts to your emotional state, helping you make better decisions and maintain discipline.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-base px-8 bg-primary hover:bg-primary-light"
                  onClick={() => navigate("/login")}
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-base px-8 text-white border-white/20 bg-white/10 hover:bg-white/20"
                  onClick={() => navigate("/login")}
                >
                  View Demo
                </Button>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-4">FEATURED IN</p>
                <div className="flex flex-wrap gap-8 items-center opacity-50">
                  <span className="font-semibold text-white">TradingView</span>
                  <span className="font-semibold text-white">Bloomberg</span>
                  <span className="font-semibold text-white">Reuters</span>
                  <span className="font-semibold text-white">Financial Times</span>
                </div>
              </div>
            </div>

            {/* Animated Figure */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
              <div className="relative animated-figure glow">
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M200 350C282.843 350 350 282.843 350 200C350 117.157 282.843 50 200 50C117.157 50 50 117.157 50 200C50 282.843 117.157 350 200 350Z"
                    fill="url(#grad1)"
                  />
                  <defs>
                    <linearGradient id="grad1" x1="50" y1="50" x2="350" y2="350" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#6E59A5" />
                      <stop offset="100%" stopColor="#FEC6A1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnalyticsSection />
      <CommunitySection />
    </div>
  );
};

export default Landing;