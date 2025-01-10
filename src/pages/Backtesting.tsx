import { AppLayout } from "@/components/layout/AppLayout";
import { BacktestingForm } from "@/components/backtesting/BacktestingForm";
import { PlaybookSection } from "@/components/backtesting/PlaybookSection";

export default function Backtesting() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
          Backtesting
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <BacktestingForm />
          <PlaybookSection />
        </div>
      </div>
    </AppLayout>
  );
}