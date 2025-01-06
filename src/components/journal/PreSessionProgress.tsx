import { Progress } from "@/components/ui/progress";

interface PreSessionProgressProps {
  emotionSelected: boolean;
  emotionDetailSelected: boolean;
  activitiesSelected: boolean;
  notesEntered: boolean;
}

export const PreSessionProgress = ({
  emotionSelected,
  emotionDetailSelected,
  activitiesSelected,
  notesEntered,
}: PreSessionProgressProps) => {
  const calculateProgress = () => {
    const steps = [emotionSelected, emotionDetailSelected, activitiesSelected, notesEntered];
    const completedSteps = steps.filter(Boolean).length;
    return (completedSteps / steps.length) * 100;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progress Bar</span>
        <span>{Math.round(calculateProgress())}%</span>
      </div>
      <Progress value={calculateProgress()} className="h-2" />
    </div>
  );
};