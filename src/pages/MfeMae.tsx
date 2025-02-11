
import { AppLayout } from "@/components/layout/AppLayout";
import { MfeMaeChart } from "@/components/backtesting/mfe-mae/MfeMaeChart";

export default function MfeMae() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gradient">MFE & MAE Analysis</h1>
        <MfeMaeChart />
      </div>
    </AppLayout>
  );
}
