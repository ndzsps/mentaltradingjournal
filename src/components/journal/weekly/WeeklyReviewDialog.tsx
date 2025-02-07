
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
  const [overview, setOverview] = useState("");
  const [improvements, setImprovements] = useState("");
  const [actionPlan, setActionPlan] = useState("");
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
            <h3 className="text-lg font-semibold">Overview</h3>
            <p className="text-sm text-muted-foreground">
              What key objectives did you achieve? What are you most proud of from your performance?
            </p>
            <Textarea
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="min-h-[120px] bg-card/50 border-primary/10 focus-visible:ring-primary/30"
              placeholder="Write your overview here..."
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Areas of Improvement</h3>
            <p className="text-sm text-muted-foreground">
              What challenges did you face? What lessons did you learn from this week?
            </p>
            <Textarea
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              className="min-h-[120px] bg-card/50 border-primary/10 focus-visible:ring-primary/30"
              placeholder="Write about areas for improvement..."
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Action Plan</h3>
            <p className="text-sm text-muted-foreground">
              What are your focus areas for next week?
            </p>
            <Textarea
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              className="min-h-[120px] bg-card/50 border-primary/10 focus-visible:ring-primary/30"
              placeholder="Write your action plan here..."
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
