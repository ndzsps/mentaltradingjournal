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
import { emotions } from "./emotionConfig";

interface JournalFiltersProps {
  emotionFilter: string | null;
  setEmotionFilter: (value: string | null) => void;
  detailFilter: string | null;
  setDetailFilter: (value: string | null) => void;
  timeFilter: string | null;
  setTimeFilter: (value: string | null) => void;
  allDetails: string[];
}

export const JournalFilters = ({
  emotionFilter,
  setEmotionFilter,
  detailFilter,
  setDetailFilter,
  timeFilter,
  setTimeFilter,
  allDetails,
}: JournalFiltersProps) => {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            Time Period <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filter by Time</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTimeFilter(null)}>
            All Time
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            Emotion <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filter by Emotion</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEmotionFilter(null)}>
            All Emotions
          </DropdownMenuItem>
          {emotions.map(emotion => (
            <DropdownMenuItem 
              key={emotion.value}
              onClick={() => setEmotionFilter(emotion.label)}
            >
              {emotion.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

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
    </div>
  );
};