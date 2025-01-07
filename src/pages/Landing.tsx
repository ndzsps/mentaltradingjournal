import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  BarChart2, 
  Brain, 
  Target,
  TrendingUp,
  Clock,
  LineChart,
  PieChart,
  Activity,
  Gauge
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Landing = () => {
  const navigate = useNavigate();

  const analyticsTools = [
    {
      title: "Emotional Intelligence",
      description: "Track emotional patterns and their impact on trading decisions",
      icon: Brain,
      features: ["Mood tracking", "Performance correlation", "Behavioral insights"],
      gradient: "from-violet-500/20 to-purple-500/20"
    },
    {
      title: "Performance Analytics",
      description: "Comprehensive analysis of your trading performance",
      icon: BarChart2,
      features: ["Win/loss ratios", "Profit analysis", "Risk assessment"],
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Trade Duration",
      description: "Analyze optimal holding periods and timing patterns",
      icon: Clock,
      features: ["Time analysis", "Peak performance hours", "Pattern recognition"],
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      title: "Asset Performance",
      description: "Track performance across different trading pairs",
      icon: LineChart,
      features: ["Pair analysis", "Success rates", "Market correlation"],
      gradient: "from-orange-500/20 to-amber-500/20"
    },
    {
      title: "Risk Management",
      description: "Monitor and optimize your risk management strategies",
      icon: Gauge,
      features: ["Risk metrics", "Position sizing", "Exposure analysis"],
      gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
      title: "Pattern Recognition",
      description: "Identify successful trading patterns and behaviors",
      icon: Activity,
      features: ["Behavior analysis", "Success patterns", "Strategy validation"],
      gradient: "from-indigo-500/20 to-blue-500/20"
    }
  ];

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

      {/* Data-Driven Reports Section */}
      <section className="container mx-auto px-4 py-16 bg-accent/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Analytics Suite
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive set of analytical tools helps you understand your trading behavior
            and improve your decision-making process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsTools.map((tool, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg border-none bg-gradient-to-br ${tool.gradient}`}
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
            Explore Analytics
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;