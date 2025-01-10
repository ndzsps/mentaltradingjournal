import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SessionProgress } from "./SessionProgress";
import { PostSessionSection } from "./PostSessionSection";
import { ProgressStats } from "./ProgressStats";
import { useJournalFormSubmission } from "./JournalFormSubmission";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { SessionTypeSelector } from "./SessionTypeSelector";
import { PreTradingActivities } from "./PreTradingActivities";
import { EmotionSelector } from "./EmotionSelector";
import { emotions, tradingOutcome, mistakeCategories, tradingRules } from "./emotionConfig";
import { AddTradeDialog } from "../analytics/AddTradeDialog";
import { Trade } from "@/types/trade";
import { FormSubmissionSection } from "./FormSubmissionSection";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

const PRE_TRADING_ACTIVITIES = [
  "Meditation",
  "Exercise",
  "News Reading",
  "Market Analysis",
  "Trading Plan Review"
];

export const EmotionLogger = () => {
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [sessionType, setSessionType] = useState<"pre" | "post">("pre");
  const [selectedMistakes, setSelectedMistakes] = useState<string[]>([]);
  const [marketConditions, setMarketConditions] = useState("");
  const [followedRules, setFollowedRules] = useState<string[]>([]);
  const [preTradingActivities, setPreTradingActivities] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showAddTradeDialog, setShowAddTradeDialog] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  
  const { stats } = useProgressTracking();

  const resetForm = () => {
    setSelectedEmotion("");
    setSelectedOutcome("");
    setNotes("");
    setSelectedMistakes([]);
    setMarketConditions("");
    setFollowedRules([]);
    setPreTradingActivities([]);
    setTrades([]);
  };

  const { handleSubmit } = useJournalFormSubmission({
    sessionType,
    selectedEmotion,
    selectedEmotionDetail: "", // We'll pass an empty string since we're removing the detail
    notes,
    selectedOutcome,
    marketConditions,
    followedRules,
    selectedMistakes,
    preTradingActivities,
    trades,
    resetForm,
    onSubmitSuccess: () => {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    },
  });

  const handleSessionTypeChange = (value: "pre" | "post") => {
    setSessionType(value);
    setShowCelebration(false);
  };

  const handleTradeSubmit = (tradeData: Trade) => {
    setTrades([...trades, tradeData]);
    setShowAddTradeDialog(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
      <Card className="p-8 space-y-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              {sessionType === "pre" ? "Pre-Session Check-in" : "Post-Session Review"}
            </h2>
            {sessionType === "pre" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-5 h-5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] p-4">
                    <p>Pre-sessions are designed to be completed daily before your post-session entry to help you track your mood. Many traders overlook this step, but it plays a significant role in improving your performance and decision-making over time.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <SessionTypeSelector
            sessionType={sessionType}
            onSessionTypeChange={handleSessionTypeChange}
          />

          <SessionProgress 
            emotionSelected={!!selectedEmotion}
            emotionDetailSelected={true} // We'll always pass true since we removed this step
            activitiesSelected={preTradingActivities.length > 0}
            notesEntered={notes.length > 0}
            outcomeSelected={!!selectedOutcome}
            marketConditionsSelected={!!marketConditions}
            rulesSelected={followedRules.length > 0}
            mistakesReviewed={selectedMistakes.length > 0 || selectedOutcome !== "loss"}
            tradesAdded={trades.length > 0 || selectedOutcome === "no_trades"}
            isPostSession={sessionType === "post"}
            showCelebration={showCelebration}
          />
        </div>

        {sessionType === "pre" && (
          <PreTradingActivities
            activities={PRE_TRADING_ACTIVITIES}
            selectedActivities={preTradingActivities}
            onActivityChange={setPreTradingActivities}
          />
        )}
        
        <div className="space-y-6">
          <EmotionSelector
            selectedEmotion={selectedEmotion}
            onEmotionSelect={setSelectedEmotion}
          />

          {sessionType === "post" && (
            <>
              <PostSessionSection
                selectedOutcome={selectedOutcome}
                setSelectedOutcome={setSelectedOutcome}
                marketConditions={marketConditions}
                setMarketConditions={setMarketConditions}
                followedRules={followedRules}
                setFollowedRules={setFollowedRules}
                selectedMistakes={selectedMistakes}
                setSelectedMistakes={setSelectedMistakes}
                tradingOutcome={tradingOutcome}
                mistakeCategories={mistakeCategories}
                tradingRules={tradingRules}
                onAddTrade={() => setShowAddTradeDialog(true)}
                trades={trades}
              />

              <AddTradeDialog
                open={showAddTradeDialog}
                onOpenChange={setShowAddTradeDialog}
                onSubmit={handleTradeSubmit}
              />
            </>
          )}

          <FormSubmissionSection
            sessionType={sessionType}
            notes={notes}
            setNotes={setNotes}
            trades={trades}
            handleSubmit={handleSubmit}
            selectedOutcome={selectedOutcome}
          />
        </div>
      </Card>

      <ProgressStats 
        preSessionStreak={stats.preSessionStreak}
        postSessionStreak={stats.postSessionStreak}
        dailyStreak={stats.dailyStreak}
        level={stats.level}
        levelProgress={stats.levelProgress}
      />
    </div>
  );
};