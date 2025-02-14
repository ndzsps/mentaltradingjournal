
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
    // Always allow access to public routes
    if (isPublicRoute) {
      return;
    }

    // Skip subscription check if user is not authenticated
    if (!user || !session) {
      return;
    }

    // Only show error if we have a session and there's a subscription check error
    if (error) {
      console.error("Subscription check error:", error);
      // Don't show error toast for subscription check failures
      return;
    }

    // Only redirect if:
    // 1. Not on a public route
    // 2. User is authenticated
    // 3. Not loading
    // 4. No subscription found
    if (!isPublicRoute && user && !isLoading && hasActiveSubscription === false) {
      toast.error(
        "Active subscription required",
        {
          description: "Please subscribe to access this feature."
        }
      );
      navigate("/pricing", { replace: true }); // Added replace: true to prevent back navigation
      return;
    }
  }, [hasActiveSubscription, isLoading, navigate, user, session, error, isPublicRoute, location.pathname]);

  // Always render content for public routes
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Show loading state while checking subscription
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show nothing if not authenticated
  if (!user || !session) {
    return null;
  }

  // Allow access if subscription check failed (to prevent blocking legitimate users)
  if (error) {
    console.warn("Subscription check failed, allowing access:", error);
    return <>{children}</>;
  }

  // For protected routes, require subscription
  if (!hasActiveSubscription) {
    return null;
  }

  return <>{children}</>;
};
