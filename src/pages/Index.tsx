import { AppLayout } from "@/components/layout/AppLayout";
import { EmotionLogger } from "@/components/journal/EmotionLogger";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, ArrowRight } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Sample data - in a real app this would come from your database
const behaviorData = [
  { date: '2024-01-01', emotion: 3, pnl: 2.5, outcome: "win" },
  { date: '2024-01-02', emotion: 4, pnl: 4.5, outcome: "win" },
  { date: '2024-01-03', emotion: 2, pnl: -3.0, outcome: "loss" },
  { date: '2024-01-04', emotion: 5, pnl: 6.0, outcome: "win" },
  { date: '2024-01-05', emotion: 1, pnl: -2.0, outcome: "loss" },
  { date: '2024-01-06', emotion: 3, pnl: 0, outcome: "no_trades" },
  { date: '2024-01-07', emotion: 4, pnl: 3.5, outcome: "win" },
  { date: '2024-01-08', emotion: 5, pnl: -3.0, outcome: "loss" },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">TradingMind</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Log In</span>
              </Link>
            </Button>
            <Button asChild>
              <Link to="/login" className="flex items-center gap-2">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
            Track your trading journey and improve your mindset
          </p>
        </div>

        <EmotionLogger />

        <Card className="p-4 sm:p-6 lg:p-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent mb-4 sm:mb-6">
            Trading Performance & Emotional States
          </h2>
          <div className="h-[300px] sm:h-[350px] lg:h-[400px] w-full">
            <ChartContainer
              className="h-full"
              config={{
                pnl: {
                  label: "Profit/Loss (%)",
                  theme: {
                    light: "#0EA5E9",
                    dark: "#38BDF8"
                  }
                },
                emotion: {
                  label: "Emotional State",
                  theme: {
                    light: "#FEC6A1",
                    dark: "#FFDCC0"
                  }
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={behaviorData} 
                  margin={{ 
                    top: 20, 
                    right: 20, 
                    left: 0, 
                    bottom: 20 
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/20" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    className="text-muted-foreground text-xs sm:text-sm"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    className="text-muted-foreground text-xs sm:text-sm"
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 5]}
                    className="text-muted-foreground text-xs sm:text-sm"
                    tickFormatter={(value) => {
                      const emotions = ["Very Bad", "Bad", "Neutral", "Good", "Excellent"];
                      return emotions[value - 1] || value;
                    }}
                    tick={{ fontSize: 10 }}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <ChartTooltipContent
                          className="bg-background/80 backdrop-blur-sm"
                          payload={payload}
                          formatter={(value, name) => {
                            if (name === "emotion") {
                              const emotions = ["Very Bad", "Bad", "Neutral", "Good", "Excellent"];
                              return emotions[Number(value) - 1] || value;
                            }
                            if (name === "pnl") {
                              return `${value}%`;
                            }
                            return value;
                          }}
                        />
                      );
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="pnl"
                    stroke="var(--color-pnl)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-pnl)", r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="emotion"
                    stroke="var(--color-emotion)"
                    strokeWidth={2}
                    dot={{ 
                      fill: "var(--color-emotion)",
                      r: 4
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="space-y-2 mt-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              This graph shows the relationship between your trading performance (blue line) and emotional states (orange line) over time.
            </p>
            <ul className="text-xs sm:text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Left axis shows your daily profit/loss as a percentage</li>
              <li>Right axis indicates your emotional state from "Very Bad" to "Excellent"</li>
              <li>Larger dots represent emotional measurements to emphasize your psychological state</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;