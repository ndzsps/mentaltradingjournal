import { Card } from "@/components/ui/card";
import { 
  BarChart3, 
  Brain, 
  LineChart, 
  Shield, 
  Sparkles,
  Target
} from "lucide-react";

const features = [
  {
    icon: <Brain className="w-10 h-10 text-primary" />,
    title: "Emotional Intelligence",
    description: "Track and analyze your emotional states to make better trading decisions. Understand how your psychology impacts your performance."
  },
  {
    icon: <LineChart className="w-10 h-10 text-secondary" />,
    title: "Performance Analytics",
    description: "Comprehensive analytics dashboard with detailed insights into your trading patterns, win rates, and risk management."
  },
  {
    icon: <Target className="w-10 h-10 text-accent" />,
    title: "Trading Playbooks",
    description: "Create and backtest your trading strategies. Document your setups and rules for consistent execution."
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-primary" />,
    title: "Progress Tracking",
    description: "Monitor your growth with detailed statistics and progress indicators. Level up your trading journey with measurable goals."
  },
  {
    icon: <Shield className="w-10 h-10 text-secondary" />,
    title: "Risk Management",
    description: "Advanced tools to help you maintain discipline and protect your capital. Track your position sizing and exposure."
  },
  {
    icon: <Sparkles className="w-10 h-10 text-accent" />,
    title: "AI-Powered Insights",
    description: "Get personalized recommendations and insights based on your trading history and emotional patterns."
  }
];

export const FeaturesRecap = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-accent/5">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose Our Platform?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your trading journey with powerful tools designed to enhance your performance and emotional intelligence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 backdrop-blur-sm bg-background/50 border-accent/20 hover:border-accent/40 transition-colors"
            >
              <div className="space-y-4">
                <div className="p-2 w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};