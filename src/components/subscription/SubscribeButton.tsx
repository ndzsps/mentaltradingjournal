import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";

export const SubscribeButton = () => {
  const { createCheckoutSession } = useSubscription();

  return (
    <Button
      onClick={createCheckoutSession}
      className="bg-primary hover:bg-primary/90"
    >
      Subscribe Now
    </Button>
  );
};