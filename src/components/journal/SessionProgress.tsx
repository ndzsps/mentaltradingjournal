import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export interface SessionProgressProps {
  emotionSelected: boolean;
  emotionDetailSelected: boolean;
  activitiesSelected: boolean;
  notesEntered: boolean;
  outcomeSelected: boolean;
  rulesSelected: boolean;
  mistakesReviewed: boolean;
  tradesAdded: boolean;
  isPostSession: boolean;
  showCelebration: boolean;
}

export const SessionProgress = ({
  emotionSelected,
  emotionDetailSelected,
  activitiesSelected,
  notesEntered,
  outcomeSelected,
  rulesSelected,
  mistakesReviewed,
  tradesAdded,
  isPostSession,
  showCelebration,
}: SessionProgressProps) => {
  const [progress, setProgress] = useState(0);

  const calculateProgress = () => {
    const steps = isPostSession
      ? [
          emotionSelected,
          emotionDetailSelected,
          notesEntered,
          outcomeSelected,
          rulesSelected,
          mistakesReviewed,
          tradesAdded,
        ]
      : [emotionSelected, emotionDetailSelected, activitiesSelected, notesEntered];

    const completedSteps = steps.filter(Boolean).length;
    return (completedSteps / steps.length) * 100;
  };

  useEffect(() => {
    const newProgress = calculateProgress();
    setProgress(newProgress);
  }, [
    emotionSelected,
    emotionDetailSelected,
    activitiesSelected,
    notesEntered,
    outcomeSelected,
    rulesSelected,
    mistakesReviewed,
    tradesAdded,
    isPostSession,
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
          className="flex items-center gap-3 p-4 bg-[#2A2A2A] rounded-lg"
        >
          <Trophy className="w-5 h-5 text-[#FFB156]" />
          <span className="text-sm font-medium text-white">
            {isPostSession ? "Post-session completed!" : "Pre-session completed!"} Keep up the great work!
          </span>
        </motion.div>
      )}
    </div>
  );
};