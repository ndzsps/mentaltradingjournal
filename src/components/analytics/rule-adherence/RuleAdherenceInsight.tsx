interface RuleAdherenceInsightProps {
  hasEnoughData: boolean;
  winRateDifference: number;
  rulesFollowed: {
    wins: number;
    total: number;
  };
}

export const RuleAdherenceInsight = ({ 
  hasEnoughData, 
  winRateDifference, 
  rulesFollowed 
}: RuleAdherenceInsightProps) => {
  return (
    <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
      <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
      <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
        {hasEnoughData ? (
          <>
            <p>
              {winRateDifference > 0
                ? `Following your trading rules resulted in a ${winRateDifference}% higher win rate.`
                : `Your win rate was ${Math.abs(winRateDifference)}% lower when following rules - review your rule set.`}
            </p>
            <p>
              {rulesFollowed.wins > 50
                ? "Your trading rules are effective when followed consistently."
                : "Consider reviewing and adjusting your trading rules for better performance."}
            </p>
          </>
        ) : (
          <p>Add at least 5 trading sessions in each category (following rules and not following rules) to generate meaningful insights about your rule adherence.</p>
        )}
      </div>
    </div>
  );
};