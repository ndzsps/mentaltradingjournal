import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, Heart, Scale, LineChart, Gauge, Activity } from "lucide-react";
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
      title: "Psychological Pattern Recognition",
      description: "Understand and improve your trading psychology patterns",
      icon: Heart,
      features: [
        "Behavioral pattern analysis",
        "Decision-making insights",
        "Stress response tracking"
      ],
      gradient: "from-secondary/10 via-secondary/5 to-transparent"
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
      title: "Risk Psychology Profile",
      description: "Understand your risk tolerance and decision patterns",
      icon: Gauge,
      features: [
        "Risk behavior analysis",
        "Emotional risk assessment",
        "Decision confidence tracking"
      ],
      gradient: "from-secondary/10 via-secondary/5 to-transparent"
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
    <section className="relative py-24">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background to-background/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-accent/5 to-transparent opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-secondary/10 via-background/80 to-background" />
      </div>
      
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 rounded-lg blur-2xl opacity-75" />
            <h2 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-light via-accent to-primary bg-clip-text text-transparent">
              Trading Psychology Analytics
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your trading mindset with our comprehensive suite of psychological analysis tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsTools.map((tool, index) => (
            <Card 
              key={index} 
              className={`group relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 border-none bg-gradient-to-br ${tool.gradient} backdrop-blur-sm animate-fade-in`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-background/40 to-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/10 group-hover:border-primary/20 transition-colors duration-300">
                    <tool.icon className="h-6 w-6 text-primary group-hover:text-primary-light transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{tool.title}</CardTitle>
                </div>
                <CardDescription className="text-base text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-3">
                  {tool.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex}
                      className="flex items-center space-x-3 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary/70 group-hover:bg-primary transition-colors duration-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="relative inline-block">
            {/* Button Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-lg blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            <Button 
              onClick={() => navigate("/login")} 
              size="lg"
              className="relative bg-primary hover:bg-primary-light text-primary-foreground px-8 py-6 text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
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