import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { emotions } from "@/components/journal/emotionConfig";
import { subMonths, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import { JournalCalendar } from "@/components/journal/JournalCalendar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type TimeFilter = "this-month" | "last-month" | "last-three-months" | null;

interface JournalEntry {
  id: string;
  created_at: string;
  session_type: string;
  emotion: string;
  emotion_detail: string;
  notes: string;
  outcome?: string;
  market_conditions?: string;
  followed_rules?: string[];
  mistakes?: string[];
  pre_trading_activities?: string[];
}

const Journal = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [emotionFilter, setEmotionFilter] = useState<string | null>(null);
  const [detailFilter, setDetailFilter] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const { user } = useAuth();

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

      setEntries(data || []);
    };

    fetchEntries();

    // Subscribe to realtime updates
    const subscription = supabase
      .channel('journal_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
        },
        () => {
          fetchEntries(); // Refetch entries when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  
  const filteredEntries = entries.filter(entry => {
    const matchesEmotion = !emotionFilter || entry.emotion === emotionFilter;
    const matchesDetail = !detailFilter || entry.emotion_detail === detailFilter;
    
    let matchesTimeFilter = true;
    if (timeFilter) {
      const now = new Date();
      const intervals: Record<Exclude<TimeFilter, null>, { start: Date; end: Date }> = {
        "this-month": {
          start: startOfMonth(now),
          end: endOfMonth(now)
        },
        "last-month": {
          start: startOfMonth(subMonths(now, 1)),
          end: endOfMonth(subMonths(now, 1))
        },
        "last-three-months": {
          start: startOfMonth(subMonths(now, 3)),
          end: endOfMonth(now)
        }
      };

      if (timeFilter) {
        const interval = intervals[timeFilter];
        const entryDate = new Date(entry.created_at);
        matchesTimeFilter = isWithinInterval(entryDate, interval);
      }
    }

    return matchesEmotion && matchesDetail && matchesTimeFilter;
  });

  // Get all unique emotion details for filtering
  const allDetails = Array.from(new Set(entries.map(entry => entry.emotion_detail)));

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

        <div className="grid lg:grid-cols-2 gap-8">
          <JournalCalendar 
            date={date}
            onDateSelect={setDate}
            entries={filteredEntries.map(entry => ({
              date: new Date(entry.created_at),
              emotion: entry.emotion
            }))}
          />

          <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                Journal Entries
              </h2>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Time Period <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by Time</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTimeFilter(null)}>
                      All Time
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeFilter("this-month")}>
                      This Month
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeFilter("last-month")}>
                      Last Month
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeFilter("last-three-months")}>
                      Last Three Months
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Emotion <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by Emotion</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setEmotionFilter(null)}>
                      All Emotions
                    </DropdownMenuItem>
                    {emotions.map(emotion => (
                      <DropdownMenuItem 
                        key={emotion.value}
                        onClick={() => setEmotionFilter(emotion.label)}
                      >
                        {emotion.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      Detail <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by Detail</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setDetailFilter(null)}>
                      All Details
                    </DropdownMenuItem>
                    {allDetails.map(detail => (
                      <DropdownMenuItem 
                        key={detail}
                        onClick={() => setDetailFilter(detail)}
                      >
                        {detail}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <ScrollArea className="h-[600px] pr-4">
              {filteredEntries.length > 0 ? (
                <div className="space-y-4">
                  {filteredEntries.map((entry) => (
                    <div key={entry.id} className="p-4 rounded-lg bg-background/50 border border-primary/10">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={entry.session_type === 'pre' ? 'default' : 'secondary'}>
                          {entry.session_type === 'pre' ? 'Pre-Session' : 'Post-Session'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="font-medium text-foreground mb-1">
                        Feeling: {entry.emotion} - {entry.emotion_detail}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {entry.notes}
                      </p>
                      {entry.outcome && (
                        <p className="mt-2 text-sm">
                          <span className="font-medium">Outcome:</span> {entry.outcome}
                        </p>
                      )}
                      {entry.market_conditions && (
                        <p className="text-sm">
                          <span className="font-medium">Market Conditions:</span> {entry.market_conditions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No entries found matching your filters
                </p>
              )}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Journal;