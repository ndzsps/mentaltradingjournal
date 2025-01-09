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

interface RiskRewardData {
  risk: number;
  reward: number;
  size: number;
}

interface RiskRewardChartProps {
  data: RiskRewardData[];
}

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

export const RiskRewardChart = ({ data }: RiskRewardChartProps) => {
  return (
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
  );
};