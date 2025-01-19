import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center space-y-8">
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-sm uppercase tracking-wider text-primary font-semibold">
            TRADING ANALYSIS
          </h2>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Trading Analysis
          </h1>
          <p className="text-xl text-muted-foreground">
            Trading analysis software built to objectively improve your trading performance. Try it free.
          </p>
          <div className="pt-4">
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full">
                Try Our Trading Analysis Tools For Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-[#10B981]">Overview</span>{" "}
              <span className="text-foreground">Reports</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              View recent performance at a glance, including daily and cumulative P&L, volume, and win %, to identify recent trends. And drill down into results by year, month, and day.
            </p>
          </div>
          <div className="pt-4">
            <Link to="/register">
              <Button 
                variant="outline" 
                className="px-8 py-6 text-lg border-2 hover:bg-accent/5"
              >
                See Reports
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;