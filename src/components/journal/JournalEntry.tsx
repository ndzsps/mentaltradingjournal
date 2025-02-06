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
  trades?: Trade[];
  followed_rules?: string[];
  post_submission_notes?: string;
  pre_trading_activities?: string[];
  weekly_url?: string;
  daily_url?: string;
  four_hour_url?: string;
  one_hour_url?: string;
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
          id={entry.id}
          marketConditions={entry.market_conditions}
          notes={entry.notes}
          followedRules={entry.followed_rules}
          trades={entry.trades}
          postSubmissionNotes={entry.post_submission_notes}
          preTradingActivities={entry.pre_trading_activities}
          weeklyUrl={entry.weekly_url}
          dailyUrl={entry.daily_url}
          fourHourUrl={entry.four_hour_url}
          oneHourUrl={entry.one_hour_url}
        />
      </div>
    </Card>
  );
};