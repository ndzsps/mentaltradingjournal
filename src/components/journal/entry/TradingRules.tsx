import { Badge } from "@/components/ui/badge";

interface TradingRulesProps {
  rules: string[];
}

const capitalizeWords = (str: string) => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const TradingRules = ({ rules }: TradingRulesProps) => {
  if (!Array.isArray(rules) || rules.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Trading Rules Followed:</h4>
      <div className="flex flex-wrap gap-2">
        {rules.map((rule, index) => (
          <Badge 
            key={index}
            variant="outline"
            className="bg-accent/10 hover:bg-accent/20 transition-colors"
          >
            {capitalizeWords(rule)}
          </Badge>
        ))}
      </div>
    </div>
  );
};