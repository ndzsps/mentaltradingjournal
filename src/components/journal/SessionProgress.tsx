import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Trophy, Flame, Star } from "lucide-react";

interface SessionProgressProps {
  emotionSelected: boolean;
  emotionDetailSelected: boolean;
  activitiesSelected: boolean;
  notesEntered: boolean;
  outcomeSelected?: boolean;
  marketConditionsSelected?: boolean;
  rulesSelected?: boolean;
  mistakesReviewed?: boolean;
  isPostSession?: boolean;
}

export const SessionProgress = ({
  emotionSelected,
  emotionDetailSelected,
  activitiesSelected,
  notesEntered,
  outcomeSelected = false,
  marketConditionsSelected = false,
  rulesSelected = false,
  mistakesReviewed = false,
  isPostSession = false,
}: SessionProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const calculateProgress = () => {
    const steps = isPostSession
      ? [
          emotionSelected,
          emotionDetailSelected,
          activitiesSelected,
          notesEntered,
          outcomeSelected,
          marketConditionsSelected,
          rulesSelected,
          mistakesReviewed,
        ]
      : [emotionSelected, emotionDetailSelected, activitiesSelected, notesEntered];

    const completedSteps = steps.filter(Boolean).length;
    return (completedSteps / steps.length) * 100;
  };

  useEffect(() => {
    const newProgress = calculateProgress();
    setProgress(newProgress);

    if (newProgress === 100 && !showCelebration) {
      setShowCelebration(true);
      toast.success(
        `${isPostSession ? "Post" : "Pre"}-Session Review Completed! 🎉`,
        {
          description: "Great job maintaining your trading discipline!",
        }
      );
    }
  }, [
    emotionSelected,
    emotionDetailSelected,
    activitiesSelected,
    notesEntered,
    outcomeSelected,
    marketConditionsSelected,
    rulesSelected,
    mistakesReviewed,
    isPostSession,
    showCelebration,
  ]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          {isPostSession ? "Post-Session Progress" : "Pre-Session Progress"}
        </span>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-accent/20 rounded-lg"
        >
          <Trophy className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium">
            Session completed! Keep up the great work!
          </span>
        </motion.div>
      )}
    </div>
  );
};