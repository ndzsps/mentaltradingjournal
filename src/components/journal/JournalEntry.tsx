import { Card } from "@/components/ui/card";
import { SessionHeader } from "./SessionHeader";
import { EntryContent } from "./entry/EntryContent";
import { Trade } from "@/types/trade";

interface JournalEntry {
  id: string;
  created_at: string;
  session_type: string;
  emotion: string;
  emotion_detail: string;
  notes: string;
  outcome?: string;
  market_conditions?: string;
  followed_rules?: string[];
  trades?: Trade[];
  screenshots?: string[];
}

interface JournalEntryProps {
  entry: JournalEntry;
}

export const JournalEntry = ({ entry }: JournalEntryProps) => {
  const formattedDate = new Date(entry.created_at).toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Ensure trades have their screenshots
  const tradesWithScreenshots = entry.trades?.map(trade => ({
    ...trade,
    screenshots: trade.screenshots || []
  }));

  return (
    <Card className="p-6 rounded-lg bg-background/50 border border-primary/10 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col gap-6">
        <SessionHeader
          date={formattedDate}
          sessionType={entry.session_type}
          emotion={entry.emotion}
          emotionDetail={entry.emotion_detail}
          outcome={entry.outcome}
        />

        <EntryContent
          marketConditions={entry.market_conditions}
          notes={entry.notes}
          followedRules={entry.followed_rules}
          trades={tradesWithScreenshots}
          screenshots={entry.screenshots}
        />
      </div>
    </Card>
  );
};