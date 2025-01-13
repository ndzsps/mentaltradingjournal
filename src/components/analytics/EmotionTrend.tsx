import { Card } from "@/components/ui/card";
import {
  ScatterChart,
  Scatter,
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
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

const getEmotionColor = (emotion: string): string => {
  switch (emotion.toLowerCase()) {
    case 'positive':
      return '#22c55e';
    case 'negative':
      return '#ef4444';
    default:
      return '#eab308';
  }
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 animate-in fade-in-0 zoom-in-95">
        <p className="font-medium text-sm text-foreground mb-2">
          {new Date(data.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getEmotionColor(data.emotion) }}
            />
            <span className="text-muted-foreground">Emotional State:</span>
            <span className="font-medium text-foreground capitalize">
              {data.emotion}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">P&L:</span>
            <span className="font-medium text-foreground">
              ${formatValue(data.pnl)}
            </span>
          </div>
        </div>
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
      <Card className="p-4 md:p-6 space-y-4 col-span-2">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-accent/10 rounded w-3/4"></div>
          <div className="h-[400px] bg-accent/10 rounded"></div>
        </div>
      </Card>
    );
  }

  // Transform the data for the scatter plot
  const scatterData = analytics.journalEntries
    .flatMap(entry => 
      entry.trades?.map(trade => ({
        date: new Date(entry.created_at).getTime(),
        pnl: Number(trade.pnl) || 0,
        emotion: entry.emotion,
      })) || []
    )
    .filter(item => !isNaN(item.pnl))
    .reverse();

  // Separate data by emotion
  const positiveData = scatterData.filter(d => d.emotion === 'positive');
  const neutralData = scatterData.filter(d => d.emotion === 'neutral');
  const negativeData = scatterData.filter(d => d.emotion === 'negative');

  return (
    <Card className="p-4 md:p-6 space-y-4 col-span-2">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Emotion vs Trading Performance</h3>
        <p className="text-sm text-muted-foreground">
          Scatter plot showing the relationship between emotional states and trading results
        </p>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              domain={['auto', 'auto']}
              name="Time"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
              type="number"
              label={{ 
                value: 'Emotional State', 
                position: 'bottom',
                offset: 20,
                style: { textAnchor: 'middle' }
              }}
            />
            <YAxis
              dataKey="pnl"
              name="P&L"
              tickFormatter={formatValue}
              label={{ 
                value: 'P&L', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10,
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top"
              height={36}
              formatter={(value) => value}
            />
            <Scatter
              name="Positive"
              data={positiveData}
              fill={getEmotionColor('positive')}
            />
            <Scatter
              name="Neutral"
              data={neutralData}
              fill={getEmotionColor('neutral')}
            />
            <Scatter
              name="Negative"
              data={negativeData}
              fill={getEmotionColor('negative')}
            />
          </ScatterChart>
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