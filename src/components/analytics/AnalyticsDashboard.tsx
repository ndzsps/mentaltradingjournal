import { EmotionalTendencies } from "./EmotionalTendencies";
import { PerformanceBreakdown } from "./PerformanceBreakdown";
import { EmotionTrend } from "./EmotionTrend";
import { RuleAdherence } from "./RuleAdherence";
import { MarketVolatility } from "./MarketVolatility";
import { EmotionRecovery } from "./EmotionRecovery";
import { PreTradingEvents } from "./PreTradingEvents";
import { TradeDuration } from "./TradeDuration";
import { CumulativeImpact } from "./CumulativeImpact";
import { MistakeAnalysis } from "./MistakeAnalysis";
import { PersonalityPatterns } from "./PersonalityPatterns";

export const AnalyticsDashboard = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">Trading Analytics</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Analyze your trading performance and emotional patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <EmotionalTendencies />
        <PerformanceBreakdown />
        <EmotionTrend />
        <RuleAdherence />
        <MarketVolatility />
        <EmotionRecovery />
        <PreTradingEvents />
        <TradeDuration />
        <CumulativeImpact />
        <MistakeAnalysis />
        <PersonalityPatterns />
      </div>
    </div>
  );
};