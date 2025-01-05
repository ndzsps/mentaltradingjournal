import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const mockData = [
  { name: "Wins (Positive)", value: 60, color: "#6E59A5" },
  { name: "Wins (Neutral)", value: 25, color: "#0EA5E9" },
  { name: "Losses", value: 15, color: "#FEC6A1" },
];

export const PerformanceBreakdown = () => {
  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Performance by Emotion</h3>
        <p className="text-sm text-muted-foreground">
          Breakdown of trading outcomes based on emotional states
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <p className="text-xs md:text-sm text-muted-foreground">
          You win 60% of trades when in a positive emotional state, compared to
          25% in neutral states. Focus on maintaining a positive mindset for
          optimal performance.
        </p>
      </div>
    </Card>
  );
};