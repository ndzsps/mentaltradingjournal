import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SubscribeButton } from "./SubscribeButton";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionDialog = ({ open, onOpenChange }: SubscriptionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Upgrade to Premium</DialogTitle>
        <div className="space-y-4 py-4 text-center">
          <p className="text-muted-foreground">
            Get access to all features and start improving your trading journey today.
          </p>
          <SubscribeButton />
        </div>
      </DialogContent>
    </Dialog>
  );
};