import { AppLayout } from "@/components/layout/AppLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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

// This would come from your database in a real app
const sampleEntries = [
  { 
    date: new Date(2024, 2, 15), 
    type: "pre", 
    emotion: "Focused",
    detail: "Ready to trade",
    notes: "Starting the day with a clear mind"
  },
  { 
    date: new Date(2024, 2, 15), 
    type: "post", 
    emotion: "Satisfied",
    detail: "Achieved goals",
    notes: "Made good decisions today"
  },
  { 
    date: new Date(2024, 2, 16), 
    type: "pre", 
    emotion: "Anxious",
    detail: "Career pressures",
    notes: "Feeling pressure from recent losses"
  },
  { 
    date: new Date(2024, 2, 16), 
    type: "post", 
    emotion: "Calm",
    detail: "Market understanding",
    notes: "Managed to stay disciplined"
  },
];

const Journal = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [emotionFilter, setEmotionFilter] = useState<string | null>(null);
  const [detailFilter, setDetailFilter] = useState<string | null>(null);
  
  // Get entries for the selected date
  const selectedDateEntries = sampleEntries
    .filter(entry => date && entry.date.toDateString() === date.toDateString())
    .filter(entry => !emotionFilter || entry.emotion === emotionFilter)
    .filter(entry => !detailFilter || entry.detail === detailFilter);

  // Get all unique emotion details for filtering
  const allDetails = Array.from(new Set(sampleEntries.map(entry => entry.detail)));

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
                  sampleEntries.some(entry => 
                    entry.date.toDateString() === date.toDateString()
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
                {date ? date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Select a date'}
              </h2>
              <div className="flex gap-2">
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
            
            {selectedDateEntries.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEntries.map((entry, index) => (
                  <div key={index} className="p-4 rounded-lg bg-background/50 border border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={entry.type === 'pre' ? 'default' : 'secondary'}>
                        {entry.type === 'pre' ? 'Pre-Session' : 'Post-Session'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {entry.date.toLocaleTimeString()}
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
                No entries for this date
              </p>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Journal;