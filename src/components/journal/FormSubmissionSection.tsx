import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trade } from "@/types/trade";
import { toast } from "sonner";

interface FormSubmissionSectionProps {
  sessionType: "pre" | "post";
  notes: string;
  setNotes: (notes: string) => void;
  trades: Trade[];
  handleSubmit: () => void;
}

export const FormSubmissionSection = ({
  sessionType,
  notes,
  setNotes,
  trades,
  handleSubmit,
}: FormSubmissionSectionProps) => {
  const handleFormSubmit = () => {
    if (sessionType === "post" && trades.length === 0) {
      toast.error("Please add at least one trade before submitting your post-session entry", {
        description: "Click the 'Add Trade' button to log your trades.",
        duration: 5000,
      });
      return;
    }
    handleSubmit();
  };

  return (
    <div className="space-y-6">
      <Textarea
        placeholder={sessionType === "pre" 
          ? "How are you feeling before starting your trading session?" 
          : "Reflect on your trading session. How do you feel about your performance and decisions?"
        }
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[120px] bg-card/50 border-primary/10 focus-visible:ring-primary/30 resize-none"
      />

      <Button 
        onClick={handleFormSubmit}
        className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
      >
        Log {sessionType === "pre" ? "Pre" : "Post"}-Session Entry
      </Button>
    </div>
  );
};