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
  }>;
}

export const JournalCalendar = ({ date, onDateSelect, entries }: JournalCalendarProps) => {
  // Get dates that have entries matching the current filters
  const datesWithMatchingEntries = entries.map(entry => entry.date);

  // Create a modifier styles object for different emotion states
  const getEmotionStyle = (date: Date) => {
    const entry = entries.find(e => 
      e.date.toDateString() === date.toDateString()
    );
    
    if (!entry) return null;

    return {
      emotion: entry.emotion === "Positive" ? "bg-[#F2FCE2]" : "bg-[#FEF7CD]"
    };
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    console.log("Selected date:", newDate); // Debug log
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
          cell: "w-[14.28%] h-14 lg:h-16 p-0 relative",
          day: "relative w-full h-full rounded-md transition-all duration-200 cursor-pointer group",
          day_today: "after:absolute after:inset-[15%] after:rounded-md after:bg-primary/5",
          day_selected: "!bg-primary text-primary-foreground hover:bg-primary/90",
        }}
        components={{
          Day: ({ date: dayDate, ...props }: DayProps & { className?: string }) => {
            const emotionStyle = getEmotionStyle(dayDate);
            const isToday = dayDate.toDateString() === new Date().toDateString();
            
            return (
              <div className="relative w-full h-full">
                <button 
                  {...props} 
                  className={`
                    ${props.className || ''} 
                    flex items-center justify-center w-full h-full
                    after:absolute after:inset-[15%] after:rounded-md after:transition-colors after:duration-200
                    hover:after:bg-primary/10 dark:hover:after:bg-primary/20
                    group-hover:font-medium
                  `}
                >
                  <span className="relative z-10">
                    {dayDate.getDate()}
                  </span>
                </button>
                {emotionStyle && (
                  <div 
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-transform duration-200 group-hover:scale-125 ${emotionStyle.emotion}`}
                  />
                )}
              </div>
            );
          }
        }}
      />
    </Card>
  );
};