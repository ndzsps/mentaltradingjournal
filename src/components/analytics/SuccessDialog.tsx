
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const SuccessDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSuccess = sessionStorage.getItem('tradeSuccess');
    if (hasSuccess) {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            Trade Successfully Added!
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          <p className="text-lg text-muted-foreground">
            Every trade is a lesson. Win or lose, you're growing stronger.
          </p>
        </div>
        <div className="flex justify-center">
          <Button onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
