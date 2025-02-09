
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarDay } from "./calendar/CalendarDay";
import { CalendarNavigation } from "./calendar/CalendarNavigation";
import { Trade } from "@/types/trade";

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
        async (payload) => {
          console.log('Real-time update received:', payload);
          // Immediately refetch data when changes occur
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['journal-entries'] }),
            queryClient.invalidateQueries({ queryKey: ['analytics'] }),
            queryClient.invalidateQueries({ queryKey: ['weekly-performance'] })
          ]);
          await queryClient.refetchQueries({ queryKey: ['journal-entries'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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

  const navigation = CalendarNavigation();

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
            IconLeft: navigation.IconLeft,
            IconRight: navigation.IconRight,
            Day: ({ date: dayDate, ...props }) => (
              <CalendarDay
                date={dayDate}
                entries={entries}
                onSelect={handleDateSelect}
                {...props}
              />
            ),
          }}
        />
      </Card>
    </TooltipProvider>
  );
};
