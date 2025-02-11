
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BarChart2, 
  BookOpen, 
  Brain, 
  Calendar, 
  LineChart, 
  NotebookPen, 
  TestTube2,
  Check,
  ArrowRight
} from "lucide-react";

const Features = () => {
  const mainFeature = {
    icon: BookOpen,
    title: "Focus on what matters through powerful journaling",
    description: "Stay on top of your trading performance with your journal. Store your data, stay on top of goals, track important KPI's, and more",
    capabilities: [
      "Analytics dashboard",
      "Advanced filtering",
      "Calendar view",
      "Profitability charts",
      "Notes & comments",
      "Winning percentage"
    ]
  };

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
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-4">Everything In One Location</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All the tools you need to become a better trader, in one place.
          </p>
        </div>

        {/* Main Feature Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          <div className="space-y-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <mainFeature.icon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-4xl font-bold leading-tight">{mainFeature.title}</h2>
            <p className="text-lg text-muted-foreground">{mainFeature.description}</p>
            <div className="grid grid-cols-2 gap-4">
              {mainFeature.capabilities.map((capability, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0 rounded-full p-1 bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{capability}</span>
                </div>
              ))}
            </div>
            <Button className="group" size="lg" asChild>
              <Link to="/login">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl" />
            <img 
              src="/lovable-uploads/b7da4002-109f-4b79-8909-573772402ba0.png" 
              alt="Dashboard Preview" 
              className="relative rounded-3xl shadow-xl w-full"
            />
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button asChild size="lg">
            <Link to="/login">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Features;
