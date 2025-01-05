import { AppLayout } from "@/components/layout/AppLayout";
import { EmotionLogger } from "@/components/journal/EmotionLogger";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Smile, Meh, Frown } from "lucide-react";

const Journal = () => {
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
      <div className="max-w-7xl mx-auto space-y-8 px-4">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            Trading Journal
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your emotions and improve your trading mindset
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent mb-6">
              Trading Calendar
            </h2>
            <div className="space-y-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-primary/10"
                modifiers={{
                  positive: (date) => {
                    const emotion = getEmotionForDate(date);
                    return emotion?.emotion === "positive";
                  },
                  neutral: (date) => {
                    const emotion = getEmotionForDate(date);
                    return emotion?.emotion === "neutral";
                  },
                  negative: (date) => {
                    const emotion = getEmotionForDate(date);
                    return emotion?.emotion === "negative";
                  },
                }}
                modifiersStyles={{
                  positive: {
                    color: "var(--primary)",
                    fontWeight: "bold",
                    backgroundColor: "transparent",
                    position: "relative"
                  },
                  neutral: {
                    color: "var(--accent)",
                    fontWeight: "bold",
                    backgroundColor: "transparent",
                    position: "relative"
                  },
                  negative: {
                    color: "var(--destructive)",
                    fontWeight: "bold",
                    backgroundColor: "transparent",
                    position: "relative"
                  },
                }}
                classNames={{
                  day: "relative before:absolute before:inset-0 before:z-[-1] before:rounded-full hover:before:bg-accent/20",
                  day_selected: "before:bg-primary before:opacity-20",
                  day_today: "before:bg-accent before:opacity-20",
                  day_positive: "before:bg-primary before:opacity-20",
                  day_neutral: "before:bg-accent before:opacity-20",
                  day_negative: "before:bg-destructive before:opacity-20",
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

          <EmotionLogger />
        </div>
      </div>
    </AppLayout>
  );
};

export default Journal;