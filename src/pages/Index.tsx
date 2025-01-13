import { AppLayout } from "@/components/layout/AppLayout";
import { JournalFormSubmission } from "@/components/journal/JournalFormSubmission";

const Index = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-8">
        <JournalFormSubmission />
      </div>
    </AppLayout>
  );
};

export default Index;