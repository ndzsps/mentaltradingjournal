
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Scale, LineChart, Activity } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      title: "Emotional Mastery",
      description: "Transform emotions from trading obstacles into strategic advantages",
      icon: Brain,
      features: [
        "Identify hidden emotions affecting your trades",
        "Discover your mood-performance correlation",
        "Build emotional resilience"
      ]
    },
    {
      title: "Flow State Tracker",
      description: "Achieve the peak performance state proven in science",
      icon: Scale,
      features: [
        "Monitor stress levels at any given time",
        "Develop a recovery process during drawdown",
        "Set daily rituals that ensure the Flow State"
      ]
    },
    {
      title: "Performance Analytics",
      description: "Gain a true understanding of your trading strategy",
      icon: LineChart,
      features: [
        "Win/loss pattern examination",
        "Discover hidden leaks in your strategy",
        "Double down on your strongest setups"
      ]
    },
    {
      title: "Behavioral Patterns",
      description: "Just as the market has patterns, so do you.",
      icon: Activity,
      features: [
        "Gain clarity on your specific trading habits",
        "Detect psychological bias before you trade",
        "Optimize your self alongside your strategy"
      ]
    }
  ];

  return (
    <section className="relative py-32">
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#9b87f5] via-[#D6BCFA] to-[#7E69AB] bg-clip-text text-transparent pb-4 leading-relaxed">
            Our Features
          </h2>
          <p className="text-xl text-gray-300/90 max-w-3xl mx-auto">
            Evolve your trading mindset with our comprehensive suite of tools
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 border-none bg-[#1A1F2C]/40 backdrop-blur-xl animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#7E69AB]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 rounded-xl bg-[#1A1F2C]/60 backdrop-blur-sm border border-white/5 group-hover:border-primary/20 transition-colors duration-300">
                    <feature.icon className="h-6 w-6 text-[#9b87f5] group-hover:text-primary-light transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-200">
                    {feature.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-3">
                  {feature.features.map((item, featureIndex) => (
                    <li 
                      key={featureIndex}
                      className="flex items-center space-x-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-[#9b87f5]/70 group-hover:bg-[#9b87f5] transition-colors duration-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
