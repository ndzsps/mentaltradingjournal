
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { TimeFilter } from "@/hooks/useJournalFilters";

interface TimeFilterButtonsProps {
  timeFilter: TimeFilter;
  setTimeFilter: (filter: TimeFilter) => void;
}

export const TimeFilterButtons = ({ timeFilter, setTimeFilter }: TimeFilterButtonsProps) => {
  const { state, toggleSidebar } = useSidebar();

  return (
    <div className="flex justify-start gap-2 items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="hover:bg-primary/10"
        title={state === "expanded" ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {state === "expanded" ? (
          <PanelLeftClose className="h-4 w-4" />
        ) : (
          <PanelLeftOpen className="h-4 w-4" />
        )}
      </Button>
      <Button 
        variant={timeFilter === "this-month" ? "default" : "outline"}
        onClick={() => setTimeFilter("this-month")}
      >
        This Month
      </Button>
      <Button 
        variant={timeFilter === "last-month" ? "default" : "outline"}
        onClick={() => setTimeFilter("last-month")}
      >
        Last Month
      </Button>
      <Button 
        variant={timeFilter === "last-three-months" ? "default" : "outline"}
        onClick={() => setTimeFilter("last-three-months")}
      >
        Last Quarter
      </Button>
    </div>
  );
};
