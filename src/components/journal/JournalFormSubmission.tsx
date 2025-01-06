import { useJournalToast } from "@/hooks/useJournalToast";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Trade {
  entryDate: string;
  instrument: string;
  setup: string;
  direction: 'buy' | 'sell';
  entryPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  exitDate: string;
  exitPrice: number;
  pnl: number;
  fees: number;
}

type ValidOutcome = 'win' | 'loss' | 'breakeven' | null;

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
  resetForm,
  onSubmitSuccess,
}: JournalFormSubmissionProps) => {
  const { showSuccessToast } = useJournalToast();
  const { updateProgress } = useProgressTracking();
  const { user } = useAuth();

  const validateOutcome = (outcome?: string): ValidOutcome => {
    if (!outcome) return null;
    if (['win', 'loss', 'breakeven'].includes(outcome.toLowerCase())) {
      return outcome.toLowerCase() as ValidOutcome;
    }
    throw new Error('Invalid outcome value. Must be "win", "loss", or "breakeven".');
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Authentication Error", {
        description: "You must be logged in to submit journal entries.",
        duration: 5000,
      });
      return;
    }

    console.log('Submitting journal entry:', {
      sessionType,
      selectedEmotion,
      selectedEmotionDetail,
      notes,
      selectedOutcome,
      marketConditions,
      followedRules,
      selectedMistakes,
      preTradingActivities,
    });

    if (!selectedEmotion || !selectedEmotionDetail || !notes) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
        duration: 5000,
      });
      return;
    }

    if (sessionType === "post") {
      if (!selectedOutcome || !marketConditions || followedRules?.length === 0) {
        toast.error("Missing Information", {
          description: "Please fill in all required fields for post-session.",
          duration: 5000,
        });
        return;
      }
    }

    try {
      // Validate outcome before submission
      const validatedOutcome = validateOutcome(selectedOutcome);

      const { error } = await supabase.from('journal_entries').insert({
        user_id: user.id,
        session_type: sessionType,
        emotion: selectedEmotion,
        emotion_detail: selectedEmotionDetail,
        notes,
        outcome: validatedOutcome,
        market_conditions: marketConditions,
        followed_rules: followedRules,
        mistakes: selectedMistakes,
        pre_trading_activities: preTradingActivities,
        trades: [], // Initialize with an empty array
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