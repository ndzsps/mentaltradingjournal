import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useQuery } from "@tanstack/react-query";

export const EmotionRecovery = () => {
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
  
  const data = [
    { days: "< 1 day", frequency: 40 },
    { days: "1-2 days", frequency: 30 },
    { days: "2-3 days", frequency: 20 },
    { days: "> 3 days", frequency: 10 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3 animate-in fade-in-0 zoom-in-95">
          <p className="font-medium text-sm text-foreground mb-2">{label}</p>
          <div className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: payload[0].color }}
            />
            <span className="text-muted-foreground">Frequency:</span>
            <span className="font-medium text-foreground">{payload[0].value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Emotion Recovery Time</h3>
        <p className="text-sm text-muted-foreground">
          Time taken to recover emotionally after losing trades
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="days" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="frequency" fill="#6E59A5" name="Frequency" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          <p>It takes an average of 2 days for you to regain emotional balance after a loss. Avoid trading immediately after significant losses.</p>
          <p>Faster recovery times (under 1 day) correlate with a 25% higher win rate.</p>
        </div>
      </div>
    </Card>
  );
};
