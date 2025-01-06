import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";

export const WinLossRatio = () => {
  const analytics = generateAnalytics([]);
  
  const data = [
    { name: "Winning Trades", value: 65 },
    { name: "Losing Trades", value: 35 },
  ];

  const COLORS = ['#6E59A5', '#FEC6A1'];

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Win/Loss Ratio</h3>
        <p className="text-sm text-muted-foreground">
          Distribution of winning vs losing trades
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <p className="text-xs md:text-sm text-muted-foreground">
          Your current win rate is 65%, which is above the recommended minimum of 50% for consistent profitability.
        </p>
      </div>
    </Card>
  );
};