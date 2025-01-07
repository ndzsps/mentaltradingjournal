import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AnalyticsSection } from "@/components/landing/AnalyticsSection";
import { CommunitySection } from "@/components/landing/CommunitySection";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-background overflow-hidden">
      {/* Enhanced Gradient Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute inset-0 backdrop-blur-[100px]" />
      </div>
      
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

        {/* Psychology Focus Section */}
        <section className="relative min-h-screen flex items-center py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col-reverse md:flex-row items-center gap-12">
              {/* Left Side - App Preview */}
              <div className="flex-1 relative w-full max-w-2xl">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  <div className="p-6 relative z-10">
                    {/* Mock Trading Journal Interface */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white/90">Emotional State Tracker</h3>
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary-light text-sm">Active</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {['Calm', 'Focused', 'Patient', 'Disciplined'].map((emotion) => (
                          <div key={emotion} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10">
                            <p className="text-white/80">{emotion}</p>
                          </div>
                        ))}
                      </div>
                      <div className="h-32 rounded-lg bg-white/5 border border-white/10 p-4">
                        <div className="w-full h-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Enhanced glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-accent/30 blur-3xl -z-10" />
              </div>

              {/* Right Side - Content */}
              <div className="flex-1 space-y-8 md:pl-8">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  You've been focused on the
                  <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent"> wrong thing </span>
                  all this time.
                </h2>
                <div className="space-y-6">
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                    Our platform helps you trade smarter by focusing on your emotions and decision-making process, not just P&L results. It's designed to seamlessly fit your workflow, keeping you grounded and consistent.
                  </p>
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                    Most trading journals fixate on numbers and results, which can hurt your performance without you realizing it. We shift the focus to mastering your emotions—the key to lasting success.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/10 transition-all duration-300"
                  onClick={() => navigate("/login")}
                >
                  Focus on what matters →
                </Button>
              </div>
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
