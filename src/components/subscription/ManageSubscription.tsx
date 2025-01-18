import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const ManageSubscription = () => {
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = () => {
    window.location.href = "https://billing.stripe.com/p/login/dR617i4AUaWldbibII";
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Manage Subscription</h2>
          <p className="text-muted-foreground">
            Click below to manage your subscription settings, including cancellation.
          </p>
        </div>
        <Button 
          onClick={handleManageSubscription}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Loading..." : "Manage Subscription"}
        </Button>
      </div>
    </Card>
  );
};