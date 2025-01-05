import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Happy, 
  Meh, 
  Frown,
  ThumbsUp,
  ThumbsDown 
} from "lucide-react";

const emotions = [
  { icon: Happy, label: "Positive", value: "positive" },
  { icon: Meh, label: "Neutral", value: "neutral" },
  { icon: Frown, label: "Negative", value: "negative" },
];

const tradingOutcome = [
  { icon: ThumbsUp, label: "Profitable", value: "profitable" },
  { icon: ThumbsDown, label: "Loss", value: "loss" },
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

    // Reset form
    setSelectedEmotion("");
    setSelectedOutcome("");
    setNotes("");
  };

  return (
    <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm animate-fade-in">
      <h2 className="text-2xl font-semibold text-primary">How are you feeling?</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          {emotions.map(({ icon: Icon, label, value }) => (
            <Button
              key={value}
              variant={selectedEmotion === value ? "default" : "outline"}
              className={`flex-1 h-20 ${
                selectedEmotion === value ? "bg-primary text-white" : ""
              }`}
              onClick={() => setSelectedEmotion(value)}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon className="w-6 h-6" />
                <span>{label}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="flex gap-4">
          {tradingOutcome.map(({ icon: Icon, label, value }) => (
            <Button
              key={value}
              variant={selectedOutcome === value ? "default" : "outline"}
              className={`flex-1 h-16 ${
                selectedOutcome === value ? "bg-secondary text-white" : ""
              }`}
              onClick={() => setSelectedOutcome(value)}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </div>
            </Button>
          ))}
        </div>

        <Textarea
          placeholder="What's on your mind? Describe your trading mindset..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[120px]"
        />

        <Button 
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary-dark"
        >
          Log Entry
        </Button>
      </div>
    </Card>
  );
};