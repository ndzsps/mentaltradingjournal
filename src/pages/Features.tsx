import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BarChart2, 
  BookOpen, 
  Brain, 
  Calendar, 
  LineChart, 
  NotebookPen, 
  TestTube2 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Journal Entries",
      description: "Track your daily trading activities and emotions with detailed journal entries.",
    },
    {
      icon: BarChart2,
      title: "Analytics Dashboard",
      description: "Visualize your trading performance with comprehensive analytics and insights.",
    },
    {
      icon: Brain,
      title: "Emotional Analysis",
      description: "Understand how emotions impact your trading decisions and outcomes.",
    },
    {
      icon: TestTube2,
      title: "Backtesting",
      description: "Test and validate your trading strategies with historical data.",
    },
    {
      icon: NotebookPen,
      title: "Trading Notebook",
      description: "Keep organized notes about your trading strategies and insights.",
    },
    {
      icon: LineChart,
      title: "Performance Tracking",
      description: "Monitor your progress and growth as a trader over time.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            Mental
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Features</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover all the powerful tools and features designed to help you become a better trader.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border bg-card text-card-foreground hover:shadow-lg transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Features;