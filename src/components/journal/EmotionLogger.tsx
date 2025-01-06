import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { emotions, tradingOutcome, mistakeCategories, tradingRules } from "./emotionConfig";
import { EmotionDetailDialog } from "./EmotionDetailDialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PreSessionProgress } from "./PreSessionProgress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const EmotionLogger = () => {
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedEmotionDetail, setSelectedEmotionDetail] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [customDetails, setCustomDetails] = useState<string[]>([]);
  const [sessionType, setSessionType] = useState<"pre" | "post">("pre");
  const [selectedMistakes, setSelectedMistakes] = useState<string[]>([]);
  const [marketConditions, setMarketConditions] = useState("");
  const [followedRules, setFollowedRules] = useState<string[]>([]);
  const [preTradingActivities, setPreTradingActivities] = useState<string[]>([]);
  const { toast } = useToast();

  const handleEmotionSelect = (value: string) => {
    setSelectedEmotion(value);
    setIsDetailDialogOpen(true);
  };

  const handleDetailSelect = (detail: string) => {
    setSelectedEmotionDetail(detail);
    setIsDetailDialogOpen(false);
    toast({
      description: (
        <div className="space-y-1">
          <p className="font-bold">You're feeling {detail.toLowerCase()}</p>
          <p className="italic">Remember, tough times are temporary. I'm here for you! 💪</p>
        </div>
      ),
    });
  };

  const handleCustomDetailAdd = (detail: string) => {
    if (!customDetails.includes(detail)) {
      setCustomDetails([...customDetails, detail]);
    }
  };

  const handleSubmit = () => {
    if (!selectedEmotion || !selectedEmotionDetail || !notes) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Create journal entry object
    const journalEntry = {
      emotion: selectedEmotion,
      emotionDetail: selectedEmotionDetail,
      outcome: selectedOutcome,
      notes,
      sessionType,
      timestamp: new Date(),
      marketConditions,
      followedRules,
      mistakes: selectedMistakes,
      preTradingActivities,
    };

    console.log("Journal Entry:", journalEntry);

    toast({
      description: "Your trading journal entry has been saved.",
    });

    // Reset form
    setSelectedEmotion("");
    setSelectedEmotionDetail("");
    setSelectedOutcome("");
    setNotes("");
    setSelectedMistakes([]);
    setMarketConditions("");
    setFollowedRules([]);
    setPreTradingActivities([]);
  };

  return (
    <Card className="p-8 space-y-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
          {sessionType === "pre" ? "Pre-Session Check-in" : "Post-Session Review"}
        </h2>
        
        <RadioGroup
          defaultValue="pre"
          value={sessionType}
          onValueChange={(value) => setSessionType(value as "pre" | "post")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pre" id="pre" />
            <Label htmlFor="pre" className="font-medium">Pre-Session</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="post" id="post" />
            <Label htmlFor="post" className="font-medium">Post-Session</Label>
          </div>
        </RadioGroup>

        {sessionType === "pre" && (
          <PreSessionProgress 
            emotionSelected={!!selectedEmotion}
            emotionDetailSelected={!!selectedEmotionDetail}
            activitiesSelected={preTradingActivities.length > 0}
            notesEntered={notes.length > 0}
          />
        )}
      </div>

      {sessionType === "pre" && (
        <div className="space-y-4">
          <Label className="text-lg font-medium">Pre-Trading Activities</Label>
          <div className="grid grid-cols-2 gap-4">
            {["Meditation", "Exercise", "News Reading", "Market Analysis", "Trading Plan Review"].map((activity) => (
              <div key={activity} className="flex items-center space-x-2">
                <Checkbox
                  id={activity}
                  checked={preTradingActivities.includes(activity)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setPreTradingActivities([...preTradingActivities, activity]);
                    } else {
                      setPreTradingActivities(preTradingActivities.filter(a => a !== activity));
                    }
                  }}
                />
                <Label htmlFor={activity}>{activity}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
      
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
              onClick={() => handleEmotionSelect(value)}
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

        <EmotionDetailDialog
          isOpen={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          details={selectedEmotion ? emotions.find(e => e.value === selectedEmotion)?.details || [] : []}
          onDetailSelect={handleDetailSelect}
          selectedDetail={selectedEmotionDetail}
          customDetails={customDetails}
          onCustomDetailAdd={handleCustomDetailAdd}
        />

        {sessionType === "post" && (
          <>
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

            <div className="space-y-4">
              <Label className="text-lg font-medium">Market Conditions</Label>
              <Select value={marketConditions} onValueChange={setMarketConditions}>
                <SelectTrigger>
                  <SelectValue placeholder="Select market conditions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low_volatility">Low Volatility</SelectItem>
                  <SelectItem value="medium_volatility">Medium Volatility</SelectItem>
                  <SelectItem value="high_volatility">High Volatility</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="ranging">Ranging</SelectItem>
                  <SelectItem value="news_driven">News Driven</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Trading Rules Followed</Label>
              <div className="grid grid-cols-2 gap-4">
                {tradingRules.map((rule) => (
                  <div key={rule.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={rule.value}
                      checked={followedRules.includes(rule.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFollowedRules([...followedRules, rule.value]);
                        } else {
                          setFollowedRules(followedRules.filter(r => r !== rule.value));
                        }
                      }}
                    />
                    <Label htmlFor={rule.value}>{rule.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {selectedOutcome === "loss" && (
              <div className="space-y-4">
                <Label className="text-lg font-medium">Mistake Categories</Label>
                <div className="grid grid-cols-2 gap-4">
                  {mistakeCategories.map((mistake) => (
                    <div key={mistake.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={mistake.value}
                        checked={selectedMistakes.includes(mistake.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedMistakes([...selectedMistakes, mistake.value]);
                          } else {
                            setSelectedMistakes(selectedMistakes.filter(m => m !== mistake.value));
                          }
                        }}
                      />
                      <Label htmlFor={mistake.value}>{mistake.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <Textarea
          placeholder={sessionType === "pre" 
            ? "How are you feeling before starting your trading session?" 
            : "Reflect on your trading session. How do you feel about your performance and decisions?"
          }
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[120px] bg-card/50 border-primary/10 focus-visible:ring-primary/30 resize-none"
        />

        <Button 
          onClick={handleSubmit}
          className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
        >
          Log {sessionType === "pre" ? "Pre" : "Post"}-Session Entry
        </Button>
      </div>
    </Card>
  );
};