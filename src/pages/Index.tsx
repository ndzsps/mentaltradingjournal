import { useSubscription } from "@/hooks/useSubscription";
import { AppLayout } from "@/components/layout/AppLayout";
import { SubscribeButton } from "@/components/subscription/SubscribeButton";

const Index = () => {
  const { isSubscribed, checkingSubscription } = useSubscription();

  if (checkingSubscription) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (!isSubscribed) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
          <h1 className="text-3xl font-bold">Upgrade to Premium</h1>
          <p className="text-muted-foreground max-w-md">
            Get access to all features and start improving your trading journey today.
          </p>
          <SubscribeButton />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-muted-foreground max-w-md">
          Continue your trading journey and track your progress.
        </p>
        {/* Additional content for subscribed users can go here */}
      </div>
    </AppLayout>
  );
};

export default Index;
