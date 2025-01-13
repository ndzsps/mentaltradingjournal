import { Card } from "@/components/ui/card";
import { generateAnalytics } from "@/utils/analyticsUtils";
import { useQuery } from "@tanstack/react-query";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const INITIAL_BALANCE_OPTIONS = [
  { value: 5000, label: "$5,000" },
  { value: 10000, label: "$10,000" },
  { value: 25000, label: "$25,000" },
  { value: 50000, label: "$50,000" },
  { value: 100000, label: "$100,000" },
  { value: 200000, label: "$200,000" },
];

export const EquityCurve = () => {
  const [selectedBalance, setSelectedBalance] = useState(10000);
  
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

  // Process journal entries to calculate equity curve data
  let runningBalance = selectedBalance;
  
  const equityData = analytics.journalEntries
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .reduce((acc: any[], entry) => {
      const dailyPnL = entry.trades?.reduce((sum, trade) => sum + (Number(trade.pnl) || 0), 0) || 0;
      runningBalance += dailyPnL;
      
      acc.push({
        date: new Date(entry.created_at).toLocaleDateString(),
        balance: runningBalance,
        dailyPnL,
      });
      
      return acc;
    }, []);

  // Calculate performance metrics
  const maxBalance = Math.max(...equityData.map(d => d.balance));
  const currentBalance = equityData[equityData.length - 1]?.balance || selectedBalance;
  const totalReturn = ((currentBalance - selectedBalance) / selectedBalance) * 100;
  
  // Calculate maximum drawdown
  let maxDrawdown = 0;
  let peak = selectedBalance;
  
  equityData.forEach(point => {
    if (point.balance > peak) {
      peak = point.balance;
    }
    const drawdown = ((peak - point.balance) / peak) * 100;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  });

  return (
    <Card className="p-4 md:p-6 space-y-4 col-span-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl md:text-2xl font-bold">Equity Curve</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Initial Balance:</span>
            <Select
              value={selectedBalance.toString()}
              onValueChange={(value) => setSelectedBalance(Number(value))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INITIAL_BALANCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Track your account balance progression over time
        </p>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={equityData}
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
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
            />
            <ReferenceLine y={selectedBalance} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="hsl(var(--primary))"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground">Initial Balance</p>
          <p className="text-lg font-bold">${selectedBalance.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-lg font-bold">${currentBalance.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground">Total Return</p>
          <p className={`text-lg font-bold ${totalReturn >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
          </p>
        </div>
        <div className="p-4 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground">Max Drawdown</p>
          <p className="text-lg font-bold text-red-500">
            -{maxDrawdown.toFixed(2)}%
          </p>
        </div>
      </div>
    </Card>
  );
};