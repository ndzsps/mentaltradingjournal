import React from "react";
import { useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { EmotionLogger } from "@/components/journal/EmotionLogger";

interface LocationState {
  initialSessionType?: "pre" | "post";
}

const Index = () => {
  const location = useLocation();
  const { initialSessionType } = (location.state as LocationState) || {};

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <EmotionLogger initialSessionType={initialSessionType} />
      </div>
    </AppLayout>
  );
};

export default Index;