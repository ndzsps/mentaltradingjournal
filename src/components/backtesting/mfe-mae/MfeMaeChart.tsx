
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

interface TradeData {
  id: string;
  highestPrice: number;
  lowestPrice: number;
  entryPrice: number;
  exitPrice: number;
}

export function MfeMaeChart() {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({
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

      const trades = entries.flatMap(entry => entry.trades || []);
      
      const processedData = trades.map((trade: TradeData) => {
        const entryPrice = Number(trade.entryPrice);
        const exitPrice = Number(trade.exitPrice);
        const highestPrice = Number(trade.highestPrice);
        const lowestPrice = Number(trade.lowestPrice);

        const updraw = ((highestPrice - entryPrice) / entryPrice) * 100;
        const drawdown = ((lowestPrice - entryPrice) / entryPrice) * 100;

        return {
          id: trade.id,
          updraw: updraw.toFixed(2),
          drawdown: drawdown.toFixed(2),
        };
      });

      // Calculate statistics
      const winners = trades.filter((t: TradeData) => 
        Number(t.exitPrice) > Number(t.entryPrice)
      );
      const losers = trades.filter((t: TradeData) => 
        Number(t.exitPrice) <= Number(t.entryPrice)
      );

      const calculateAverage = (arr: any[], prop: string) => 
        arr.length ? arr.reduce((acc, curr) => acc + Number(curr[prop]), 0) / arr.length : 0;

      setStats({
        tradesHitTp: (winners.length / trades.length * 100).toFixed(2),
        tradesHitSl: (losers.length / trades.length * 100).toFixed(2),
        avgUpdrawWinner: calculateAverage(winners.map(t => ({
          updraw: ((Number(t.highestPrice) - Number(t.entryPrice)) / Number(t.entryPrice)) * 100
        })), 'updraw').toFixed(2),
        avgUpdrawLoser: calculateAverage(losers.map(t => ({
          updraw: ((Number(t.highestPrice) - Number(t.entryPrice)) / Number(t.entryPrice)) * 100
        })), 'updraw').toFixed(2),
        avgDrawdownWinner: calculateAverage(winners.map(t => ({
          drawdown: ((Number(t.lowestPrice) - Number(t.entryPrice)) / Number(t.entryPrice)) * 100
        })), 'drawdown').toFixed(2),
        avgDrawdownLoser: calculateAverage(losers.map(t => ({
          drawdown: ((Number(t.lowestPrice) - Number(t.entryPrice)) / Number(t.entryPrice)) * 100
        })), 'drawdown').toFixed(2),
        avgExitWinner: calculateAverage(winners.map(t => ({
          exit: ((Number(t.exitPrice) - Number(t.entryPrice)) / Number(t.entryPrice)) * 100
        })), 'exit').toFixed(2),
        avgExitLoser: calculateAverage(losers.map(t => ({
          exit: ((Number(t.exitPrice) - Number(t.entryPrice)) / Number(t.entryPrice)) * 100
        })), 'exit').toFixed(2),
      });

      setData(processedData);
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
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="updraw" fill="#4ade80" name="Updraw" />
              <Bar dataKey="drawdown" fill="#f43f5e" name="Drawdown" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Trades Hit TP</div>
          <div className="text-2xl font-bold text-green-500">{stats.tradesHitTp}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Trades Hit SL</div>
          <div className="text-2xl font-bold text-red-500">{stats.tradesHitSl}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg. Updraw Winner</div>
          <div className="text-2xl font-bold text-green-500">{stats.avgUpdrawWinner}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg. Updraw Loser</div>
          <div className="text-2xl font-bold">{stats.avgUpdrawLoser}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg. Drawdown Winner</div>
          <div className="text-2xl font-bold">{stats.avgDrawdownWinner}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg. Drawdown Loser</div>
          <div className="text-2xl font-bold text-red-500">{stats.avgDrawdownLoser}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg. Exit Winner</div>
          <div className="text-2xl font-bold text-green-500">{stats.avgExitWinner}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg. Exit Loser</div>
          <div className="text-2xl font-bold text-red-500">{stats.avgExitLoser}%</div>
        </Card>
      </div>
    </div>
  );
}
