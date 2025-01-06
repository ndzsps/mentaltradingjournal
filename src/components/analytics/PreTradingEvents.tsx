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

export const PreTradingEvents = () => {
  const analytics = generateAnalytics([]);
  
  const data = [
    { event: "Financial Discussions", impact: -70 },
    { event: "Meditation", impact: 40 },
    { event: "Exercise", impact: 30 },
    { event: "News Reading", impact: -20 },
    { event: "Planning Session", impact: 50 },
  ].map(item => ({
    ...item,
    fill: item.impact > 0 ? "#6E59A5" : "#FEC6A1"
  }));

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Impact of Pre-Trading Events</h3>
        <p className="text-sm text-muted-foreground">
          How different activities before trading affect performance
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="event" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar 
              dataKey="impact"
              fill="#6E59A5"
              fillOpacity={1}
              stroke="none"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          <p>Conversations about finances before trading resulted in a 70% drop in performance. Consider avoiding such discussions.</p>
          <p>Meditation or positive affirmations before trading increased win rates by 40%.</p>
        </div>
      </div>
    </Card>
  );
};