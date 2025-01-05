import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  { date: "Mon", emotion: "positive", winRate: 65 },
  { date: "Tue", emotion: "neutral", winRate: 55 },
  { date: "Wed", emotion: "negative", winRate: 35 },
  { date: "Thu", emotion: "positive", winRate: 70 },
  { date: "Fri", emotion: "neutral", winRate: 50 },
];

export const EmotionalTendencies = () => {
  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Emotional Impact on Trading</h3>
        <p className="text-muted-foreground">
          Track how your emotions correlate with trading performance
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="winRate"
              stroke="#6E59A5"
              strokeWidth={2}
              dot={{ fill: "#6E59A5" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-4 rounded-lg">
        <h4 className="font-semibold">AI Insight</h4>
        <p className="text-sm text-muted-foreground">
          When feeling pressured, your win rate decreases by 18%. Consider taking a
          break before making trades when feeling stressed.
        </p>
      </div>
    </Card>
  );
};