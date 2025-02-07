
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WeeklyReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekNumber: number;
}

export const WeeklyReviewDialog = ({
  open,
  onOpenChange,
  weekNumber,
}: WeeklyReviewDialogProps) => {
  const [strength, setStrength] = useState("");
  const [weakness, setWeakness] = useState("");
  const [improvement, setImprovement] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    // In a future implementation, this could save to the database
    toast({
      title: "Weekly Review Saved",
      description: `Week ${weekNumber} review has been saved successfully.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <NotepadText className="h-5 w-5" />
            Week {weekNumber} Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Reflection: Strength</h3>
            <p className="text-sm text-muted-foreground">
              What did you do best this week?
            </p>
            <Textarea
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              className="min-h-[120px] bg-card/50 border-primary/10 focus-visible:ring-primary/30"
              placeholder="Write about your strengths..."
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Reflection: Weakness</h3>
            <p className="text-sm text-muted-foreground">
              What is the one thing you must improve on?
            </p>
            <Textarea
              value={weakness}
              onChange={(e) => setWeakness(e.target.value)}
              className="min-h-[120px] bg-card/50 border-primary/10 focus-visible:ring-primary/30"
              placeholder="Write about your area of improvement..."
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Plan: Improvement</h3>
            <p className="text-sm text-muted-foreground">
              What is your plan to ensure you make this improvement next week?
            </p>
            <Textarea
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              className="min-h-[120px] bg-card/50 border-primary/10 focus-visible:ring-primary/30"
              placeholder="Write your improvement plan..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90"
            >
              Save Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
