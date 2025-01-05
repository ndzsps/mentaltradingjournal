import { AppLayout } from "@/components/layout/AppLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

// This would come from your database in a real app
const sampleEntries = [
  { date: new Date(2024, 2, 15), type: "pre", emotion: "Focused" },
  { date: new Date(2024, 2, 15), type: "post", emotion: "Satisfied" },
  { date: new Date(2024, 2, 16), type: "pre", emotion: "Anxious" },
  { date: new Date(2024, 2, 16), type: "post", emotion: "Calm" },
];

const Journal = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Get entries for the selected date
  const selectedDateEntries = sampleEntries.filter(
    entry => date && entry.date.toDateString() === date.toDateString()
  );

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 px-4">
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
              className="rounded-md"
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
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              {date ? date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Select a date'}
            </h2>
            
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
                    <p className="font-medium text-foreground">
                      Feeling: {entry.emotion}
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