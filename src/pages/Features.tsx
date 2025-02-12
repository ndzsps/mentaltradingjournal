
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BarChart2, 
  BookOpen, 
  Calendar, 
  LineChart,
  NotebookPen,
  CheckCircle2,
  Target,
  TrendingUp,
  Medal,
  ChartBar,
  History,
  Timer
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
              <Link to="/features">Features</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
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
      <div className="container mx-auto px-4 py-16">
        {/* Centered Title - Added extra top padding */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 pt-12">
          Everything In One Location
        </h1>

        {/* First Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-8">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Pre-Session Check In
            </h2>
            <div className="border border-border rounded-lg p-4 bg-background/50">
              <p className="text-lg text-muted-foreground">
                Start your trading day on the right foot by checking off pre-trading activities that promote focus
              </p>
            </div>
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

          {/* Right Column - Dashboard Image */}
          <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl lg:-mt-12">
            <img 
              src="/lovable-uploads/e9c68a6a-c499-475b-9518-7ba15509fc57.png"
              alt="Dashboard Preview"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Second Section (Flipped) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-32">
          {/* Left Column - Dashboard Image */}
          <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl lg:-mt-12 order-2 lg:order-1">
            <img 
              src="/lovable-uploads/e9c68a6a-c499-475b-9518-7ba15509fc57.png"
              alt="Analytics Preview"
              className="w-full h-auto"
            />
          </div>

          {/* Right Column - Text Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Track your progress with detailed analytics
            </h2>
            <p className="text-lg text-muted-foreground">
              Get insights into your trading performance with comprehensive analytics. Monitor your progress, identify patterns, and improve your strategy
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureItem icon={Target} text="Performance goals" />
              <FeatureItem icon={TrendingUp} text="Success metrics" />
              <FeatureItem icon={Medal} text="Achievement tracking" />
              <FeatureItem icon={ChartBar} text="Custom reports" />
              <FeatureItem icon={History} text="Historical data" />
              <FeatureItem icon={Timer} text="Time analysis" />
            </div>
            <Button size="lg" className="mt-6" asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Third Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-32">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Stay organized with comprehensive note-taking
            </h2>
            <p className="text-lg text-muted-foreground">
              Keep track of your trading ideas, strategies, and market observations in one place. Tag and categorize your notes for easy reference
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureItem icon={NotebookPen} text="Rich text editor" />
              <FeatureItem icon={BookOpen} text="Custom categories" />
              <FeatureItem icon={Calendar} text="Date organization" />
              <FeatureItem icon={LineChart} text="Chart annotations" />
              <FeatureItem icon={BarChart2} text="Data linking" />
              <FeatureItem icon={CheckCircle2} text="Task tracking" />
            </div>
            <Button size="lg" className="mt-6" asChild>
              <Link to="/login">Learn More</Link>
            </Button>
          </div>

          {/* Right Column - Image */}
          <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl lg:-mt-12">
            <img 
              src="/lovable-uploads/e9c68a6a-c499-475b-9518-7ba15509fc57.png"
              alt="Notes Preview"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Fourth Section (Flipped) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-32">
          {/* Left Column - Image */}
          <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl lg:-mt-12 order-2 lg:order-1">
            <img 
              src="/lovable-uploads/e9c68a6a-c499-475b-9518-7ba15509fc57.png"
              alt="Goals Preview"
              className="w-full h-auto"
            />
          </div>

          {/* Right Column - Text Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Set and achieve your trading goals
            </h2>
            <p className="text-lg text-muted-foreground">
              Define clear objectives and track your progress over time. Break down your goals into manageable steps and celebrate your achievements
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureItem icon={Target} text="Goal setting" />
              <FeatureItem icon={Medal} text="Achievement system" />
              <FeatureItem icon={History} text="Progress tracking" />
              <FeatureItem icon={ChartBar} text="Performance metrics" />
              <FeatureItem icon={Timer} text="Time management" />
              <FeatureItem icon={TrendingUp} text="Growth analytics" />
            </div>
            <Button size="lg" className="mt-6" asChild>
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Fifth Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-32">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold">
              Learn and grow with comprehensive insights
            </h2>
            <p className="text-lg text-muted-foreground">
              Gain valuable insights from your trading history. Identify patterns, learn from mistakes, and continuously improve your trading strategy
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureItem icon={BookOpen} text="Learning library" />
              <FeatureItem icon={BarChart2} text="Performance insights" />
              <FeatureItem icon={LineChart} text="Trend analysis" />
              <FeatureItem icon={NotebookPen} text="Strategy review" />
              <FeatureItem icon={CheckCircle2} text="Success patterns" />
              <FeatureItem icon={Calendar} text="Historical data" />
            </div>
            <Button size="lg" className="mt-6" asChild>
              <Link to="/login">Learn More</Link>
            </Button>
          </div>

          {/* Right Column - Image */}
          <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl lg:-mt-12">
            <img 
              src="/lovable-uploads/e9c68a6a-c499-475b-9518-7ba15509fc57.png"
              alt="Insights Preview"
              className="w-full h-auto"
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
