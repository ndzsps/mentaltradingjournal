
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const SUCCESS_MESSAGES = [
  "Every trade is a lesson. Win or lose, you're growing stronger.",
  "Discipline beats emotion. Stick to the plan, and the results will follow.",
  "Your trading journal is the bridge between where you are and where you want to be.",
  "The market doesn't owe you anything—consistency is your edge.",
  "Success in trading isn't about one big win, but a thousand small improvements.",
  "Focus on progress, not perfection. Small gains compound over time.",
  "A losing trade is only a failure if you don't learn from it.",
  "Patience and discipline will take you further than luck ever will."
];

export const SuccessDialog = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hasSuccess = sessionStorage.getItem('tradeSuccess');
    if (hasSuccess) {
      // Select a random message
      const randomIndex = Math.floor(Math.random() * SUCCESS_MESSAGES.length);
      setMessage(SUCCESS_MESSAGES[randomIndex]);
      setOpen(true);
      sessionStorage.removeItem('tradeSuccess');
      
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setOpen(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-background to-muted/20">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
              Trade Successfully Added!
            </DialogTitle>
          </DialogHeader>

          <div className="text-center py-4 px-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {message}
            </p>
          </div>

          <Button 
            onClick={() => setOpen(false)}
            className="px-8 py-2 transition-all hover:scale-105"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

