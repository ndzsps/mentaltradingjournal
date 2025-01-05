import { AppLayout } from "@/components/layout/AppLayout";
import { EmotionLogger } from "@/components/journal/EmotionLogger";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Scatter } from 'recharts';

// Sample data - in a real app this would come from your database
const behaviorData = [
  { date: '2024-01-01', emotion: 3, pnl: 250, outcome: "win" },
  { date: '2024-01-02', emotion: 4, pnl: 450, outcome: "win" },
  { date: '2024-01-03', emotion: 2, pnl: -300, outcome: "loss" },
  { date: '2024-01-04', emotion: 5, pnl: 600, outcome: "win" },
  { date: '2024-01-05', emotion: 1, pnl: -200, outcome: "loss" },
  { date: '2024-01-06', emotion: 3, pnl: 0, outcome: "no_trades" },
  { date: '2024-01-07', emotion: 4, pnl: 350, outcome: "win" },
];

const Index = () => {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 px-4">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your trading journey and improve your mindset
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <EmotionLogger />
          
          <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent mb-6">
              Your Progress
            </h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Daily Streak</span>
                  <span className="text-primary-light">3 days</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary-light rounded-full" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Level Progress</span>
                  <span className="text-accent">Level 2</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-accent/70 to-accent rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Behavior Pattern Graph Section */}
        <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent mb-6">
            Trading Performance & Emotional States
          </h2>
          <div className="h-[400px] w-full">
            <ChartContainer
              className="h-full"
              config={{
                pnl: {
                  label: "Profit/Loss ($)",
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
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/20" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    className="text-muted-foreground text-xs"
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    className="text-muted-foreground text-xs"
                    tickFormatter={(value) => `$${value}`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 5]}
                    className="text-muted-foreground text-xs"
                    tickFormatter={(value) => {
                      const emotions = ["Very Bad", "Bad", "Neutral", "Good", "Excellent"];
                      return emotions[value - 1] || value;
                    }}
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
                              return `$${value}`;
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
                    dot={{ fill: "var(--color-pnl)" }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="emotion"
                    stroke="var(--color-emotion)"
                    strokeWidth={2}
                    dot={{ 
                      fill: "var(--color-emotion)",
                      r: 6
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="space-y-2 mt-4">
            <p className="text-sm text-muted-foreground">
              This graph shows the relationship between your trading performance (blue line) and emotional states (orange line) over time.
            </p>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
              <li>Left axis shows your daily profit/loss in dollars</li>
              <li>Right axis indicates your emotional state from "Very Bad" to "Excellent"</li>
              <li>Larger dots represent emotional measurements to emphasize your psychological state</li>
            </ul>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
