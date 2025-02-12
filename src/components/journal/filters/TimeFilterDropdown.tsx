
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TimeFilter } from "@/hooks/useJournalFilters";

interface TimeFilterDropdownProps {
  timeFilter: TimeFilter;
  setTimeFilter: (value: TimeFilter) => void;
}

export const TimeFilterDropdown = ({
  timeFilter,
  setTimeFilter,
}: TimeFilterDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Time Period <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Filter by Time</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTimeFilter("eternal")}>
          Eternal (All-Time)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTimeFilter("this-month")}>
          This Month
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTimeFilter("last-month")}>
          Last Month
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTimeFilter("last-three-months")}>
          Last Three Months
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
