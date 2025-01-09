import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { ProfitLossDistribution } from "./ProfitLossDistribution";
import { TradeFrequency } from "./TradeFrequency";
import { RiskRewardAnalysis } from "./RiskRewardAnalysis";
import { WinLossRatio } from "./WinLossRatio";
import { AssetPairPerformance } from "./AssetPairPerformance";
import { TimeBasedPerformance } from "./TimeBasedPerformance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const AnalyticsDashboard = () => {
  const [activeView, setActiveView] = useState<'all' | 'psychological' | 'trading'>('all');

  const psychologicalComponents = [
    EmotionalTendencies,
    EmotionTrend,
    EmotionRecovery,
    PreTradingEvents,
    PersonalityPatterns,
  ];

  const tradingComponents = [
    TimeBasedPerformance,
    AssetPairPerformance,
    PerformanceBreakdown,
    RuleAdherence,
    MarketVolatility,
    TradeDuration,
    CumulativeImpact,
    MistakeAnalysis,
    ProfitLossDistribution,
    TradeFrequency,
    RiskRewardAnalysis,
    WinLossRatio,
  ];

  const getFilteredComponents = () => {
    switch (activeView) {
      case 'psychological':
        return psychologicalComponents;
      case 'trading':
        return tradingComponents;
      default:
        return [...psychologicalComponents, ...tradingComponents];
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">Trading Analytics</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Analyze your trading performance and emotional patterns
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={activeView === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveView('all')}
              className="flex-1 sm:flex-none"
            >
              All Analytics
            </Button>
            <Button
              variant={activeView === 'psychological' ? 'default' : 'outline'}
              onClick={() => setActiveView('psychological')}
              className="flex-1 sm:flex-none"
            >
              Psychological Analytics
            </Button>
            <Button
              variant={activeView === 'trading' ? 'default' : 'outline'}
              onClick={() => setActiveView('trading')}
              className="flex-1 sm:flex-none"
            >
              Trading Analytics
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {getFilteredComponents().map((Component, index) => (
            <ErrorBoundary key={index}>
              <Component />
            </ErrorBoundary>
          ))}
        </div>
      </div>
    </QueryClientProvider>
  );
};

// Simple error boundary component to prevent entire dashboard from crashing
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Error in analytics component:', error);
    return (
      <Card className="p-4">
        <p className="text-destructive">Failed to load component</p>
      </Card>
    );
  }
};