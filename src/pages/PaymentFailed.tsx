import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      variant: "destructive",
      title: "Payment Failed",
      description: "There was an error processing your payment. Please try again.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-destructive">Payment Failed</h1>
        <p className="text-muted-foreground">There was an error processing your payment.</p>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate("/pricing")}>
            Try Again
          </Button>
          <Button onClick={() => navigate("/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;