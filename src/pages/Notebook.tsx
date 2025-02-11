
import { AppLayout } from "@/components/layout/AppLayout";
import { NotebookContent } from "@/components/notebook/NotebookContent";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";

const Notebook = () => {
  return (
    <AppLayout>
      <SubscriptionGate>
        <NotebookContent />
      </SubscriptionGate>
    </AppLayout>
  );
};

export default Notebook;
