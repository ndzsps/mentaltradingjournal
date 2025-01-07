import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AnalyticsSection } from "@/components/landing/AnalyticsSection";
import { CommunitySection } from "@/components/landing/CommunitySection";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-background overflow-hidden">
      {/* Gradient Background with enhanced blur and depth */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 backdrop-blur-2xl" />
      <div className="fixed inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center">
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

        <AnalyticsSection />
        <CommunitySection />
      </div>
    </div>
  );
};

export default Landing;