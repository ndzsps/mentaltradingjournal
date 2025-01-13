import { AppLayout } from "@/components/layout/AppLayout";
import { BacktestingForm } from "@/components/backtesting/BacktestingForm";
import { PlaybookSection } from "@/components/backtesting/PlaybookSection";
import { useRef } from "react";

export default function Backtesting() {
  const formRef = useRef<{ fetchBlueprints: () => void }>();

  const handleBlueprintAdded = () => {
    formRef.current?.fetchBlueprints();
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gradient">Backtesting</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BacktestingForm ref={formRef} />
          <PlaybookSection onBlueprintAdded={handleBlueprintAdded} />
        </div>
      </div>
    </AppLayout>
  );
}