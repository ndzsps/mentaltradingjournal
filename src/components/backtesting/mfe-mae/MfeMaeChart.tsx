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
  mfeRelativeToTp: number;
  maeRelativeToSl: number;
  instrument?: string;
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

      console.log('Fetched journal entries:', entries);

      if (!entries) return;

      const processedData: ChartData[] = [];
      
      entries.forEach(entry => {
        console.log('Processing entry:', entry);
        const trades = entry.trades as Trade[];
        if (!trades) return;
        
        trades.forEach(trade => {
          console.log('Processing trade:', trade);
          console.log('Trade fields:', {
            highestPrice: trade.highestPrice,
            lowestPrice: trade.lowestPrice,
            entryPrice: trade.entryPrice,
            takeProfit: trade.takeProfit,
            stopLoss: trade.stopLoss,
            direction: trade.direction,
            id: trade.id
          });

          if (
            trade.highestPrice &&
            trade.lowestPrice &&
            trade.entryPrice &&
            trade.takeProfit &&
            trade.stopLoss &&
            trade.id
          ) {
            console.log('Trade passed validation checks');
            const entryPrice = Number(trade.entryPrice);
            const highestPrice = Number(trade.highestPrice);
            const lowestPrice = Number(trade.lowestPrice);
            const takeProfit = Number(trade.takeProfit);
            const stopLoss = Number(trade.stopLoss);
            
            // Step 1: Identify Trade Direction based on Stop Loss
            const isLong = stopLoss < entryPrice;
            console.log('Determined direction based on SL:', isLong ? 'long' : 'short');

            // Step 2: Calculate MAE relative to SL based on trade direction
            let maeRelativeToSl = isLong 
              ? ((lowestPrice - entryPrice) / (stopLoss - entryPrice)) * 100
              : ((highestPrice - entryPrice) / (stopLoss - entryPrice)) * 100;

            // Make MAE always negative
            maeRelativeToSl = -Math.abs(maeRelativeToSl);

            // Calculate MFE relative to TP (keeping existing logic)
            const isBuyForTp = takeProfit > entryPrice;
            const updraw = ((takeProfit - entryPrice) / entryPrice) * 100;
            const mfe = isBuyForTp 
              ? ((highestPrice - entryPrice) / entryPrice) * 100
              : ((entryPrice - lowestPrice) / entryPrice) * 100;
            const mfeRelativeToTp = (mfe / updraw) * 100;

            console.log('Final calculations:', {
              isLong,
              maeRelativeToSl,
              mfeRelativeToTp
            });

            processedData.push({
              id: trade.id,
              mfeRelativeToTp,
              maeRelativeToSl,
              instrument: trade.instrument
            });
          } else {
            console.log('Trade missing required fields:', {
              hasHighestPrice: !!trade.highestPrice,
              hasLowestPrice: !!trade.lowestPrice,
              hasEntryPrice: !!trade.entryPrice,
              hasTakeProfit: !!trade.takeProfit,
              hasStopLoss: !!trade.stopLoss,
              hasId: !!trade.id
            });
          }
        });
      });

      console.log('Final processed data:', processedData);
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
              <XAxis 
                dataKey="id" 
                label={{ value: 'Trade ID', position: 'bottom' }}
              />
              <YAxis domain={[-100, 100]} label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number, name: string, props: { payload: ChartData }) => [
                  `${value.toFixed(2)}%`,
                  `${name} - ${props.payload.instrument || 'Unknown'}`
                ]}
              />
              <Legend />
              <Bar 
                dataKey="mfeRelativeToTp" 
                fill="#4ade80" 
                name="MFE Relative to TP (%)" 
              />
              <Bar 
                dataKey="maeRelativeToSl" 
                fill="#f43f5e" 
                name="Drawdown (%)" 
              />
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
