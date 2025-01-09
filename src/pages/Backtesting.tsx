import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { BacktestingForm } from "@/components/backtesting/BacktestingForm";

const Backtesting = () => {
  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <BacktestingForm />
      </div>
    </AppLayout>
  );
};

export default Backtesting;