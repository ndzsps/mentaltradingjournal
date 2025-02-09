
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeeklyReviewDialog } from "./WeeklyReviewDialog";

interface WeekCardProps {
  weekNumber: number;
  totalPnL: number;
  tradeCount: number;
}

export const WeekCard = ({ weekNumber, totalPnL, tradeCount }: WeekCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="px-2 mb-6">
      <Card
        className="p-4 bg-card/30 backdrop-blur-xl border-primary/10 hover:border-primary/20 transition-colors w-full h-[4.5rem] flex flex-col justify-center"
      >
        <div className="flex justify-between items-center">
          <p className={`text-sm font-medium ${totalPnL === 0 ? 'text-muted-foreground' : ''}`}>
            Week {weekNumber}
          </p>
          <p className={`text-sm ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)}
          </p>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-muted-foreground">
            {tradeCount} {tradeCount === 1 ? 'trade' : 'trades'}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-2 py-1 h-auto shrink-0"
          >
            + Weekly Review
          </Button>
        </div>
      </Card>
      <WeeklyReviewDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        weekNumber={weekNumber}
      />
    </div>
  );
};
