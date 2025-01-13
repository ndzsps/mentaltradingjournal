import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { CustomTooltip } from "../shared/CustomTooltip";

interface EquityCurveChartProps {
  data: Array<{
    date: string;
    balance: number;
    dailyPnL: number;
  }>;
  initialBalance: number;
}

export const EquityCurveChart = ({ data, initialBalance }: EquityCurveChartProps) => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 60,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            label={{
              value: 'Account Balance ($)',
              angle: -90,
              position: 'insideLeft',
              style: {
                fontSize: '12px',
                textAnchor: 'middle',
                fill: 'currentColor'
              },
              dx: -45
            }}
          />
          <Tooltip
            content={<CustomTooltip
              valueFormatter={(value) => `$${value.toLocaleString()}`}
            />}
          />
          <ReferenceLine y={initialBalance} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="hsl(var(--primary))"
            dot={false}
            strokeWidth={2}
            name="Balance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};