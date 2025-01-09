import { AppLayout } from "@/components/layout/AppLayout";

export default function Backtesting() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Backtesting</h1>
        <p className="text-muted-foreground">
          This section will allow you to backtest your trading strategies and analyze their performance.
        </p>
      </div>
    </AppLayout>
  );
}