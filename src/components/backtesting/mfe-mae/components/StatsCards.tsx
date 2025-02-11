
import { Card } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    tradesHitTp: number;
    tradesHitSl: number;
    avgUpdrawWinner: number;
    avgUpdrawLoser: number;
    avgDrawdownWinner: number;
    avgDrawdownLoser: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">Trades Hit TP</div>
        <div className="text-2xl font-bold text-white">{stats.tradesHitTp.toFixed(2)}%</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">Trades Hit SL</div>
        <div className="text-2xl font-bold text-white">{stats.tradesHitSl.toFixed(2)}%</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">Avg. MFE Winner</div>
        <div className="text-2xl font-bold text-white">{stats.avgUpdrawWinner.toFixed(2)}%</div>
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
        <div className="text-2xl font-bold text-white">{stats.avgDrawdownLoser.toFixed(2)}%</div>
      </Card>
    </div>
  );
}

