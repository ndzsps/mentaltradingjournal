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
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="sm:max-w-[900px] p-0 bg-gradient-to-b from-background to-background/80" hideCloseButton>
        <div className="p-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gradient">
              Start your subscription
            </h2>
            <p className="text-muted-foreground">
              Unlock all features and take your trading to the next level
            </p>
          </div>
          
          <div className="flex justify-center gap-4 mb-6">
            <Button variant="outline" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">Monthly</Button>
            <Button variant="outline" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">
              Yearly
            </Button>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="border rounded-xl p-8 space-y-6 bg-card shadow-lg">
              <div>
                <h3 className="text-2xl font-bold text-white">Pro Plan</h3>
              </div>

              <div className="flex items-baseline">
                <span className="text-4xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">$9.99</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Plan includes</h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="text-primary h-3 w-3" />
                    </div>
                    <span>Can add up to 20 accounts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="text-primary h-3 w-3" />
                    </div>
                    <span>Data storage allowed up to 6Gb</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="text-primary h-3 w-3" />
                    </div>
                    <span>Can add unlimited playbooks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="text-primary h-3 w-3" />
                    </div>
                    <span>Can add unlimited mentees</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="text-primary h-3 w-3" />
                    </div>
                    <span>Trade Replay</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="text-primary h-3 w-3" />
                    </div>
                    <span>Backtesting</span>
                  </li>
                </ul>
              </div>

              <SubscribeButton />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              variant="ghost" 
              onClick={() => signOut()} 
              className="text-muted-foreground hover:text-primary"
            >
              Logout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};