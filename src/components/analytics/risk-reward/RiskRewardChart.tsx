import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
} from "recharts";
import { format } from "date-fns";

interface RiskRewardData {
  date: Date;
  cumulativeRR: number;
  avgRR: number;
  isSignificant: boolean;
  riskRewardRatio: number;
  pnl: number;
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
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium text-foreground">
              {format(data.date, 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Trade R:R:</span>
            <span className="font-medium text-foreground">
              {data.riskRewardRatio.toFixed(2)}:1
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Cumulative R:R:</span>
            <span className="font-medium text-foreground">
              {data.cumulativeRR.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Average R:R:</span>
            <span className="font-medium text-foreground">
              {data.avgRR.toFixed(2)}:1
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">P&L:</span>
            <span className={`font-medium ${data.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${data.pnl.toFixed(2)}
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
        <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(date, 'MMM d')}
            tick={{ fontSize: 12 }}
            label={{
              value: 'Trading Days',
              position: 'bottom',
              style: { fontSize: '12px' }
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: 'Cumulative R:R',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: '12px' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#666" />
          <Line
            type="monotone"
            dataKey="cumulativeRR"
            stroke="#6E59A5"
            strokeWidth={2}
            dot={false}
          />
          <Scatter
            data={data.filter(d => d.isSignificant)}
            dataKey="cumulativeRR"
            fill="#FF6B6B"
            shape="star"
            size={100}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};