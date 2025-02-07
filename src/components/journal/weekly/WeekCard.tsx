
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface WeekCardProps {
  weekNumber: number;
  totalPnL: number;
  tradeCount: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const WeekCard = ({ weekNumber, totalPnL, tradeCount }: WeekCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="px-2 mb-6">
      <Card
        className="p-4 bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/20 transition-colors w-[300px] h-[4.5rem] flex flex-col justify-center"
      >
        <div className="flex justify-between items-center">
          <p className={`text-sm font-medium ${totalPnL === 0 ? 'text-muted-foreground' : ''}`}>
            Week {weekNumber}
          </p>
          <p className="text-sm text-muted-foreground">
            {tradeCount} {tradeCount === 1 ? 'trade' : 'trades'}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <p className={`text-lg font-bold truncate ${
              totalPnL > 0 
                ? 'text-emerald-500 dark:text-emerald-400'
                : totalPnL < 0
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-muted-foreground'
            }`}>
              {formatCurrency(totalPnL)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/journal-entry')}
              className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-2 py-1 h-auto shrink-0"
            >
              + Weekly Review
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

