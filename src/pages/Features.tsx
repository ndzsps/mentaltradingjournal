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
              Focus on what matters through powerful journaling
            </h2>
            <p className="text-lg text-muted-foreground">
              Stay on top of your trading performance with your journal. Store your data, stay on top of goals, track important KPI's, and more
            </p>
            <div className="grid grid-cols-1 gap-4">
              <FeatureItem icon={BarChart2} text="Advanced analytics dashboard with comprehensive metrics" />
              <FeatureItem icon={NotebookPen} text="Detailed notes & comments for trade analysis" />
              <FeatureItem icon={LineChart} text="In-depth profitability tracking and charts" />
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
            <div className="grid grid-cols-1 gap-4">
              <FeatureItem icon={Target} text="Set and track personalized performance goals" />
              <FeatureItem icon={TrendingUp} text="Monitor key success metrics and trends" />
              <FeatureItem icon={ChartBar} text="Generate customized performance reports" />
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
            <div className="grid grid-cols-1 gap-4">
              <FeatureItem icon={NotebookPen} text="Full-featured rich text editor for detailed notes" />
              <FeatureItem icon={BookOpen} text="Organize entries with custom categories" />
              <FeatureItem icon={LineChart} text="Add chart annotations and technical analysis" />
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
            <div className="grid grid-cols-1 gap-4">
              <FeatureItem icon={Target} text="Set clear, measurable trading objectives" />
              <FeatureItem icon={Medal} text="Track achievements and milestones" />
              <FeatureItem icon={TrendingUp} text="Monitor long-term growth and progress" />
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
            <div className="grid grid-cols-1 gap-4">
              <FeatureItem icon={BookOpen} text="Access comprehensive learning resources" />
              <FeatureItem icon={LineChart} text="Analyze detailed performance trends" />
              <FeatureItem icon={NotebookPen} text="Review and optimize trading strategies" />
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
  <div className="flex items-center gap-3 bg-accent/10 rounded-lg p-4 hover:bg-accent/20 transition-colors">
    <Icon className="h-6 w-6 text-primary flex-shrink-0" />
    <span className="text-base font-medium">{text}</span>
  </div>
);

export default Features;
