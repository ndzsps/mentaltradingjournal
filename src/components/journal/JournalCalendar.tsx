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
      bg: stats.totalPL >= 0 ? "bg-emerald-50" : "bg-red-50",
      border: stats.totalPL >= 0 ? "border-emerald-100" : "border-red-100",
      shadow: stats.totalPL >= 0 ? "shadow-emerald-100/50" : "shadow-red-100/50",
    };
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    console.log("Selected date:", newDate);
    onDateSelect(newDate);
  };

  return (
    <Card className="p-8 bg-white border-gray-100 shadow-xl rounded-2xl">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="w-full"
        classNames={{
          months: "w-full space-y-4",
          month: "w-full space-y-4",
          table: "w-full border-collapse",
          head_row: "flex w-full",
          head_cell: "text-center w-[14.28%] font-medium text-sm text-gray-600 pb-4",
          row: "flex w-full mt-2",
          cell: "w-[14.28%] h-24 lg:h-28 p-0.5 relative",
          day: "h-full w-full rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer group border-2 border-gray-100 hover:shadow-lg hover:border-gray-200",
          day_today: "!border-primary-light border-2",
          day_selected: "!border-primary border-2 !shadow-lg shadow-primary/20",
        }}
        components={{
          Day: ({ date: dayDate, ...props }: DayProps & { className?: string }) => {
            const entry = entries.find(e => e.date.toDateString() === dayDate.toDateString());
            const stats = entry ? calculateDayStats(entry) : null;
            const style = getEmotionStyle(dayDate);
            
            return (
              <div className="w-full h-full p-0.5">
                <button 
                  {...props} 
                  className={`
                    ${props.className || ''} 
                    ${style?.bg || 'hover:bg-gray-50'}
                    ${style?.border || ''}
                    ${style?.shadow || ''}
                    relative flex flex-col items-stretch justify-start p-2
                    transition-all duration-200 ease-in-out
                  `}
                >
                  <span className="text-sm text-gray-400 absolute top-2 left-2">
                    {dayDate.getDate()}
                  </span>
                  
                  {stats && (
                    <div className="mt-8 space-y-1">
                      <p className={`text-lg font-semibold ${stats.totalPL >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {formatCurrency(stats.totalPL)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {stats.numTrades} trade{stats.numTrades !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-400">
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