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

interface OutcomeFilterDropdownProps {
  outcomeFilter: string | null;
  setOutcomeFilter: (value: string | null) => void;
}

export const OutcomeFilterDropdown = ({
  outcomeFilter,
  setOutcomeFilter,
}: OutcomeFilterDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Outcome <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Filter by Outcome</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOutcomeFilter(null)}>
          All Outcomes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOutcomeFilter("win")}>
          Win
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOutcomeFilter("loss")}>
          Loss
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOutcomeFilter("no_trades")}>
          No Trades
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};