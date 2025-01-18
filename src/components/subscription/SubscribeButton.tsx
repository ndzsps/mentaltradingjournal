import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

export const SubscribeButton = () => {
  const { createCheckoutSession } = useSubscription();

  const handleSubscribe = async () => {
    try {
      await createCheckoutSession();
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to start checkout process. Please try again later.");
    }
  };

  return (
    <Button
      onClick={handleSubscribe}
      className="bg-primary hover:bg-primary/90"
    >
      Subscribe Now
    </Button>
  );
};