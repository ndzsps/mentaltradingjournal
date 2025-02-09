
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
import { startOfDay, endOfDay } from "date-fns";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const { user } = useAuth();
  const {
    selectedDate,
    setSelectedDate,
    filteredEntries
  } = useJournalFilters(entries);

  const fetchEntries = async () => {
    if (!user) return;
    
    console.log('Fetching entries for user:', user.id);
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries:', error);
      return;
    }

    console.log('Fetched entries:', data);
    setEntries(data || []);
  };

  useEffect(() => {
    if (!user) return;

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
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          // Immediately refresh entries when any change occurs
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Filter entries for the selected date based on trade entry dates
  const displayedEntries = selectedDate
    ? entries.filter(entry => {
        // If this is a trade entry, check the trade entry dates
        if (entry.trades && entry.trades.length > 0) {
          return entry.trades.some(trade => {
            if (!trade.entryDate) return false;
            const tradeDate = new Date(trade.entryDate);
            const start = startOfDay(selectedDate);
            const end = endOfDay(selectedDate);
            return tradeDate >= start && tradeDate <= end;
          });
        }
        return false; // If no trades, don't show the entry
      })
    : filteredEntries;

  // Map entries for calendar display
  const calendarEntries = entries
    .filter(entry => entry.trades && entry.trades.length > 0)
    .flatMap(entry => 
      entry.trades.map(trade => ({
        date: trade.entryDate ? new Date(trade.entryDate) : new Date(entry.created_at),
        emotion: entry.emotion,
        trades: [trade]
      }))
    );

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

