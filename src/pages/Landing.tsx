import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnalyticsSection } from "@/components/landing/AnalyticsSection";
import { CommunitySection } from "@/components/landing/CommunitySection";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Master Your Trading Psychology
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track, analyze, and improve your trading decisions with our advanced
            emotional intelligence platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/login")} size="lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
              View Demo
            </Button>
          </div>
        </div>
      </section>

      <AnalyticsSection />
      <CommunitySection />
    </div>
  );
};

export default Landing;