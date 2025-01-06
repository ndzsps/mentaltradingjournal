import { Card } from "@/components/ui/card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

export const RiskRewardAnalysis = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: generateAnalytics,
  });
  
  if (isLoading || !analytics) {
    return (
      <Card className="p-4 md:p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-accent/10 rounded w-3/4"></div>
          <div className="h-[250px] md:h-[300px] bg-accent/10 rounded"></div>
        </div>
      </Card>
    );
  }

  const requirements = analytics.dataRequirements.riskRewardAnalysis;
  
  if (!requirements.hasEnoughData) {
    return (
      <Card className="p-4 md:p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-bold">Risk/Reward Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Visualization of risk vs reward ratios in your trades
          </p>
        </div>

        <div className="h-[250px] md:h-[300px] w-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Not enough data available</p>
              <p className="text-sm text-muted-foreground max-w-[240px]">
                {requirements.description}
              </p>
              <p className="text-xs text-muted-foreground">
                Required fields: {requirements.requiredFields.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  
  const data = Array.from({ length: 20 }, () => ({
    risk: Math.random() * 500,
    reward: Math.random() * 1000,
    size: Math.random() * 100,
  }));

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Risk/Reward Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Visualization of risk vs reward ratios in your trades
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="risk" 
              name="Risk ($)" 
              unit="$"
              tick={{ fontSize: 12 }} 
            />
            <YAxis 
              dataKey="reward" 
              name="Reward ($)" 
              unit="$"
              tick={{ fontSize: 12 }} 
            />
            <ZAxis dataKey="size" range={[50, 400]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Trades" data={data} fill="#6E59A5" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <p className="text-xs md:text-sm text-muted-foreground">
          Your most profitable trades maintain a risk-reward ratio of at least 1:2. Consider focusing on setups with similar ratios.
        </p>
      </div>
    </Card>
  );
};