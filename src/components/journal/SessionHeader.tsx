import { Badge } from "@/components/ui/badge";
import { EmotionBadge } from "./EmotionBadge";

interface SessionHeaderProps {
  date: string;
  sessionType: string;
  emotion: string;
  emotionDetail: string;
  outcome?: string;
}

export const SessionHeader = ({ 
  date,
  sessionType,
  emotion,
  emotionDetail,
  outcome
}: SessionHeaderProps) => {
  const isPreSession = sessionType === 'pre';

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {date}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Badge 
          variant={isPreSession ? "default" : "secondary"}
          className="capitalize px-4 py-1.5 rounded-full text-sm font-medium"
        >
          {isPreSession ? 'Pre-Session' : 'Post-Session'}
        </Badge>
        <EmotionBadge emotion={emotion} detail={emotionDetail} />
        {!isPreSession && outcome && (
          <Badge 
            variant="outline" 
            className={`capitalize px-4 py-1.5 rounded-full text-sm font-medium ${
              outcome === 'loss' 
                ? 'border-red-500/50 text-red-500 bg-red-500/5 hover:bg-red-500/10' 
                : 'border-green-500/50 text-green-500 bg-green-500/5 hover:bg-green-500/10'
            }`}
          >
            {outcome.charAt(0).toUpperCase() + outcome.slice(1)}
          </Badge>
        )}
      </div>
    </div>
  );
};