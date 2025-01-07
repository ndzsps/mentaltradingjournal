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
  selectedDate?: Date; // New prop for custom date
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
  selectedDate, // Add to props
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
      selectedDate,
    });

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
    }

    try {
      // Use the selected date or current date
      const entryDate = selectedDate || new Date();
      
      const { error } = await supabase.from('journal_entries').insert({
        user_id: user.id,
        session_type: sessionType,
        emotion: selectedEmotion,
        emotion_detail: selectedEmotionDetail,
        notes,
        outcome: sessionType === "pre" ? null : validateOutcome(selectedOutcome),
        market_conditions: marketConditions,
        followed_rules: followedRules,
        mistakes: selectedMistakes,
        pre_trading_activities: preTradingActivities,
        trades: [],
        created_at: entryDate.toISOString(), // Use the custom date
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