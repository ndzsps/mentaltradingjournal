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
import { format } from "date-fns";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 animate-in fade-in-0 zoom-in-95">
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
              {entry.name === "Emotional Score" 
                ? entry.value 
                : `$${entry.value.toLocaleString()}`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const CumulativeImpact = () => {
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

  // Process journal entries to calculate cumulative impact
  const data = analytics.journalEntries
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((entry, index, array) => {
      const dailyPnL = entry.trades?.reduce((sum, trade) => sum + (Number(trade.pnl) || 0), 0) || 0;
      const emotionalScore = entry.emotion?.toLowerCase().includes('positive') ? 75 :
        entry.emotion?.toLowerCase().includes('neutral') ? 50 : 25;

      // Calculate cumulative P&L
      const cumulativePnL = array
        .slice(0, index + 1)
        .reduce((sum, e) => sum + (e.trades?.reduce((s, t) => s + (Number(t.pnl) || 0), 0) || 0), 0);

      return {
        date: format(new Date(entry.created_at), 'MMM d'),
        emotionalScore,
        cumulativePnL
      };
    })
    .slice(-30); // Show last 30 days

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Cumulative Emotional and Financial Impact</h3>
        <p className="text-sm text-muted-foreground">
          Track emotional state correlation with cumulative profits/losses
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis 
              yAxisId="left" 
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Cumulative P&L ($)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '12px' }
              }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Emotional Score', 
                angle: 90, 
                position: 'insideRight',
                style: { fontSize: '12px' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="cumulativePnL"
              stroke="#6E59A5"
              name="Cumulative P&L ($)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="emotionalScore"
              stroke="#0EA5E9"
              name="Emotional Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          {data.length > 0 ? (
            <>
              <p>
                Your emotional state shows a {
                  data[data.length - 1].emotionalScore > data[0].emotionalScore
                    ? "positive"
                    : "negative"
                } trend over the period.
              </p>
              <p>
                {Math.abs(data[data.length - 1].cumulativePnL) > Math.abs(data[0].cumulativePnL)
                  ? `Overall P&L has ${data[data.length - 1].cumulativePnL > 0 ? "improved" : "declined"}`
                  : "P&L remains relatively stable"}
                {" "}with a cumulative ${Math.abs(data[data.length - 1].cumulativePnL).toLocaleString()}.
              </p>
            </>
          ) : (
            <p>Start logging more trades to see insights about your emotional and financial trends.</p>
          )}
        </div>
      </div>
    </Card>
  );
};