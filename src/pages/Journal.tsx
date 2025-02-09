
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JournalCalendar } from "@/components/journal/JournalCalendar";
import { WeeklyPerformance } from "@/components/journal/WeeklyPerformance";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntry } from "@/components/journal/JournalEntry";
import { JournalFilters } from "@/components/journal/JournalFilters";
import { useJournalFilters } from "@/hooks/useJournalFilters";
import { JournalEntryType } from "@/types/journal";
import { StatsHeader } from "@/components/journal/stats/StatsHeader";
import { TimeFilterProvider } from "@/contexts/TimeFilterContext";
import { parseISO, isSameDay, startOfDay } from "date-fns";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const { user } = useAuth();
  const {
    selectedDate,
    setSelectedDate,
    filteredEntries
  } = useJournalFilters(entries);

  useEffect(() => {
    if (!user) return;

    const fetchEntries = async () => {
      console.log('Fetching entries for user:', user.id);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching journal entries:', error);
        return;
      }

      console.log('Fetched entries:', data);
      setEntries(data || []);
    };

    fetchEntries();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('journal_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Create an array of entries and individual trades for the selected date
  const displayedEntries = selectedDate
    ? filteredEntries.reduce<JournalEntryType[]>((acc, entry) => {
        const entriesForDate: JournalEntryType[] = [];
        
        // Check if entry has trades
        if (entry.trades && entry.trades.length > 0) {
          // Get all trades for the selected date
          const tradesForDate = entry.trades.filter(trade => {
            if (!trade.entryDate) return false;
            const tradeDate = parseISO(trade.entryDate);
            return isSameDay(tradeDate, selectedDate);
          });

          // If there are trades for this date, create a new entry with just those trades
          if (tradesForDate.length > 0) {
            entriesForDate.push({
              ...entry,
              trades: tradesForDate
            });
          }
        }

        // Also include the entry itself if it was created on the selected date
        // and doesn't duplicate any trades we've already added
        if (isSameDay(parseISO(entry.created_at), selectedDate)) {
          const nonMatchingTrades = entry.trades?.filter(trade => 
            !trade.entryDate || !isSameDay(parseISO(trade.entryDate), selectedDate)
          ) || [];

          if (!entry.trades || nonMatchingTrades.length > 0) {
            entriesForDate.push({
              ...entry,
              trades: nonMatchingTrades
            });
          }
        }

        return [...acc, ...entriesForDate];
      }, [])
    : filteredEntries;

  const calendarEntries = entries.flatMap(entry => {
    const calendarItems = [];
    
    // Add entries for each trade's date
    if (entry.trades && entry.trades.length > 0) {
      entry.trades.forEach(trade => {
        if (trade.entryDate) {
          calendarItems.push({
            date: parseISO(trade.entryDate),
            emotion: entry.emotion,
            trades: [trade]
          });
        }
      });
    }
    
    // Add entry for the journal entry creation date
    calendarItems.push({
      date: parseISO(entry.created_at),
      emotion: entry.emotion,
      trades: entry.trades
    });
    
    return calendarItems;
  });

  return (
    <AppLayout>
      <SubscriptionGate>
        <TimeFilterProvider>
          <div className="max-w-7xl mx-auto space-y-8 px-4">
            <StatsHeader />

            <div className="flex gap-6">
              <div className="flex-1">
                <JournalCalendar 
                  date={selectedDate}
                  onDateSelect={setSelectedDate}
                  entries={calendarEntries}
                />
              </div>
              <div className="w-64">
                <WeeklyPerformance />
              </div>
            </div>

            <Card id="journal-entries" className="p-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                  {selectedDate 
                    ? `Journal Entries for ${selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}`
                    : 'Journal Entries'
                  }
                </h2>
                <JournalFilters />
              </div>
              
              <ScrollArea className="h-[600px] pr-4">
                {displayedEntries.length > 0 ? (
                  <div className="space-y-4">
                    {displayedEntries.map((entry) => (
                      <JournalEntry key={entry.id} entry={entry} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    {selectedDate 
                      ? `No entries found for ${selectedDate.toLocaleDateString()}`
                      : 'No entries found for the selected filters'
                    }
                  </p>
                )}
              </ScrollArea>
            </Card>
          </div>
        </TimeFilterProvider>
      </SubscriptionGate>
    </AppLayout>
  );
};

export default Journal;
