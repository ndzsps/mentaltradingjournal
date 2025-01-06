import { Card } from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";

export const PersonalityPatterns = () => {
  const analytics = generateAnalytics([]);
  
  const data = [
    { trait: "Discipline", current: 80, previous: 50 },
    { trait: "Risk Tolerance", current: 60, previous: 70 },
    { trait: "Emotional Resilience", current: 75, previous: 45 },
    { trait: "Patience", current: 85, previous: 65 },
    { trait: "Adaptability", current: 70, previous: 60 },
  ];

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Personality Patterns</h3>
        <p className="text-sm text-muted-foreground">
          Track changes in trading personality traits over time
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="trait" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Current"
              dataKey="current"
              stroke="#6E59A5"
              fill="#6E59A5"
              fillOpacity={0.6}
            />
            <Radar
              name="Previous Month"
              dataKey="previous"
              stroke="#0EA5E9"
              fill="#0EA5E9"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          <p>Your discipline improved by 30% over the last month, leading to 20% more consistent profits.</p>
          <p>Low emotional resilience in stressful situations contributed to 70% of your losses.</p>
        </div>
      </div>
    </Card>
  );
};