import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AnalyticsSection } from "@/components/landing/AnalyticsSection";
import { CommunitySection } from "@/components/landing/CommunitySection";
import { User, ArrowRightCircle, LineChart, Brain, TrendingUp, BarChart2, PieChart, Activity } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  // Header
  <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Mental
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate("/login")}
        >
          <User className="h-4 w-4" />
          Sign In
        </Button>
        <Button
          className="flex items-center gap-2"
          onClick={() => navigate("/login")}
        >
          <span>Get Started</span>
          <ArrowRightCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </header>

  // Hero Section
  <section className="relative pt-40 min-h-[90vh] flex items-center">
    <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-12">
      {/* Left Content */}
      <div className="flex-1 space-y-8 md:pr-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Trading Psychology
          <br />
          <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            Mastered
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
          Elevate your trading performance with data-driven insights and emotional intelligence tools designed for success.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 backdrop-blur-lg shadow-lg shadow-primary/20"
            onClick={() => navigate("/login")}
          >
            Sign up with email
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 border-gray-700 hover:bg-gray-800/50 backdrop-blur-lg"
            onClick={() => navigate("/login")}
          >
            Try Demo
          </Button>
        </div>
        
        {/* Featured Section */}
        <div className="pt-12">
          <p className="text-sm uppercase tracking-wider text-gray-400 mb-4">
            Featured in
          </p>
          <div className="flex flex-wrap gap-8 items-center opacity-60">
            <img src="/placeholder.svg" alt="Featured Logo 1" className="h-6 grayscale" />
            <img src="/placeholder.svg" alt="Featured Logo 2" className="h-6 grayscale" />
            <img src="/placeholder.svg" alt="Featured Logo 3" className="h-6 grayscale" />
          </div>
        </div>
      </div>

      {/* Right Content - App Preview */}
      <div className="flex-1 relative w-full max-w-2xl">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 backdrop-blur-2xl" />
          <img
            src="/lovable-uploads/13d2dda7-1923-4c1f-9a2d-bde3724fd8bb.png"
            alt="App Preview"
            className="w-full h-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        {/* Enhanced glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-accent/30 blur-3xl -z-10" />
      </div>
    </div>
  </section>

  {/* Add Analytics Preview Section right after the hero section */}
  <section className="relative py-24 bg-gradient-to-b from-background via-accent/5 to-background overflow-hidden">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Comprehensive Trading Analytics
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Make data-driven decisions with our powerful analytics suite
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Analytics Preview Cards */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg blur-xl transition-all duration-500 group-hover:scale-110" />
          <div className="relative p-6 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 h-full">
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Performance Tracking</h3>
            <p className="text-muted-foreground">
              Track your equity curve, win rates, and profit/loss distribution over time
            </p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg blur-xl transition-all duration-500 group-hover:scale-110" />
          <div className="relative p-6 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 h-full">
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Emotional Intelligence</h3>
            <p className="text-muted-foreground">
              Analyze how your emotions impact trading decisions and performance
            </p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg blur-xl transition-all duration-500 group-hover:scale-110" />
          <div className="relative p-6 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 h-full">
            <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Risk Management</h3>
            <p className="text-muted-foreground">
              Monitor risk/reward ratios and position sizing effectiveness
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard Preview */}
      <div className="mt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg blur-3xl" />
        <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BarChart2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Trading Analytics Dashboard</h3>
            </div>
            <div className="flex gap-2">
              <PieChart className="h-5 w-5 text-muted-foreground" />
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="p-6">
            <img
              src="/lovable-uploads/13d2dda7-1923-4c1f-9a2d-bde3724fd8bb.png"
              alt="Analytics Dashboard Preview"
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button
          onClick={() => navigate("/login")}
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          Start Analyzing Your Trades
          <ArrowRightCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  </section>

  {/* Remaining sections */}
  <AnalyticsSection />
  <CommunitySection />
};

export default Landing;
