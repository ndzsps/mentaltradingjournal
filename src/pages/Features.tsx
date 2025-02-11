
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BarChart2, 
  BookOpen, 
  Calendar, 
  LineChart,
  NotebookPen,
  CheckCircle2
} from "lucide-react";

const Features = () => {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold">
              Everything In One Location
            </h1>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Focus on what matters through powerful journaling
              </h2>
              <p className="text-lg text-muted-foreground">
                Stay on top of your trading performance with your journal. Store your data, stay on top of goals, track important KPI's, and more
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureItem icon={BarChart2} text="Analytics dashboard" />
                <FeatureItem icon={Calendar} text="Calendar view" />
                <FeatureItem icon={NotebookPen} text="Notes & comments" />
                <FeatureItem icon={LineChart} text="Profitability charts" />
                <FeatureItem icon={BookOpen} text="Advanced filtering" />
                <FeatureItem icon={CheckCircle2} text="Winning percentage" />
              </div>
              <Button size="lg" className="mt-6" asChild>
                <Link to="/login">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Dashboard Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl -z-10" />
            <img 
              src="/lovable-uploads/e9c68a6a-c499-475b-9518-7ba15509fc57.png"
              alt="Dashboard Preview"
              className="rounded-xl shadow-2xl border border-border/50 bg-background"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center gap-2 bg-accent/10 rounded-lg p-3 hover:bg-accent/20 transition-colors">
    <Icon className="h-5 w-5 text-primary" />
    <span className="text-sm font-medium">{text}</span>
  </div>
);

export default Features;
