import { AppLayout } from "@/components/layout/AppLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
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

// This would come from your database in a real app
const sampleEntries = [
  { 
    date: new Date(2024, 2, 15), 
    type: "pre", 
    emotion: "Positive",
    detail: "Confident",
    notes: "Starting the day with a clear mind"
  },
  { 
    date: new Date(2024, 2, 15), 
    type: "post", 
    emotion: "Positive",
    detail: "Motivated",
    notes: "Made good decisions today"
  },
  { 
    date: new Date(2024, 2, 16), 
    type: "pre", 
    emotion: "Negative",
    detail: "Career pressure",
    notes: "Feeling pressure from recent losses"
  },
  { 
    date: new Date(2024, 2, 16), 
    type: "post", 
    emotion: "Neutral",
    detail: "Calm",
    notes: "Managed to stay disciplined"
  },
];

type TimeFilter = "this-month" | "last-month" | "last-three-months" | null;

const Journal = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [emotionFilter, setEmotionFilter] = useState<string | null>(null);
  const [detailFilter, setDetailFilter] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(null);
  
  // Filter entries based on emotion, detail, and time period
  const filteredEntries = sampleEntries.filter(entry => {
    const matchesEmotion = !emotionFilter || entry.emotion === emotionFilter;
    const matchesDetail = !detailFilter || entry.detail === detailFilter;
    
    let matchesTimeFilter = true;
    if (timeFilter) {
      const now = new Date();
      const intervals: Record<TimeFilter, { start: Date; end: Date } | null> = {
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
        },
        "null": null
      };

      const interval = intervals[timeFilter];
      if (interval) {
        matchesTimeFilter = isWithinInterval(entry.date, interval);
      }
    }

    return matchesEmotion && matchesDetail && matchesTimeFilter;
  });

  // Get all unique emotion details for filtering
  const allDetails = Array.from(new Set(sampleEntries.map(entry => entry.detail)));

  // Get dates that have entries matching the current filters
  const datesWithMatchingEntries = filteredEntries.map(entry => entry.date);

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
          <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md w-full"
              modifiers={{
                hasEntry: (date) => 
                  datesWithMatchingEntries.some(entryDate => 
                    entryDate.toDateString() === date.toDateString()
                  ),
              }}
              modifiersStyles={{
                hasEntry: {
                  fontWeight: 'bold',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '0.5rem',
                }
              }}
            />
          </Card>

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
                  {filteredEntries.map((entry, index) => (
                    <div key={index} className="p-4 rounded-lg bg-background/50 border border-primary/10">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={entry.type === 'pre' ? 'default' : 'secondary'}>
                          {entry.type === 'pre' ? 'Pre-Session' : 'Post-Session'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {entry.date.toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="font-medium text-foreground mb-1">
                        Feeling: {entry.emotion} - {entry.detail}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {entry.notes}
                      </p>
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