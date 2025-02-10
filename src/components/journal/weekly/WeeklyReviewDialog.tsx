
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek } from "date-fns";

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadReview = async () => {
    try {
      setLoading(true);
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start week on Monday
      
      const { data, error } = await supabase
        .from('weekly_reviews')
        .select('*')
        .eq('week_start_date', weekStart.toISOString().split('T')[0])
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      if (data) {
        setStrength(data.strength || '');
        setWeakness(data.weakness || '');
        setImprovement(data.improvement || '');
      }
    } catch (error) {
      console.error('Error loading review:', error);
      toast({
        title: "Error Loading Review",
        description: "There was an error loading your weekly review.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadReview();
    }
  }, [open]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

      const { error } = await supabase
        .from('weekly_reviews')
        .upsert({
          week_start_date: weekStart.toISOString().split('T')[0],
          strength,
          weakness,
          improvement,
        });

      if (error) throw error;

      toast({
        title: "Weekly Review Saved",
        description: "Your weekly review has been saved successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving review:', error);
      toast({
        title: "Error Saving Review",
        description: "There was an error saving your weekly review.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <NotepadText className="h-5 w-5" />
            Weekly Review
          </DialogTitle>
          <DialogDescription>
            Review your trading performance and set goals for improvement
          </DialogDescription>
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
