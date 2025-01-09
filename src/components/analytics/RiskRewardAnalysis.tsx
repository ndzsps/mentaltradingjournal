import { Card } from "@/components/ui/card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useQuery } from "@tanstack/react-query";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 animate-in fade-in-0 zoom-in-95">
        <p className="font-medium text-sm text-foreground mb-2">Trade Details</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Risk:</span>
            <span className="font-medium text-foreground">${data.risk.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Reward:</span>
            <span className="font-medium text-foreground">${data.reward.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Position Size:</span>
            <span className="font-medium text-foreground">{data.size}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">R:R Ratio:</span>
            <span className="font-medium text-foreground">
              {Math.round(data.reward / data.risk)}:1
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const RiskRewardAnalysis = () => {
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

  // Process trades to calculate risk/reward data
  const data = analytics.journalEntries
    .flatMap(entry => entry.trades || [])
    .map(trade => {
      const entryPrice = Number(trade.entryPrice);
      const stopLoss = Number(trade.stopLoss);
      const takeProfit = Number(trade.takeProfit);
      const size = Number(trade.quantity);

      const risk = Math.abs(entryPrice - stopLoss);
      const reward = Math.abs(takeProfit - entryPrice);

      return {
        risk,
        reward,
        size,
      };
    })
    .filter(d => d.risk > 0 && d.reward > 0); // Filter out invalid data

  // Calculate average risk:reward ratio
  const avgRiskReward = Math.round(data.reduce((sum, item) => sum + (item.reward / item.risk), 0) / (data.length || 1));

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Risk/Reward Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Visualization of risk vs reward ratios in your trades
        </p>
      </div>

      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="risk" 
              name="Risk ($)" 
              unit="$"
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Risk ($)', 
                position: 'bottom',
                style: { fontSize: '12px' }
              }}
            />
            <YAxis 
              dataKey="reward" 
              name="Reward ($)" 
              unit="$"
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Reward ($)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '12px' }
              }}
            />
            <ZAxis dataKey="size" range={[50, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter name="Trades" data={data} fill="#6E59A5" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          {data.length > 0 ? (
            <>
              <p>
                Your average risk:reward ratio is {avgRiskReward}:1.
                {avgRiskReward >= 2 
                  ? " This is a healthy ratio that supports long-term profitability."
                  : " Consider adjusting your take profit levels to improve this ratio."}
              </p>
              <p>
                {data.filter(d => Math.round(d.reward / d.risk) >= 2).length / data.length >= 0.7
                  ? "The majority of your trades maintain a favorable risk:reward ratio."
                  : "Look for setups that offer better reward potential relative to risk."}
              </p>
            </>
          ) : (
            <p>Start adding trades with stop loss and take profit levels to see risk:reward analysis.</p>
          )}
        </div>
      </div>
    </Card>
  );
};