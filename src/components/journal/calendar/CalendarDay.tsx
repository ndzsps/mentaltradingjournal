import { DayProps } from "react-day-picker";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { calculateDayStats, formatCurrency, getEmotionStyle } from "./calendarUtils";
import { Trade } from "@/types/trade";
import { Circle } from "lucide-react";
import { useState } from "react";
import { WeeklyReviewDialog } from "../weekly/WeeklyReviewDialog";

interface CalendarDayProps extends Omit<DayProps, 'displayMonth'> {
  entries: Array<{
    date: Date;
    emotion: string;
    trades?: Trade[];
  }>;
  onSelect: (date: Date) => void;
  className?: string;
  displayMonth?: Date;
}

export const CalendarDay = ({ 
  date: dayDate,
  entries,
  onSelect,
  className,
  displayMonth,
  ...props 
}: CalendarDayProps) => {
  const [isWeeklyReviewOpen, setIsWeeklyReviewOpen] = useState(false);
  const stats = calculateDayStats(
    entries.filter(entry => {
      const hasClosedTradesOnThisDay = entry.trades?.some(trade => {
        const exitDate = trade.exitDate ? new Date(trade.exitDate) : null;
        return exitDate?.toDateString() === dayDate.toDateString();
      });
      
      return hasClosedTradesOnThisDay || 
             new Date(entry.date).toDateString() === dayDate.toDateString();
    })
  );
  
  const style = getEmotionStyle(stats);
  const isToday = dayDate.toDateString() === new Date().toDateString();
  const hasEntries = stats !== null;
  const isSaturday = dayDate.getDay() === 6;

  const getPnLColor = (amount: number) => {
    if (amount === 0) return 'text-gray-500 dark:text-gray-400';
    return amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400';
  };

  const getWeekNumber = (date: Date, displayedMonth: Date | undefined) => {
    if (!displayedMonth) return null;

    // Get the first day of the displayed month
    const firstDayOfMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 0);

    // Only calculate week numbers for dates in the displayed month
    if (date < firstDayOfMonth || date > lastDayOfMonth) {
      return null;
    }

    const monthStartsOn = firstDayOfMonth.getDay();
    const dayOfMonth = date.getDate();
    
    // Calculate row position in calendar grid (0-based)
    const rowPosition = Math.floor((dayOfMonth + monthStartsOn - 1) / 7);
    
    // If this is the last row of the month, always return 5
    const totalRows = Math.ceil((lastDayOfMonth.getDate() + monthStartsOn) / 7);
    if (rowPosition === totalRows - 1) {
      return 5;
    }
    
    // Otherwise, return the regular week number (1-based)
    return rowPosition + 1;
  };

  const weekNumber = getWeekNumber(dayDate, displayMonth);
  console.log('Week number for date:', dayDate, 'is:', weekNumber); // Debug log

  const dayButton = (
    <button 
      onClick={() => onSelect(dayDate)}
      className={`
        ${className || ''} 
        ${style?.bg || 'hover:bg-gray-50 dark:hover:bg-gray-800'}
        ${style?.border || ''}
        ${style?.shadow || ''}
        relative flex flex-col h-full w-full
        border-2 border-gray-200 dark:border-gray-700 rounded-lg
        hover:border-primary hover:shadow-lg
        transition-all duration-200 ease-in-out
        overflow-hidden
        ${isToday ? 'border-primary-light dark:border-primary-light' : ''}
      `}
      {...props}
    >
      <div className="absolute top-2 right-2">
        <span className={`
          text-sm font-medium
          ${isToday ? 'bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent' : 'text-gray-500 dark:text-gray-400'}
        `}>
          {dayDate.getDate()}
        </span>
      </div>
      
      {stats && (
        <div className="absolute inset-0 flex flex-col justify-end p-2 bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90">
          <div className="space-y-1 text-center w-full">
            <p className={`text-lg font-semibold ${getPnLColor(stats.totalPL)}`}>
              {formatCurrency(stats.totalPL)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {stats.numTrades} trade{stats.numTrades !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </button>
  );

  return (
    <div className="w-full h-full p-0.5 relative">
      {hasEntries ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {dayButton}
          </TooltipTrigger>
          <TooltipContent>
            <p>Review your performance</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        dayButton
      )}
      {isSaturday && weekNumber && (
        <div className="absolute -right-8 top-1/2 -translate-y-1/2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Circle 
                className="h-4 w-4 text-primary cursor-pointer hover:text-primary-dark transition-colors"
                onClick={() => {
                  console.log('Opening weekly review for week:', weekNumber); // Debug log
                  setIsWeeklyReviewOpen(true);
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Week {weekNumber} Review</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      <WeeklyReviewDialog 
        open={isWeeklyReviewOpen}
        onOpenChange={setIsWeeklyReviewOpen}
        weekNumber={weekNumber || 0}
      />
    </div>
  );
};
