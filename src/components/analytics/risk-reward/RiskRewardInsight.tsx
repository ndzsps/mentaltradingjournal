
interface RiskRewardInsightProps {
  avgRiskReward: number;
  favorableRatioPercentage: number;
  hasData: boolean;
}

export const RiskRewardInsight = ({ 
  avgRiskReward, 
  favorableRatioPercentage,
  hasData 
}: RiskRewardInsightProps) => {
  return (
    <div className="space-y-2 bg-accent/10 p-3 md:p-4 rounded-lg">
      <h4 className="font-semibold text-sm md:text-base">AI Insight</h4>
      <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
        {hasData ? (
          <>
            <p>
              Your average risk:reward ratio is {avgRiskReward}:1.
              {avgRiskReward >= 2 
                ? " This is a healthy ratio that supports long-term profitability."
                : " Consider adjusting your take profit levels to improve this ratio."}
            </p>
            <p>
              {favorableRatioPercentage >= 0.7
                ? "The majority of your trades maintain a favorable risk:reward ratio."
                : "Look for setups that offer better reward potential relative to risk."}
            </p>
          </>
        ) : (
          <p>Start adding trades with stop loss and take profit levels to see risk:reward analysis.</p>
        )}
      </div>
    </div>
  );
};
