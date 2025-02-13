
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
    // Always allow access to public routes regardless of subscription status
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

  // For public routes, always render content regardless of auth state
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, show nothing while loading
  if (isLoading) {
    return null;
  }

  // For protected routes, require both authentication and subscription
  if (!hasActiveSubscription && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};
