import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="text-[#10B981]">Overview</span>{" "}
            <span className="text-foreground">Reports</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            View recent performance at a glance, including daily and cumulative P&L, volume, and win %, to identify recent trends. And drill down into results by year, month, and day.
          </p>
          <div className="pt-4">
            <Link to="/register">
              <Button 
                variant="outline" 
                className="px-8 py-2 text-lg rounded-full border-2 hover:bg-accent/5"
              >
                See Reports
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <img 
            src="/lovable-uploads/b2b8599e-bcad-46cc-8d7b-ade2aa6b06ee.png" 
            alt="Trading Dashboard Preview" 
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Detailed Reports Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">
              <span className="text-[#10B981]">Detailed</span>{" "}
              <span className="text-foreground">Reports</span><br />
              <span className="text-foreground">and Statistics</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Are you frustrated with losing valuable insights from your past trades? Say goodbye to the hassle of scattered screenshots and incomplete data. Import your trades in seconds and receive auto-generated charts for all of them. Don't miss out on the stock chart patterns and trends hidden in your trading history. Discover them to optimize your strategies and trade with greater confidence.
            </p>
            <div className="pt-4">
              <Link to="/register">
                <Button 
                  variant="outline" 
                  className="px-8 py-2 text-lg rounded-full border-2 hover:bg-accent/5"
                >
                  See Reports
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Stats</h3>
              <span className="text-muted-foreground">30 days</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Total Gain/Loss", value: "$123,987.12" },
                { label: "Average Daily Gain/Loss", value: "$123,987.12" },
                { label: "Average Hold Time (winning trades)", value: "$123,987.12" },
                { label: "Average Hold Time (losing trades)", value: "$123,987.12" },
                { label: "Max Consecutive Losses", value: "$123,987.12" },
                { label: "Average Losing Trade", value: "$123,987.12" },
                { label: "Profit Factor", value: "$123,987.12" },
                { label: "Number of Winning Trades", value: "$123,987.12" }
              ].map((stat, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;