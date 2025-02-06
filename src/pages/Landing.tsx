import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnalyticsSection } from "@/components/landing/AnalyticsSection";
import { CommunitySection } from "@/components/landing/CommunitySection";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">Mental</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/features">Features</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Master Your Trading Psychology
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track, analyze, and improve your trading performance with our comprehensive journaling and analytics platform.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      <AnalyticsSection />
      <CommunitySection />
    </div>
  );
};

export default Landing;