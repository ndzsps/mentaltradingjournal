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

export const TradeDuration = () => {
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
    { duration: "< 10 min", winRate: 65, volume: 40 },
    { duration: "10-30 min", winRate: 45, volume: 30 },
    { duration: "30-60 min", winRate: 30, volume: 20 },
    { duration: "> 1 hour", winRate: 20, volume: 10 },
  ];

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Trade Duration Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Performance based on how long trades are held
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="duration" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="winRate" fill="#6E59A5" name="Win Rate %" />
            <Bar dataKey="volume" fill="#0EA5E9" name="Volume %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          <p>Your short trades (&lt;10 minutes) have a 65% win rate, while longer trades (&gt;1 hour) lead to 80% losses.</p>
          <p>Reducing trade duration by 20% could improve consistency.</p>
        </div>
      </div>
    </Card>
  );
};