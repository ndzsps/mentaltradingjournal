
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { data: hasActiveSubscription, isLoading, error } = useSubscription();

  useEffect(() => {
    // Only show error if we have a session and there's a subscription check error
    if (error && session) {
      console.error("Subscription check error:", error);
      toast.error(
        "Error checking subscription",
        {
          description: "Please try again or contact support if the issue persists."
        }
      );
    }

    // Only redirect if:
    // 1. We're not loading
    // 2. User is authenticated
    // 3. No subscription is found
    if (!isLoading && !hasActiveSubscription && user && session) {
      toast.error(
        "Active subscription required",
        {
          description: "Please subscribe to access this feature."
        }
      );
      navigate("/pricing");
    }
  }, [hasActiveSubscription, isLoading, navigate, user, session, error]);

  // Show nothing while loading or if not authenticated
  if (isLoading || !user || !session) {
    return null;
  }

  // No subscription, don't render protected content
  if (!hasActiveSubscription) {
    return null;
  }

  return <>{children}</>;
};
