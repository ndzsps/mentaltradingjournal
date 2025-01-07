import { useJournalToast } from "@/hooks/useJournalToast";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Trade } from "@/types/trade";

interface JournalFormSubmissionProps {
  sessionType: "pre" | "post";
  selectedEmotion: string;
  selectedEmotionDetail: string;
  notes: string;
  selectedOutcome?: string;
  marketConditions?: string;
  followedRules?: string[];
  selectedMistakes?: string[];
  preTradingActivities: string[];
  trades: Trade[];
  resetForm: () => void;
  onSubmitSuccess?: () => void;
}

export const useJournalFormSubmission = ({
  sessionType,
  selectedEmotion,
  selectedEmotionDetail,
  notes,
  selectedOutcome,
  marketConditions,
  followedRules,
  selectedMistakes,
  preTradingActivities,
  trades,
  resetForm,
  onSubmitSuccess,
}: JournalFormSubmissionProps) => {
  const { showSuccessToast } = useJournalToast();
  const { updateProgress } = useProgressTracking();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Authentication Error", {
        description: "You must be logged in to submit journal entries.",
        duration: 5000,
      });
      return;
    }

    // Validate pre-session requirements
    if (sessionType === "pre") {
      if (!selectedEmotion || !selectedEmotionDetail || !notes || preTradingActivities.length === 0) {
        toast.error("Missing Information", {
          description: "Please fill in all required fields: emotion, details, activities, and notes.",
          duration: 5000,
        });
        return;
      }
    }

    // Validate post-session requirements
    if (sessionType === "post") {
      if (!selectedEmotion || !selectedEmotionDetail || !notes || !marketConditions || followedRules?.length === 0) {
        toast.error("Missing Information", {
          description: "Please fill in all required fields for post-session.",
          duration: 5000,
        });
        return;
      }

      // Only validate trades if the outcome is not "no_trades"
      if (selectedOutcome !== "no_trades" && trades.length === 0) {
        toast.error("Missing Information", {
          description: "Please add at least one trade for your trading session.",
          duration: 5000,
        });
        return;
      }
    }

    try {
      const { error } = await supabase.from('journal_entries').insert({
        user_id: user.id,
        session_type: sessionType,
        emotion: selectedEmotion,
        emotion_detail: selectedEmotionDetail,
        notes,
        outcome: sessionType === "pre" ? null : selectedOutcome,
        market_conditions: marketConditions,
        followed_rules: followedRules,
        mistakes: selectedMistakes,
        pre_trading_activities: preTradingActivities,
        trades: sessionType === "post" ? trades.map(trade => ({
          ...trade,
          entryPrice: trade.entryPrice.toString(),
          quantity: trade.quantity.toString(),
          stopLoss: trade.stopLoss.toString(),
          takeProfit: trade.takeProfit.toString(),
          exitPrice: trade.exitPrice.toString(),
          pnl: trade.pnl.toString(),
          fees: trade.fees.toString(),
        })) : [],
      });

      if (error) throw error;

      await updateProgress(sessionType);
      console.log(`Progress updated for ${sessionType} session`);
      showSuccessToast(sessionType);
      resetForm();
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Error submitting journal entry:', error);
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to submit journal entry. Please try again.",
        duration: 5000,
      });
    }
  };

  return { handleSubmit };
};