import { AppLayout } from "@/components/layout/AppLayout";

const Index = () => {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-muted-foreground max-w-md">
          Continue your trading journey and track your progress.
        </p>
      </div>
    </AppLayout>
  );
};

export default Index;