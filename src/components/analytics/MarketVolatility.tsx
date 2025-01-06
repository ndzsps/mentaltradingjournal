import { Card } from "@/components/ui/card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";

export const MarketVolatility = () => {
  const analytics = generateAnalytics([]);
  
  const data = Array.from({ length: 20 }, () => ({
    volatility: Math.random() * 100,
    performance: Math.random() * 100 - 50,
    emotional: Math.random() > 0.5 ? "Calm" : "Anxious",
  }));

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Market Volatility vs. Emotional Response</h3>
        <p className="text-sm text-muted-foreground">
          Analyze trading performance against market volatility and emotional states
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="volatility" 
              name="Volatility" 
              unit="%" 
              tick={{ fontSize: 12 }} 
            />
            <YAxis 
              dataKey="performance" 
              name="Performance" 
              unit="%" 
              tick={{ fontSize: 12 }} 
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter 
              name="Trading Results" 
              data={data} 
              fill="#6E59A5" 
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          <p>You tend to feel anxious during high-volatility markets, leading to a 50% increase in losses. Consider trading less during these periods.</p>
          <p>Calm emotional states in low-volatility markets yielded a 90% win rate.</p>
        </div>
      </div>
    </Card>
  );
};