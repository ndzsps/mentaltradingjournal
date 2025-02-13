
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: hasActiveSubscription, isLoading } = useSubscription();

  useEffect(() => {
    // Don't redirect if on pricing page or not logged in
    if (!isLoading && !hasActiveSubscription && user && location.pathname !== "/pricing") {
      toast.error(
        "Active subscription required",
        {
          description: "Please subscribe to access this feature."
        }
      );
      navigate("/pricing");
    }
  }, [hasActiveSubscription, isLoading, navigate, user, location]);

  if (isLoading || !user) {
    return null;
  }

  // Allow rendering children if user has subscription or is on pricing page
  if (!hasActiveSubscription && location.pathname !== "/pricing") {
    return null;
  }

  return <>{children}</>;
};
