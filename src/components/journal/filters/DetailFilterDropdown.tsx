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

interface DetailFilterDropdownProps {
  detailFilter: string | null;
  setDetailFilter: (value: string | null) => void;
  allDetails: string[];
}

export const DetailFilterDropdown = ({
  detailFilter,
  setDetailFilter,
  allDetails,
}: DetailFilterDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Detail <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Filter by Detail</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setDetailFilter(null)}>
          All Details
        </DropdownMenuItem>
        {allDetails.map(detail => (
          <DropdownMenuItem 
            key={detail}
            onClick={() => setDetailFilter(detail)}
          >
            {detail}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};