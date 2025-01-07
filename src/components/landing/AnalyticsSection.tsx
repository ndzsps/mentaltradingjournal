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
      gradient: "from-violet-500/20 to-purple-500/20"
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
      gradient: "from-pink-500/20 to-rose-500/20"
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
      gradient: "from-blue-500/20 to-cyan-500/20"
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
      gradient: "from-emerald-500/20 to-teal-500/20"
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
      gradient: "from-orange-500/20 to-amber-500/20"
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
      gradient: "from-indigo-500/20 to-blue-500/20"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16 bg-accent/5">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Trading Psychology Analytics
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transform your trading mindset with our comprehensive suite of psychological analysis tools
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsTools.map((tool, index) => (
          <Card 
            key={index} 
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none bg-gradient-to-br ${tool.gradient} h-full`}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-background/80 backdrop-blur-sm">
                  <tool.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{tool.title}</CardTitle>
              </div>
              <CardDescription className="text-base">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tool.features.map((feature, featureIndex) => (
                  <li 
                    key={featureIndex}
                    className="flex items-center space-x-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button 
          onClick={() => navigate("/login")} 
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          Start Your Psychology Journey
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};