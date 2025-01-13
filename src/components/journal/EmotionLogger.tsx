import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SessionProgress } from "./SessionProgress";
import { PreTradingActivities } from "./PreTradingActivities";
import { useJournalFormSubmission } from "./JournalFormSubmission";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { Trade } from "@/types/trade";
import { FormSubmissionSection } from "./FormSubmissionSection";
import { FormHeader } from "./form/FormHeader";
import { EmotionSection } from "./form/EmotionSection";
import { PostSessionFormSection } from "./form/PostSessionFormSection";
import { ProgressStats } from "./ProgressStats";

const PRE_TRADING_ACTIVITIES = [
  "Meditation",
  "Exercise",
  "Market Analysis",
  "Trading Plan Review"
];

export const EmotionLogger = () => {
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedEmotionDetail, setSelectedEmotionDetail] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [customDetails, setCustomDetails] = useState<string[]>([]);
  const [sessionType, setSessionType] = useState<"pre" | "post">("pre");
  const [selectedMistakes, setSelectedMistakes] = useState<string[]>([]);
  const [followedRules, setFollowedRules] = useState<string[]>([]);
  const [preTradingActivities, setPreTradingActivities] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showAddTradeDialog, setShowAddTradeDialog] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  
  const { stats } = useProgressTracking();

  const resetForm = () => {
    setSelectedEmotion("");
    setSelectedEmotionDetail("");
    setSelectedOutcome("");
    setNotes("");
    setSelectedMistakes([]);
    setFollowedRules([]);
    setPreTradingActivities([]);
    setTrades([]);
  };

  const { handleSubmit } = useJournalFormSubmission({
    sessionType,
    selectedEmotion,
    selectedEmotionDetail,
    notes,
    selectedOutcome,
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

  const handleEmotionSelect = (value: string) => {
    setSelectedEmotion(value);
    if (sessionType === "post") {
      setIsDetailDialogOpen(true);
    } else {
      setSelectedEmotionDetail(value);
    }
  };

  const handleDetailSelect = (detail: string) => {
    setSelectedEmotionDetail(detail);
    setIsDetailDialogOpen(false);
  };

  const handleCustomDetailAdd = (detail: string) => {
    if (!customDetails.includes(detail)) {
      setCustomDetails([...customDetails, detail]);
    }
  };

  const handleTradeSubmit = (tradeData: Trade) => {
    setTrades([...trades, tradeData]);
    setShowAddTradeDialog(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
      <Card className="p-8 space-y-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
        <FormHeader 
          sessionType={sessionType}
          onSessionTypeChange={setSessionType}
        />

        <SessionProgress 
          emotionSelected={!!selectedEmotion}
          emotionDetailSelected={!!selectedEmotionDetail}
          activitiesSelected={preTradingActivities.length > 0}
          notesEntered={notes.length > 0}
          outcomeSelected={!!selectedOutcome}
          rulesSelected={followedRules.length > 0}
          mistakesReviewed={selectedMistakes.length > 0 || selectedOutcome !== "loss"}
          tradesAdded={trades.length > 0 || selectedOutcome === "no_trades"}
          isPostSession={sessionType === "post"}
          showCelebration={showCelebration}
        />

        {sessionType === "pre" && (
          <PreTradingActivities
            activities={PRE_TRADING_ACTIVITIES}
            selectedActivities={preTradingActivities}
            onActivityChange={setPreTradingActivities}
          />
        )}
        
        <div className="space-y-6">
          <EmotionSection
            sessionType={sessionType}
            selectedEmotion={selectedEmotion}
            selectedEmotionDetail={selectedEmotionDetail}
            isDetailDialogOpen={isDetailDialogOpen}
            customDetails={customDetails}
            onEmotionSelect={handleEmotionSelect}
            onDetailSelect={handleDetailSelect}
            onDetailDialogOpenChange={setIsDetailDialogOpen}
            onCustomDetailAdd={handleCustomDetailAdd}
          />

          {sessionType === "post" && (
            <PostSessionFormSection
              selectedOutcome={selectedOutcome}
              setSelectedOutcome={setSelectedOutcome}
              followedRules={followedRules}
              setFollowedRules={setFollowedRules}
              selectedMistakes={selectedMistakes}
              setSelectedMistakes={setSelectedMistakes}
              showAddTradeDialog={showAddTradeDialog}
              setShowAddTradeDialog={setShowAddTradeDialog}
              trades={trades}
              onTradeSubmit={handleTradeSubmit}
            />
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