import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Smile, 
  Meh, 
  Frown,
  ThumbsUp,
  ThumbsDown,
  MinusCircle
} from "lucide-react";

const emotions = [
  { icon: Smile, label: "Positive", value: "positive" },
  { icon: Meh, label: "Neutral", value: "neutral" },
  { icon: Frown, label: "Negative", value: "negative" },
];

const tradingOutcome = [
  { icon: ThumbsUp, label: "Win", value: "win" },
  { icon: ThumbsDown, label: "Loss", value: "loss" },
  { icon: MinusCircle, label: "No Trades", value: "no_trades" },
];

export const EmotionLogger = () => {
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!selectedEmotion || !notes) {
      toast({
        title: "Missing Information",
        description: "Please select an emotion and add notes.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Entry Logged",
      description: "Your trading journal entry has been saved.",
    });

    setSelectedEmotion("");
    setSelectedOutcome("");
    setNotes("");
  };

  return (
    <Card className="p-8 space-y-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
        How are you feeling?
      </h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {emotions.map(({ icon: Icon, label, value }) => (
            <Button
              key={value}
              variant={selectedEmotion === value ? "default" : "outline"}
              className={`h-24 group transition-all duration-300 ${
                selectedEmotion === value 
                  ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" 
                  : "hover:border-primary/50 hover:bg-primary/5"
              }`}
              onClick={() => setSelectedEmotion(value)}
            >
              <div className="flex flex-col items-center gap-3">
                <Icon className={`w-8 h-8 transition-transform duration-300 group-hover:scale-110 ${
                  selectedEmotion === value ? "" : "text-primary"
                }`} />
                <span className="font-medium">{label}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {tradingOutcome.map(({ icon: Icon, label, value }) => (
            <Button
              key={value}
              variant={selectedOutcome === value ? "default" : "outline"}
              className={`h-20 group transition-all duration-300 ${
                selectedOutcome === value 
                  ? "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20" 
                  : "hover:border-accent/50 hover:bg-accent/5"
              }`}
              onClick={() => setSelectedOutcome(value)}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${
                  selectedOutcome === value ? "" : "text-accent-foreground/70"
                }`} />
                <span className="font-medium">{label}</span>
              </div>
            </Button>
          ))}
        </div>

        <Textarea
          placeholder="What's on your mind? Describe your trading mindset..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[120px] bg-card/50 border-primary/10 focus-visible:ring-primary/30 resize-none"
        />

        <Button 
          onClick={handleSubmit}
          className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
        >
          Log Entry
        </Button>
      </div>
    </Card>
  );
};