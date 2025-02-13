
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: hasActiveSubscription, isLoading } = useSubscription();

  useEffect(() => {
    if (!isLoading && !hasActiveSubscription && user) {
      toast.error(
        "Active subscription required",
        {
          description: "Please subscribe to access this feature."
        }
      );
      navigate("/pricing");
    }
  }, [hasActiveSubscription, isLoading, navigate, user]);

  if (isLoading || !user) {
    return null;
  }

  if (!hasActiveSubscription) {
    return null;
  }

  return <>{children}</>;
};
