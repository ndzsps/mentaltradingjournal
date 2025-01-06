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
import { useQuery } from "@tanstack/react-query";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border/50 rounded-lg p-3 shadow-xl">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className={`text-sm ${
              entry.dataKey === "profit"
                ? "text-emerald-400"
                : entry.dataKey === "loss"
                ? "text-red-400"
                : ""
            }`}
          >
            {entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1)}:{" "}
            {entry.dataKey === "loss"
              ? `$${Math.abs(entry.value).toLocaleString()}`
              : `$${entry.value.toLocaleString()}`}
          </p>
        ))}
        <p className="text-sm font-medium border-t border-border/50 mt-2 pt-2">
          Net: ${payload[0].payload.net.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const AssetPairPerformance = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: generateAnalytics,
  });
  
  if (isLoading || !analytics) {
    return (
      <Card className="p-4 md:p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-accent/10 rounded w-3/4"></div>
          <div className="h-[350px] md:h-[400px] bg-accent/10 rounded"></div>
        </div>
      </Card>
    );
  }

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
              content={<CustomTooltip />}
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
