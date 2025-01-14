import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface BillingToggleProps {
  billingInterval: string;
  setBillingInterval: (value: string) => void;
}

export const BillingToggle = ({ billingInterval, setBillingInterval }: BillingToggleProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <ToggleGroup
        type="single"
        value={billingInterval}
        onValueChange={(value) => value && setBillingInterval(value)}
        className="inline-flex bg-muted/50 backdrop-blur-sm rounded-full p-1.5 shadow-lg"
      >
        <ToggleGroupItem
          value="annually"
          className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
            billingInterval === "annually" 
              ? "bg-primary text-white shadow-md" 
              : "hover:bg-muted"
          }`}
        >
          Billed annually
        </ToggleGroupItem>
        <ToggleGroupItem
          value="monthly"
          className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
            billingInterval === "monthly" 
              ? "bg-accent text-accent-foreground shadow-md" 
              : "hover:bg-muted"
          }`}
        >
          Billed monthly
        </ToggleGroupItem>
      </ToggleGroup>
      
      {billingInterval === "annually" && (
        <p className="text-sm text-primary animate-fade-in">
          Save 25% with annual billing 🎉
        </p>
      )}
    </div>
  );
};