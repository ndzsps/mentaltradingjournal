
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// List of public routes that don't require subscription
const PUBLIC_ROUTES = ['/', '/login', '/pricing', '/features'];

export const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: hasActiveSubscription, isLoading, error } = useSubscription();

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  useEffect(() => {
    // Skip subscription check for public routes
    if (isPublicRoute) {
      return;
    }

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
    // 4. Not on a public route
    if (!isLoading && !hasActiveSubscription && user && session && !isPublicRoute) {
      toast.error(
        "Active subscription required",
        {
          description: "Please subscribe to access this feature."
        }
      );
      navigate("/pricing");
    }
  }, [hasActiveSubscription, isLoading, navigate, user, session, error, isPublicRoute]);

  // Show nothing while loading or if not authenticated
  if (isLoading || !user || !session) {
    return null;
  }

  // Always render content for public routes
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // No subscription, don't render protected content
  if (!hasActiveSubscription) {
    return null;
  }

  return <>{children}</>;
};
