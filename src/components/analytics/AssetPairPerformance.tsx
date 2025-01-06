import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";
import { generateAnalytics } from "@/utils/analyticsUtils";

const data = [
  {
    pair: "EUR/USD",
    profit: 500,
    loss: -200,
    net: 300,
  },
  {
    pair: "GBP/USD",
    profit: 300,
    loss: -100,
    net: 200,
  },
  {
    pair: "USD/JPY",
    profit: 0,
    loss: -150,
    net: -150,
  },
  {
    pair: "AUD/USD",
    profit: 250,
    loss: -180,
    net: 70,
  },
  {
    pair: "USD/CAD",
    profit: 420,
    loss: -320,
    net: 100,
  },
  {
    pair: "USD/CHF",
    profit: 180,
    loss: -90,
    net: 90,
  },
  {
    pair: "NZD/USD",
    profit: 150,
    loss: -200,
    net: -50,
  },
  {
    pair: "EUR/GBP",
    profit: 280,
    loss: -130,
    net: 150,
  },
  {
    pair: "EUR/JPY",
    profit: 340,
    loss: -290,
    net: 50,
  },
  {
    pair: "GBP/JPY",
    profit: 190,
    loss: -240,
    net: -50,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border/50 rounded-lg p-2 shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className={`text-sm ${
              entry.dataKey === "profit"
                ? "text-emerald-500"
                : entry.dataKey === "loss"
                ? "text-red-500"
                : ""
            }`}
          >
            {entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1)}:{" "}
            {entry.dataKey === "loss"
              ? Math.abs(entry.value)
              : entry.value.toFixed(2)}
          </p>
        ))}
        <p className="text-sm font-medium border-t border-border/50 mt-1 pt-1">
          Net: {payload[0].payload.net}
        </p>
      </div>
    );
  }
  return null;
};

export const AssetPairPerformance = () => {
  const analytics = generateAnalytics([]);

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Asset Pair Performance</h3>
        <p className="text-sm text-muted-foreground">
          Profit and loss distribution across different currency pairs
        </p>
      </div>

      <div className="h-[350px] md:h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="pair"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#666" />
            <Bar dataKey="profit" stackId="a" fill="#10B981" />
            <Bar dataKey="loss" stackId="a" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
        <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
        <p className="text-xs md:text-sm text-muted-foreground">
          EUR/USD shows the highest profitability with a net gain of $300, while
          USD/JPY shows consistent losses. Consider reviewing your strategy for
          USD/JPY trades.
        </p>
      </div>
    </Card>
  );
};