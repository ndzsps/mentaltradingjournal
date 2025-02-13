
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const SUCCESS_MESSAGES = [
  "Your trade has been successfully updated. Keep refining your strategy!",
  "Great work on maintaining accurate trade records. Success comes from attention to detail.",
  "Trade successfully updated. Each edit brings you closer to mastering your strategy.",
  "Changes saved successfully. Good traders are meticulous with their trade data.",
  "Update complete! Consistent record-keeping is key to trading success."
];

export const TradeEditSuccessDialog = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hasSuccess = sessionStorage.getItem('tradeEditSuccess');
    if (hasSuccess) {
      const randomIndex = Math.floor(Math.random() * SUCCESS_MESSAGES.length);
      setMessage(SUCCESS_MESSAGES[randomIndex]);
      setOpen(true);
      sessionStorage.removeItem('tradeEditSuccess');
      
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
              Trade Successfully Updated!
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
