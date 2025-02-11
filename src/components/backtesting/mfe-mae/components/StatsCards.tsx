
import { Card } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    tradesHitTp: number;
    tradesHitSl: number;
    avgUpdrawWinner: number;
    avgUpdrawLoser: number;
    avgDrawdownWinner: number;
    avgDrawdownLoser: number;
    avgExitWinner: number;
    avgExitLoser: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
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
  );
}
