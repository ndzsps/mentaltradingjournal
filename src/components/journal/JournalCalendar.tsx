import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { DayProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Trade } from "@/types/trade";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface JournalCalendarProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  entries: Array<{
    date: Date;
    emotion: string;
    trades?: Trade[];
  }>;
}

export const JournalCalendar = ({ date, onDateSelect, entries }: JournalCalendarProps) => {
  const queryClient = useQueryClient();

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('journal_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
        },
        () => {
          // Invalidate and refetch data when changes occur
          queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
          queryClient.invalidateQueries({ queryKey: ['analytics'] });
          queryClient.invalidateQueries({ queryKey: ['weekly-performance'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'always',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDayStats = (date: Date) => {
    const dayEntries = entries.filter(entry => 
      new Date(entry.date).toDateString() === date.toDateString()
    );

    if (dayEntries.length === 0) return null;

    // Create a Map to store unique trades with their latest values
    const tradeMap = new Map<string, Trade>();
    
    // Process all trades, keeping only the latest version of each trade
    dayEntries.forEach(entry => {
      if (entry.trades && entry.trades.length > 0) {
        entry.trades.forEach(trade => {
          if (trade && trade.id) {
            // Always keep the latest version of the trade
            tradeMap.set(trade.id, trade);
          }
        });
      }
    });

    // Calculate totals using only unique trades
    let totalPL = 0;
    let totalTrades = 0;

    tradeMap.forEach(trade => {
      totalTrades++;
      const pnlValue = trade.pnl || trade.profit_loss || 0;
      const numericPnL = typeof pnlValue === 'string' ? parseFloat(pnlValue) : pnlValue;
      totalPL += isNaN(numericPnL) ? 0 : numericPnL;
    });

    return {
      totalPL,
      numTrades: totalTrades,
    };
  };

  const getEmotionStyle = (date: Date) => {
    const stats = calculateDayStats(date);
    if (!stats) return null;

    return {
      bg: stats.totalPL >= 0 
        ? "bg-emerald-50 dark:bg-emerald-950/30" 
        : "bg-red-50 dark:bg-red-950/30",
      border: stats.totalPL >= 0 
        ? "border-emerald-100 dark:border-emerald-800" 
        : "border-red-100 dark:border-red-800",
      shadow: stats.totalPL >= 0 
        ? "shadow-emerald-100/50 dark:shadow-emerald-900/50" 
        : "shadow-red-100/50 dark:shadow-red-900/50",
    };
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    console.log('Date selected:', {
      _type: 'Date',
      value: {
        iso: newDate?.toISOString(),
        value: newDate?.getTime(),
        local: newDate?.toString()
      }
    });
    onDateSelect(newDate);
    
    const journalEntriesSection = document.querySelector('#journal-entries');
    if (journalEntriesSection) {
      journalEntriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <TooltipProvider>
      <Card className="p-8 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="w-full"
          classNames={{
            months: "w-full space-y-4",
            month: "w-full space-y-4",
            table: "w-full border-collapse h-[calc(100vh-12rem)]",
            head_row: "flex w-full h-8",
            head_cell: "text-sm font-medium bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent w-[14.28%] text-center",
            row: "flex w-full h-24",
            cell: "w-[14.28%] p-1 relative [&:has([aria-selected])]:bg-accent/50 cursor-pointer",
            day: "h-full w-full transition-all duration-200 cursor-pointer group",
            day_today: "relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-primary-light before:to-accent before:opacity-10 before:transition-opacity hover:before:opacity-20 dark:before:opacity-20 dark:hover:before:opacity-30",
            day_selected: "border-primary-light border-2 shadow-lg shadow-primary-light/20 dark:border-primary-light dark:shadow-primary-light/20",
            caption: "flex justify-center pt-1 relative items-center mb-4",
            caption_label: "text-2xl font-semibold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent",
            nav: "space-x-1 flex items-center",
            nav_button: "h-9 w-9 bg-transparent p-0 hover:opacity-100 hover:bg-primary hover:bg-opacity-10 rounded-full flex items-center justify-center transition-all duration-200",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
          }}
          components={{
            IconLeft: () => (
              <div className="bg-gradient-to-r from-primary-light to-accent bg-clip-text">
                <ChevronLeft className="h-6 w-6 stroke-primary-light dark:stroke-primary-light" />
              </div>
            ),
            IconRight: () => (
              <div className="bg-gradient-to-r from-primary-light to-accent bg-clip-text">
                <ChevronRight className="h-6 w-6 stroke-primary-light dark:stroke-primary-light" />
              </div>
            ),
            Day: ({ date: dayDate, ...props }: DayProps & { className?: string }) => {
              const stats = calculateDayStats(dayDate);
              const style = getEmotionStyle(dayDate);
              const isToday = dayDate.toDateString() === new Date().toDateString();
              const hasEntries = stats !== null;
              
              const dayButton = (
                <button 
                  {...props} 
                  onClick={() => handleDateSelect(dayDate)}
                  className={`
                    ${props.className || ''} 
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
                        <p className={`text-lg font-semibold ${stats.totalPL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
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
                <div className="w-full h-full p-0.5">
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
                </div>
              );
            }
          }}
        />
      </Card>
    </TooltipProvider>
  );
};
