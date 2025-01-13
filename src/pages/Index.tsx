import { AppLayout } from "@/components/layout/AppLayout";
import { JournalFormSubmission } from "@/components/journal/JournalFormSubmission";

const Index = () => {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <JournalFormSubmission />
      </div>
    </AppLayout>
  );
};

export default Index;