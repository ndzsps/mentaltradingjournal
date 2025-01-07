import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { DayProps } from "react-day-picker";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface JournalCalendarProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  entries: Array<{
    date: Date;
    emotion: string;
    trades?: Array<{
      profit_loss: number;
      risk_reward?: number;
      win?: boolean;
    }>;
  }>;
}

export const JournalCalendar = ({ date, onDateSelect, entries }: JournalCalendarProps) => {
  // Get dates that have entries matching the current filters
  const datesWithMatchingEntries = entries.map(entry => entry.date);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'always',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDayStats = (entry: typeof entries[0]) => {
    if (!entry.trades || entry.trades.length === 0) return null;

    const totalPL = entry.trades.reduce((sum, trade) => sum + (trade.profit_loss || 0), 0);
    const winRate = entry.trades.filter(t => t.win).length / entry.trades.length * 100;
    const avgRR = entry.trades.reduce((sum, trade) => sum + (trade.risk_reward || 0), 0) / entry.trades.length;

    return {
      totalPL,
      numTrades: entry.trades.length,
      winRate,
      avgRR: avgRR.toFixed(2),
    };
  };

  const getEmotionStyle = (date: Date) => {
    const entry = entries.find(e => 
      e.date.toDateString() === date.toDateString()
    );
    
    if (!entry) return null;

    const stats = calculateDayStats(entry);
    if (!stats) return null;

    return {
      bg: stats.totalPL >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
      border: stats.totalPL >= 0 ? "border-emerald-500/20" : "border-red-500/20",
    };
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    console.log("Selected date:", newDate);
    onDateSelect(newDate);
  };

  return (
    <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="w-full"
        classNames={{
          months: "w-full",
          month: "w-full",
          table: "w-full",
          head_row: "w-full",
          row: "w-full",
          cell: "w-[14.28%] h-24 lg:h-28 p-0 relative",
          day: "h-full w-full rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer group border border-border/20",
          day_today: "!border-primary",
          day_selected: "!border-primary border-2",
        }}
        components={{
          Day: ({ date: dayDate, ...props }: DayProps & { className?: string }) => {
            const entry = entries.find(e => e.date.toDateString() === dayDate.toDateString());
            const stats = entry ? calculateDayStats(entry) : null;
            const style = getEmotionStyle(dayDate);
            const isToday = dayDate.toDateString() === new Date().toDateString();
            
            return (
              <div className="w-full h-full p-0.5">
                <button 
                  {...props} 
                  className={`
                    ${props.className || ''} 
                    ${style?.bg || ''}
                    ${style?.border || ''}
                    relative flex flex-col items-stretch justify-start p-1
                    hover:shadow-lg transition-all duration-200
                    border border-border/10
                  `}
                >
                  <span className="text-sm text-muted-foreground absolute top-1 right-1">
                    {dayDate.getDate()}
                  </span>
                  
                  {stats && (
                    <div className="mt-4 space-y-0.5 text-left">
                      <p className="text-base font-medium">
                        {formatCurrency(stats.totalPL)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stats.numTrades} trade{stats.numTrades !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stats.avgRR}R, {stats.winRate.toFixed(1)}%
                      </p>
                    </div>
                  )}
                </button>
              </div>
            );
          }
        }}
      />
    </Card>
  );
};