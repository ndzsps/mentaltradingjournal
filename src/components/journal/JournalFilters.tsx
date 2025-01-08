import { TimeFilterDropdown } from "./filters/TimeFilterDropdown";
import { EmotionFilterDropdown } from "./filters/EmotionFilterDropdown";
import { DetailFilterDropdown } from "./filters/DetailFilterDropdown";
import { OutcomeFilterDropdown } from "./filters/OutcomeFilterDropdown";
import { TimeFilter } from "@/hooks/useJournalFilters";

interface JournalFiltersProps {
  emotionFilter: string | null;
  setEmotionFilter: (value: string | null) => void;
  detailFilter: string | null;
  setDetailFilter: (value: string | null) => void;
  timeFilter: TimeFilter;
  setTimeFilter: (value: TimeFilter) => void;
  outcomeFilter: string | null;
  setOutcomeFilter: (value: string | null) => void;
  allDetails: string[];
}

export const JournalFilters = ({
  emotionFilter,
  setEmotionFilter,
  detailFilter,
  setDetailFilter,
  timeFilter,
  setTimeFilter,
  outcomeFilter,
  setOutcomeFilter,
  allDetails,
}: JournalFiltersProps) => {
  return (
    <div className="flex gap-2 justify-start">
      <TimeFilterDropdown 
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
      />
      <EmotionFilterDropdown 
        emotionFilter={emotionFilter}
        setEmotionFilter={setEmotionFilter}
      />
      <DetailFilterDropdown 
        detailFilter={detailFilter}
        setDetailFilter={setDetailFilter}
        allDetails={allDetails}
      />
      <OutcomeFilterDropdown 
        outcomeFilter={outcomeFilter}
        setOutcomeFilter={setOutcomeFilter}
      />
    </div>
  );
};