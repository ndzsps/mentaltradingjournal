
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Trade } from "@/types/trade";
import { StatsCards } from "./components/StatsCards";
import { MfeMaeBarChart } from "./components/MfeMaeBarChart";
import { processTrade } from "./utils/tradeCalculations";
import { ChartData, Stats } from "./types";

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
          const processedTrade = processTrade(trade);
          if (processedTrade) {
            processedData.push(processedTrade);
          }
        });
      });

      setData(processedData);

      // Calculate statistics
      const allTrades = entries.flatMap(entry => entry.trades || []) as Trade[];
      const winners = allTrades.filter(t => {
        if (!t.direction || !t.entryPrice || !t.exitPrice) return false;
        const isWinner = t.direction === 'buy' 
          ? Number(t.exitPrice) > Number(t.entryPrice)
          : Number(t.exitPrice) < Number(t.entryPrice);
        return isWinner;
      });
      
      const losers = allTrades.filter(t => {
        if (!t.direction || !t.entryPrice || !t.exitPrice) return false;
        const isLoser = t.direction === 'buy'
          ? Number(t.exitPrice) <= Number(t.entryPrice)
          : Number(t.exitPrice) >= Number(t.entryPrice);
        return isLoser;
      });

      const calculateAverage = (trades: Trade[], fn: (t: Trade) => number) => 
        trades.length ? trades.reduce((acc, curr) => acc + fn(curr), 0) / trades.length : 0;

      const getUpdraw = (t: Trade) => {
        const isBuy = t.direction === 'buy';
        return isBuy
          ? ((Number(t.highestPrice) - Number(t.entryPrice)) / Number(t.entryPrice)) * 100
          : ((Number(t.entryPrice) - Number(t.lowestPrice)) / Number(t.entryPrice)) * 100;
      };

      const getDrawdown = (t: Trade) => {
        const isBuy = t.direction === 'buy';
        return isBuy
          ? ((Number(t.lowestPrice) - Number(t.entryPrice)) / Number(t.entryPrice)) * 100
          : ((Number(t.highestPrice) - Number(t.entryPrice)) / Number(t.entryPrice)) * 100;
      };

      const getExit = (t: Trade) => {
        const isBuy = t.direction === 'buy';
        return isBuy
          ? ((Number(t.exitPrice) - Number(t.entryPrice)) / Number(t.entryPrice)) * 100
          : ((Number(t.entryPrice) - Number(t.exitPrice)) / Number(t.entryPrice)) * 100;
      };

      setStats({
        tradesHitTp: (winners.length / allTrades.length) * 100,
        tradesHitSl: (losers.length / allTrades.length) * 100,
        avgUpdrawWinner: calculateAverage(winners, getUpdraw),
        avgUpdrawLoser: calculateAverage(losers, getUpdraw),
        avgDrawdownWinner: calculateAverage(winners, getDrawdown),
        avgDrawdownLoser: calculateAverage(losers, getDrawdown),
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
          <MfeMaeBarChart data={data} />
        </div>
      </Card>
      <StatsCards stats={stats} />
    </div>
  );
}
