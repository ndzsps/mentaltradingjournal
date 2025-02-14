
import { AppLayout } from "@/components/layout/AppLayout";
import { EmotionLogger } from "@/components/journal/EmotionLogger";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";

const Index = () => {
  const { user } = useAuth();
  const { data: hasActiveSubscription, isLoading } = useSubscription();

  // If not logged in, redirect to pricing
  if (!user) {
    return <Navigate to="/pricing" replace />;
  }

  // If subscription check is loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no subscription, redirect to pricing
  if (hasActiveSubscription === false) {
    return <Navigate to="/pricing" replace />;
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[#1A1F2C]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-30" />
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-0 -right-40 w-80 h-80 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
        <div className="absolute inset-0 backdrop-blur-[100px]" />
      </div>
      <AppLayout>
        <div className="container mx-auto py-6 space-y-8 relative z-10">
          <EmotionLogger />
        </div>
      </AppLayout>
    </div>
  );
};

export default Index;
