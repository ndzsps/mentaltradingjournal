import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { AssetPairTooltip } from "./AssetPairTooltip";

interface AssetPairData {
  pair: string;
  profit: number;
  loss: number;
  net: number;
}

interface AssetPairChartProps {
  data: AssetPairData[];
}

export const AssetPairChart = ({ data }: AssetPairChartProps) => {
  return (
    <div className="h-[350px] md:h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barSize={32}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--border))"
            opacity={0.4}
          />
          <XAxis
            dataKey="pair"
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
            stroke="hsl(var(--foreground))"
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="hsl(var(--foreground))"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            content={<AssetPairTooltip />}
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
          />
          <ReferenceLine y={0} stroke="hsl(var(--border))" />
          <Bar
            dataKey="profit"
            stackId="a"
            fill="hsl(142.1 76.2% 36.3%)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="loss"
            stackId="a"
            fill="hsl(346.8 77.2% 49.8%)"
            radius={[0, 0, 4, 4]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};