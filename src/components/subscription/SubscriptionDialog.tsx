import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SubscribeButton } from "./SubscribeButton";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionDialog = ({ open, onOpenChange }: SubscriptionDialogProps) => {
  const { signOut } = useAuth();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0">
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center">Start your subscription</h2>
          
          <div className="flex justify-center gap-4 mb-6">
            <Button variant="outline" className="rounded-full">Monthly</Button>
            <Button variant="outline" className="rounded-full text-primary">
              Yearly • Save 32%
            </Button>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold">Pro</h3>
                <p className="text-sm text-muted-foreground">
                  You <span className="text-primary">Saved $189</span> if paid $399 annually.
                </p>
              </div>

              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-primary">$33.25</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Plan includes</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500" size={20} />
                    <span>Can add up to 20 accounts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500" size={20} />
                    <span>Data storage allowed up to 6Gb</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500" size={20} />
                    <span>Can add unlimited playbooks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500" size={20} />
                    <span>Can add unlimited mentees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500" size={20} />
                    <span>Trade Replay</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500" size={20} />
                    <span>Backtesting</span>
                  </li>
                </ul>
              </div>

              <SubscribeButton />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button variant="link" onClick={() => signOut()} className="text-primary">
              Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};