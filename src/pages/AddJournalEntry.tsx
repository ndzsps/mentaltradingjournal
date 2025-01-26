import { StatsHeader } from "@/components/journal/stats/StatsHeader";
import { JournalFormSubmission } from "@/components/journal/JournalFormSubmission";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AddJournalEntry() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col space-y-6">
        <StatsHeader />
        <JournalFormSubmission />
      </div>
    </SidebarProvider>
  );
}