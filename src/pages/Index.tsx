import { AppLayout } from "@/components/layout/AppLayout";
import { EmotionLogger } from "@/components/journal/EmotionLogger";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-8">
        {!user && (
          <div className="flex justify-end gap-4 mb-6">
            <Button variant="ghost" asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
            <Button variant="default" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        )}
        <EmotionLogger />
      </div>
    </AppLayout>
  );
};

export default Index;