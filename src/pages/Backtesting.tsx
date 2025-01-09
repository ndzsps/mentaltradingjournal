import { AppLayout } from "@/components/layout/AppLayout";
import { BacktestingForm } from "@/components/backtesting/BacktestingForm";
import { BacktestingSessions } from "@/components/backtesting/BacktestingSessions";

export default function Backtesting() {
  return (
    <AppLayout>
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Backtesting</h1>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <BacktestingForm />
          <BacktestingSessions />
        </div>
      </div>
    </AppLayout>
  );
}