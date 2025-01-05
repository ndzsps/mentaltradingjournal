import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";

// For demo purposes, using mock data
const mockJournalEntries = [
  {
    emotion: "positive",
    emotionDetail: "confident",
    outcome: "win",
    notes: "Great trade!",
    sessionType: "post" as const,
    timestamp: new Date(),
  },
  // Add more mock entries as needed
];

export const PerformanceBreakdown = () => {
  const analytics = generateAnalytics(mockJournalEntries);
  
  const data = [
    { 
      name: "Wins (Positive)", 
      value: analytics.performanceByEmotion.positive, 
      color: "#6E59A5" 
    },
    { 
      name: "Wins (Neutral)", 
      value: analytics.performanceByEmotion.neutral, 
      color: "#0EA5E9" 
    },
    { 
      name: "Losses", 
      value: 100 - analytics.performanceByEmotion.positive - analytics.performanceByEmotion.neutral, 
      color: "#FEC6A1" 
    },
  ];

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
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
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
          {analytics.mainInsight} {analytics.recommendedAction}
        </p>
      </div>
    </Card>
  );
};