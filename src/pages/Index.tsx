import { AppLayout } from "@/components/layout/AppLayout";
import { EmotionLogger } from "@/components/journal/EmotionLogger";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Smile, Meh, Frown } from "lucide-react";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // This would typically come from your backend/database
  const mockEmotionData = {
    "2024-04-10": { emotion: "positive", notes: "Great trading day! Followed my plan.", outcome: "profitable" },
    "2024-04-09": { emotion: "neutral", notes: "Mixed feelings about market conditions.", outcome: "loss" },
    "2024-04-08": { emotion: "negative", notes: "Struggled with FOMO today.", outcome: "loss" },
  };

  const getEmotionForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return mockEmotionData[dateKey];
  };

  const selectedDayEmotion = selectedDate ? getEmotionForDate(selectedDate) : null;

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case "positive":
        return <Smile className="w-5 h-5 text-primary" />;
      case "neutral":
        return <Meh className="w-5 h-5 text-accent" />;
      case "negative":
        return <Frown className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 px-4">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your trading journey and improve your mindset
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <EmotionLogger />
          
          <div className="space-y-6">
            <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent mb-6">
                Your Progress
              </h2>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Daily Streak</span>
                    <span className="text-primary-light">3 days</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary-light rounded-full" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Level Progress</span>
                    <span className="text-accent">Level 2</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-accent/70 to-accent rounded-full" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent mb-6">
                Emotion History
              </h2>
              <div className="space-y-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-primary/10"
                  modifiers={{
                    booked: (date) => getEmotionForDate(date) !== undefined,
                  }}
                  modifiersStyles={{
                    booked: {
                      fontWeight: "bold",
                      border: "2px solid var(--primary)",
                    },
                  }}
                />

                {selectedDayEmotion && (
                  <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEmotionIcon(selectedDayEmotion.emotion)}
                        <span className="font-medium capitalize">{selectedDayEmotion.emotion}</span>
                      </div>
                      <Badge variant={selectedDayEmotion.outcome === "profitable" ? "default" : "destructive"}>
                        {selectedDayEmotion.outcome}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedDayEmotion.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;