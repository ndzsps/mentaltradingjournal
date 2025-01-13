import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useQuery } from "@tanstack/react-query";

const formatValue = (value: number) => {
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value;
};

const emotionToScore = (emotion: string): number => {
  switch (emotion.toLowerCase()) {
    case 'positive':
      return 500;
    case 'negative':
      return -500;
    default:
      return 0;
  }
};

const scoreToEmotion = (score: number): string => {
  switch (score) {
    case 500:
      return 'Positive';
    case -500:
      return 'Negative';
    default:
      return 'Neutral';
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 animate-in fade-in-0 zoom-in-95">
        <p className="font-medium text-sm text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.name}:
            </span>
            <span className="font-medium text-foreground">
              {entry.name === "Emotional State" 
                ? scoreToEmotion(entry.value)
                : `$${formatValue(entry.value)}`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const EmotionTrend = () => {
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

  // Transform the emotional scores
  const data = analytics.emotionTrend.map(item => ({
    ...item,
    emotionalScore: emotionToScore(item.emotion || 'neutral'),
  }));

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Emotion Trend Over Time</h3>
        <p className="text-sm text-muted-foreground">
          Track emotional states and trading results over time
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              tickLine={{ stroke: 'currentColor' }}
            />
            <YAxis 
              yAxisId="emotion"
              domain={[-500, 500]}
              ticks={[-500, 0, 500]}
              tickFormatter={(value) => scoreToEmotion(value)}
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              tickLine={{ stroke: 'currentColor' }}
              label={{ 
                value: 'Emotional State', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '12px' }
              }}
            />
            <YAxis
              yAxisId="pnl"
              orientation="right"
              tickFormatter={formatValue}
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              tickLine={{ stroke: 'currentColor' }}
              label={{ 
                value: 'P&L ($)', 
                angle: 90, 
                position: 'insideRight',
                style: { textAnchor: 'middle', fontSize: '12px' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => {
                return value === "Emotional State" 
                  ? "Emotional State (Positive: +500, Neutral: 0, Negative: -500)"
                  : "Trading Result (P&L)";
              }}
            />
            <Line
              yAxisId="emotion"
              type="monotone"
              dataKey="emotionalScore"
              stroke="#6E59A5"
              strokeWidth={2}
              dot={{ fill: "#6E59A5", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#9b87f5" }}
              name="Emotional State"
            />
            <Line
              yAxisId="pnl"
              type="monotone"
              dataKey="tradingResult"
              stroke="#0EA5E9"
              strokeWidth={2}
              dot={{ fill: "#0EA5E9", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#38BDF8" }}
              name="Trading Result"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          <p>{analytics.emotionTrendInsights.improvement}</p>
          <p>{analytics.emotionTrendInsights.impact}</p>
        </div>
      </div>
    </Card>
  );
};