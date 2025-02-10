
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Trade } from "@/types/trade";

interface Stats {
  tradesHitTp: number;
  tradesHitSl: number;
  avgUpdrawWinner: number;
  avgUpdrawLoser: number;
  avgDrawdownWinner: number;
  avgDrawdownLoser: number;
  avgExitWinner: number;
  avgExitLoser: number;
}

interface ChartData {
  id: string;
  updraw: number;
  drawdown: number;
}

export function MfeMaeChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [stats, setStats] = useState<Stats>({
    tradesHitTp: 0,
    tradesHitSl: 0,
    avgUpdrawWinner: 0,
    avgUpdrawLoser: 0,
    avgDrawdownWinner: 0,
    avgDrawdownLoser: 0,
    avgExitWinner: 0,
    avgExitLoser: 0,
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchTrades = async () => {
      if (!user) return;

      const { data: entries } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id);

      if (!entries) return;

      const processedData: ChartData[] = [];
      
      entries.forEach(entry => {
        const trades = entry.trades as Trade[];
        if (!trades) return;
        
        trades.forEach(trade => {
          if (
            trade.highestPrice &&
            trade.lowestPrice &&
            trade.entryPrice &&
            trade.id
          ) {
            const entryPrice = Number(trade.entryPrice);
            const highestPrice = Number(trade.highestPrice);
            const lowestPrice = Number(trade.lowestPrice);

            // Calculate MFE (Maximum Favorable Excursion)
            const mfe = ((highestPrice - entryPrice) / entryPrice) * 100;
            
            // Calculate MAE (Maximum Adverse Excursion)
            const mae = ((entryPrice - lowestPrice) / entryPrice) * 100;

            processedData.push({
              id: trade.id,
              updraw: mfe,
              drawdown: -mae, // Make negative to show below 0 on chart
            });
          }
        });
      });

      setData(processedData);

      // Calculate statistics
      const allTrades = entries.flatMap(entry => entry.trades || []) as Trade[];
      const winners = allTrades.filter(t => 
        Number(t.exitPrice) > Number(t.entryPrice)
      );
      const losers = allTrades.filter(t => 
        Number(t.exitPrice) <= Number(t.entryPrice)
      );

      const calculateAverage = (trades: Trade[], fn: (t: Trade) => number) => 
        trades.length ? trades.reduce((acc, curr) => acc + fn(curr), 0) / trades.length : 0;

      const getMfe = (t: Trade) => ((Number(t.highestPrice) - Number(t.entryPrice)) / Number(t.entryPrice)) * 100;
      const getMae = (t: Trade) => ((Number(t.entryPrice) - Number(t.lowestPrice)) / Number(t.entryPrice)) * 100;
      const getExit = (t: Trade) => ((Number(t.exitPrice) - Number(t.entryPrice)) / Number(t.entryPrice)) * 100;

      setStats({
        tradesHitTp: winners.length > 0 ? (winners.length / allTrades.length) * 100 : 0,
        tradesHitSl: losers.length > 0 ? (losers.length / allTrades.length) * 100 : 0,
        avgUpdrawWinner: calculateAverage(winners, getMfe),
        avgUpdrawLoser: calculateAverage(losers, getMfe),
        avgDrawdownWinner: calculateAverage(winners, getMae),
        avgDrawdownLoser: calculateAverage(losers, getMae),
        avgExitWinner: calculateAverage(winners, getExit),
        avgExitLoser: calculateAverage(losers, getExit),
      });
    };

    fetchTrades();
  }, [user]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis domain={[-100, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="updraw" fill="#4ade80" name="MFE (Maximum Favorable Excursion)" />
              <Bar dataKey="drawdown" fill="#f43f5e" name="MAE (Maximum Adverse Excursion)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Trades Hit TP</div>
          <div className="text-2xl font-bold text-green-500">{stats.tradesHitTp.toFixed(2)}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Trades Hit SL</div>
          <div className="text-2xl font-bold text-red-500">{stats.tradesHitSl.toFixed(2)}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg. MFE Winner</div>
          <div className="text-2xl font-bold text-green-500">{stats.avgUpdrawWinner.toFixed(2)}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg. MFE Loser</div>
          <div className="text-2xl font-bold">{stats.avgUpdrawLoser.toFixed(2)}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg. MAE Winner</div>
          <div className="text-2xl font-bold">{stats.avgDrawdownWinner.toFixed(2)}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg. MAE Loser</div>
          <div className="text-2xl font-bold text-red-500">{stats.avgDrawdownLoser.toFixed(2)}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg. Exit Winner</div>
          <div className="text-2xl font-bold text-green-500">{stats.avgExitWinner.toFixed(2)}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg. Exit Loser</div>
          <div className="text-2xl font-bold text-red-500">{stats.avgExitLoser.toFixed(2)}%</div>
        </Card>
      </div>
    </div>
  );
}
