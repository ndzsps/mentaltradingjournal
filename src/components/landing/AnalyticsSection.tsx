import React from "react";
import { Button } from "@/components/ui/card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, Heart, Scale, LineChart, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AnalyticsSection = () => {
  const navigate = useNavigate();
  
  const analyticsTools = [
    {
      title: "Emotional Intelligence Mastery",
      description: "Transform emotions from trading obstacles into strategic advantages",
      icon: Brain,
      features: [
        "Identify emotional triggers affecting trades",
        "Track mood-performance correlation",
        "Build emotional resilience"
      ],
      gradient: "from-primary/10 via-primary/5 to-transparent"
    },
    {
      title: "Mental Balance Metrics",
      description: "Maintain psychological equilibrium during market volatility",
      icon: Scale,
      features: [
        "Stress level monitoring",
        "Recovery time analysis",
        "Mindset optimization"
      ],
      gradient: "from-accent/10 via-accent/5 to-transparent"
    },
    {
      title: "Performance Analytics",
      description: "Comprehensive analysis of your trading decisions",
      icon: LineChart,
      features: [
        "Win/loss pattern analysis",
        "Risk management tracking",
        "Performance metrics"
      ],
      gradient: "from-primary/10 via-primary/5 to-transparent"
    },
    {
      title: "Behavioral Pattern Analysis",
      description: "Identify and optimize your trading behavior patterns",
      icon: Activity,
      features: [
        "Trading habit analysis",
        "Psychological biases detection",
        "Behavior optimization tips"
      ],
      gradient: "from-accent/10 via-accent/5 to-transparent"
    }
  ];

  return (
    <section className="relative py-32"> {/* Increased padding from py-24 to py-32 */}
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#1A1F2C]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-accent/5 to-transparent opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center_bottom,_var(--tw-gradient-stops))] from-[#7E69AB]/20 via-background/80 to-transparent" />
        <div className="absolute inset-0 backdrop-blur-[100px]" />
      </div>
      
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-20 space-y-6"> {/* Increased margin-bottom from mb-16 to mb-20 and space-y from 4 to 6 */}
          <div className="relative">
            {/* Enhanced Glow Effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/40 via-[#9b87f5]/30 to-[#7E69AB]/40 rounded-lg blur-3xl opacity-75" />
            <h2 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#9b87f5] via-[#D6BCFA] to-[#7E69AB] bg-clip-text text-transparent pb-2"> {/* Added pb-2 for bottom padding */}
              Trading Psychology Analytics
            </h2>
          </div>
          <p className="text-xl text-gray-300/90 max-w-3xl mx-auto">
            Transform your trading mindset with our comprehensive suite of psychological analysis tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {analyticsTools.map((tool, index) => (
            <Card 
              key={index} 
              className={`group relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 border-none bg-[#1A1F2C]/40 backdrop-blur-xl animate-fade-in`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#7E69AB]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 rounded-xl bg-[#1A1F2C]/60 backdrop-blur-sm border border-white/5 group-hover:border-primary/20 transition-colors duration-300">
                    <tool.icon className="h-6 w-6 text-[#9b87f5] group-hover:text-primary-light transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-200">{tool.title}</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-3">
                  {tool.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex}
                      className="flex items-center space-x-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-[#9b87f5]/70 group-hover:bg-[#9b87f5] transition-colors duration-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="relative inline-block group">
            {/* Enhanced Button Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#9b87f5]/30 via-[#7E69AB]/20 to-[#9b87f5]/30 rounded-lg blur-xl opacity-75 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105" />
            <Button 
              onClick={() => navigate("/login")} 
              size="lg"
              className="relative bg-[#1A1F2C] hover:bg-[#1A1F2C]/80 text-gray-200 px-8 py-6 text-lg border border-white/10 hover:border-primary/20 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
            >
              Start Your Psychology Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
