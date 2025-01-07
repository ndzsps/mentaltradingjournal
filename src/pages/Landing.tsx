import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Brain, Target } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
              Master Your Trading Psychology
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              Transform your trading journey with TradingMind. Track your emotions, analyze your decisions, and develop a winning mindset through data-driven insights.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="group"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why Choose TradingMind?
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {/* Emotion Tracking */}
            <div className="flex flex-col items-center gap-4 animate-fade-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Emotion Tracking</h3>
              <p className="text-center text-muted-foreground">
                Log and monitor your emotional states during trading sessions to identify patterns and improve decision-making.
              </p>
            </div>

            {/* Performance Analytics */}
            <div className="flex flex-col items-center gap-4 animate-fade-in [animation-delay:200ms]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                <BarChart2 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Performance Analytics</h3>
              <p className="text-center text-muted-foreground">
                Gain deep insights into your trading performance with comprehensive analytics and visualization tools.
              </p>
            </div>

            {/* Goal Setting */}
            <div className="flex flex-col items-center gap-4 animate-fade-in [animation-delay:400ms]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <Target className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Goal Setting</h3>
              <p className="text-center text-muted-foreground">
                Set and track your trading goals while maintaining accountability through our progress tracking system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;