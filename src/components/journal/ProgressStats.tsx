import { Card } from "@/components/ui/card";
import { Trophy, Flame, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { toast } from "sonner";
import { ProgressItem } from "./progress/ProgressItem";
import { LevelProgress } from "./progress/LevelProgress";

interface ProgressStats {
  preSessionStreak: number;
  postSessionStreak: number;
  dailyStreak: number;
  level: number;
  levelProgress: number;
}

interface ProgressStatsRow {
  pre_session_streak: number;
  post_session_streak: number;
  daily_streak: number;
  level: number;
  level_progress: number;
}

const inspirationalMessages = [
  "Great job! Every step you take brings you closer to your goals.",
  "You've just made progress! Small habits lead to big changes.",
  "Well done! Reflecting like this is a powerful way to grow.",
  "You're building consistency—keep up the momentum!",
  "Another win for today! Your dedication is inspiring.",
  "Awesome! Every entry is a step toward self-awareness.",
  "You're on a roll! Keep tracking, and great insights will follow.",
  "Nice work! This entry is one more piece of your success story.",
  "Way to go! Your discipline is paving the way for better results.",
  "Fantastic effort! Reflecting on your journey is how you master it."
];

interface ProgressStatsProps {
  preSessionStreak: number;
  postSessionStreak: number;
  dailyStreak: number;
  level: number;
  levelProgress: number;
}

export const ProgressStats = ({
  preSessionStreak,
  postSessionStreak,
  dailyStreak,
  level,
  levelProgress,
}: ProgressStatsProps) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProgressStats>({
    preSessionStreak,
    postSessionStreak,
    dailyStreak,
    level,
    levelProgress,
  });
  const [previousPreStreak, setPreviousPreStreak] = useState(preSessionStreak);
  const [previousPostStreak, setPreviousPostStreak] = useState(postSessionStreak);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('progress_stats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress_stats',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<ProgressStatsRow>) => {
          if (payload.new) {
            const newStats: ProgressStats = {
              preSessionStreak: payload.new.pre_session_streak,
              postSessionStreak: payload.new.post_session_streak,
              dailyStreak: payload.new.daily_streak,
              level: payload.new.level,
              levelProgress: payload.new.level_progress,
            };

            if (payload.new.pre_session_streak > previousPreStreak) {
              const randomMessage = inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)];
              toast.success(randomMessage, {
                duration: 5000,
                className: "bg-primary text-white",
              });
            }

            if (payload.new.post_session_streak > previousPostStreak) {
              const randomMessage = inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)];
              toast.success(randomMessage, {
                duration: 5000,
                className: "bg-primary text-white",
              });
            }

            setPreviousPreStreak(payload.new.pre_session_streak);
            setPreviousPostStreak(payload.new.post_session_streak);
            setStats(newStats);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, previousPreStreak, previousPostStreak]);

  return (
    <Card className="p-6 space-y-6 bg-card/30 backdrop-blur-xl border-primary/10">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Your Progress</h3>
        <p className="text-sm text-muted-foreground">
          Track your trading journal consistency
        </p>
      </div>

      <div className="grid gap-4">
        <ProgressItem
          icon={Trophy}
          title="Pre-Session Daily Goal"
          value={stats.preSessionStreak}
          maxValue={30}
          color="primary"
        />

        <ProgressItem
          icon={Star}
          title="Post-Session Daily Goal"
          value={stats.postSessionStreak}
          maxValue={30}
          color="secondary"
        />

        <ProgressItem
          icon={Flame}
          title="Daily Activity Streak"
          value={stats.dailyStreak}
          maxValue={30}
          color="accent"
          unit="days"
        />

        <LevelProgress
          level={stats.level}
          levelProgress={stats.levelProgress}
        />
      </div>
    </Card>
  );
};