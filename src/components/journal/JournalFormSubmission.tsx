import { useJournalToast } from "@/hooks/useJournalToast";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { toast } from "sonner";

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

  const handleSubmit = () => {
    if (!selectedEmotion || !selectedEmotionDetail || !notes) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
        duration: 5000,
      });
      return;
    }

    // Validate post-session specific fields
    if (sessionType === "post") {
      if (!selectedOutcome || !marketConditions || followedRules?.length === 0) {
        toast.error("Missing Information", {
          description: "Please fill in all required fields for post-session.",
          duration: 5000,
        });
        return;
      }
    }

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
    
    // Update progress tracking and show success message
    updateProgress(sessionType);
    showSuccessToast(sessionType);
    resetForm();
    onSubmitSuccess?.();
  };

  return { handleSubmit };
};