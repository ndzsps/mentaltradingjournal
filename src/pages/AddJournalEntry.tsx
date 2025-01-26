import { useJournalFormSubmission } from "@/components/journal/JournalFormSubmission";
import { StatsHeader } from "@/components/journal/stats/StatsHeader";
import { AppLayout } from "@/components/layout/AppLayout";

export default function AddJournalEntry() {
  const JournalFormSubmission = useJournalFormSubmission();
  
  return (
    <AppLayout>
      <div className="min-h-screen flex w-full flex-col space-y-6">
        <StatsHeader />
        <JournalFormSubmission />
      </div>
    </AppLayout>
  );
}