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

export const MistakeAnalysis = () => {
  const analytics = generateAnalytics([]);
  
  const data = [
    { name: "Revenge Trading", value: 15, loss: 5000 },
    { name: "Moving Stop-Loss", value: 25, loss: 3000 },
    { name: "FOMO Trades", value: 35, loss: 2000 },
    { name: "Over-leveraging", value: 25, loss: 2500 },
  ];

  const COLORS = ['#6E59A5', '#0EA5E9', '#FEC6A1', '#F87171'];

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Mistake Frequency vs. Outcome</h3>
        <p className="text-sm text-muted-foreground">
          Analysis of trading mistakes and their impact
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
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          <p>Revenge trading occurred in 15% of your trades and led to 90% of your total losses.</p>
          <p>Avoiding revenge trading could have saved you $5,000 this month.</p>
        </div>
      </div>
    </Card>
  );
};