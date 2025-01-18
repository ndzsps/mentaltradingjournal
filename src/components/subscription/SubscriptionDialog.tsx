import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SubscribeButton } from "./SubscribeButton";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionDialog({ open, onOpenChange }: SubscriptionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-4 py-4">
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <p className="text-muted-foreground">
            Continue your trading journey and track your progress.
          </p>
          <div className="pt-4">
            <SubscribeButton />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}