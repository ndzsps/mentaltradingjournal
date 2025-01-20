import { Card } from "@/components/ui/card";

interface WeekCardProps {
  weekNumber: number;
  totalPnL: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const WeekCard = ({ weekNumber, totalPnL }: WeekCardProps) => {
  return (
    <div className="px-2 mb-6">
      <Card
        className="p-4 bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/20 transition-colors w-full h-[4.5rem] flex flex-col justify-center"
      >
        <p className={`text-sm font-medium ${totalPnL === 0 ? 'text-muted-foreground' : ''}`}>
          Week {weekNumber}
        </p>
        <p className={`text-lg font-bold ${
          totalPnL > 0 
            ? 'text-emerald-500 dark:text-emerald-400'
            : totalPnL < 0
              ? 'text-red-500 dark:text-red-400'
              : 'text-muted-foreground'
        }`}>
          {formatCurrency(totalPnL)}
        </p>
      </Card>
    </div>
  );
};