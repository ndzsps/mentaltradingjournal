import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AnalyticsSection } from "@/components/landing/AnalyticsSection";
import { CommunitySection } from "@/components/landing/CommunitySection";
import { User, ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1F2C]/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 h-16">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Mental</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/5"
                asChild
              >
                <Link to="/features">Features</Link>
              </Button>
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/5"
                asChild
              >
                <Link to="/pricing">Pricing</Link>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/5"
                onClick={() => navigate("/login")}
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
              <Button
                className="flex items-center gap-2"
                onClick={() => navigate("/login")}
              >
                <span>Get Started</span>
                <ArrowRightCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AnalyticsSection />
      <CommunitySection />
    </div>
  );
};

export default Landing;
