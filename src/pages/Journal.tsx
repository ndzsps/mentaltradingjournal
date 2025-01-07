import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JournalCalendar } from "@/components/journal/JournalCalendar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntry } from "@/components/journal/JournalEntry";
import { JournalFilters } from "@/components/journal/JournalFilters";
import { useJournalFilters } from "@/hooks/useJournalFilters";
import { JournalEntryType } from "@/types/journal";

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const { user } = useAuth();
  const {
    selectedDate,
    setSelectedDate,
    emotionFilter,
    setEmotionFilter,
    detailFilter,
    setDetailFilter,
    timeFilter,
    setTimeFilter,
    outcomeFilter,
    setOutcomeFilter,
    filteredEntries
  } = useJournalFilters(entries);

  useEffect(() => {
    if (!user) return;

    const fetchEntries = async () => {
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

    fetchEntries();

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
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  console.log('Selected date:', selectedDate);
  console.log('Filtered entries:', filteredEntries);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8 px-4">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            Trading Journal
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your emotional journey through your trading sessions
          </p>
        </div>

        <JournalCalendar 
          date={selectedDate}
          onDateSelect={setSelectedDate}
          entries={entries.map(entry => ({
            date: new Date(entry.created_at),
            emotion: entry.emotion,
            trades: entry.trades
          }))}
        />

        <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              Journal Entries
            </h2>
            <JournalFilters
              emotionFilter={emotionFilter}
              setEmotionFilter={setEmotionFilter}
              detailFilter={detailFilter}
              setDetailFilter={setDetailFilter}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
              outcomeFilter={outcomeFilter}
              setOutcomeFilter={setOutcomeFilter}
              allDetails={Array.from(new Set(entries.map(entry => entry.emotion_detail)))}
            />
          </div>
          
          <ScrollArea className="h-[600px] pr-4">
            {filteredEntries.length > 0 ? (
              <div className="space-y-4">
                {filteredEntries.map((entry) => (
                  <JournalEntry key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No entries found for the selected filters
              </p>
            )}
          </ScrollArea>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Journal;
