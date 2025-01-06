import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface JournalEntry {
  id: string;
  created_at: string;
  session_type: string;
  emotion: string;
  emotion_detail: string;
  notes: string;
  outcome?: string;
  market_conditions?: string;
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
    <Card className="p-4 rounded-lg bg-background/50 border border-primary/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge 
            variant={entry.session_type === 'pre' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {entry.session_type}-Session
          </Badge>
          {entry.session_type === 'post' && entry.outcome && (
            <Badge 
              variant="outline" 
              className={`capitalize ${
                entry.outcome === 'loss' 
                  ? 'border-red-500/50 text-red-500' 
                  : 'border-accent/50 text-accent-foreground'
              }`}
            >
              {entry.outcome}
            </Badge>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {formattedDate}
        </span>
      </div>
      <p className="font-medium text-foreground mb-1">
        Feeling: {entry.emotion} - {entry.emotion_detail}
      </p>
      {entry.market_conditions && (
        <p className="text-sm text-muted-foreground">
          Market Conditions: {entry.market_conditions.replace('_', ' ')}
        </p>
      )}
      <p className="mt-2 text-sm text-foreground/90">
        {entry.notes}
      </p>
    </Card>
  );
};