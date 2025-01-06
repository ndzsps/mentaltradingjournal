import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { toast } from "sonner";

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

    console.log('Initial stats:', {
      preSessionStreak,
      postSessionStreak,
      dailyStreak,
      level,
      levelProgress,
    });

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
          console.log('Progress stats update received:', payload);
          if (payload.new) {
            const newStats: ProgressStats = {
              preSessionStreak: payload.new.pre_session_streak,
              postSessionStreak: payload.new.post_session_streak,
              dailyStreak: payload.new.daily_streak,
              level: payload.new.level,
              levelProgress: payload.new.level_progress,
            };

            // Check if pre-session streak increased
            if (payload.new.pre_session_streak > previousPreStreak) {
              const randomMessage = inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)];
              toast.success(randomMessage, {
                duration: 5000,
                className: "bg-primary text-white",
              });
            }

            // Check if post-session streak increased
            if (payload.new.post_session_streak > previousPostStreak) {
              const randomMessage = inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)];
              toast.success(randomMessage, {
                duration: 5000,
                className: "bg-primary text-white",
              });
            }

            setPreviousPreStreak(payload.new.pre_session_streak);
            setPreviousPostStreak(payload.new.post_session_streak);
            
            console.log('Updating stats to:', newStats);
            setStats(newStats);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [user, preSessionStreak, postSessionStreak, dailyStreak, level, levelProgress, previousPreStreak, previousPostStreak]);

  return (
    <Card className="p-6 space-y-6 bg-card/30 backdrop-blur-xl border-primary/10">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Your Progress</h3>
        <p className="text-sm text-muted-foreground">
          Track your trading journal consistency
        </p>
      </div>

      <div className="grid gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <div className="p-2 rounded-full bg-primary/10">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Pre-Session Daily Goal</span>
              <span className="text-sm text-primary">{stats.preSessionStreak} entries</span>
            </div>
            <Progress value={(stats.preSessionStreak / 30) * 100} className="h-1" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <div className="p-2 rounded-full bg-secondary/10">
            <Star className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Post-Session Daily Goal</span>
              <span className="text-sm text-secondary">
                {stats.postSessionStreak} entries
              </span>
            </div>
            <Progress
              value={(stats.postSessionStreak / 30) * 100}
              className="h-1 bg-secondary/20 [&>div]:bg-secondary"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4"
        >
          <div className="p-2 rounded-full bg-accent/10">
            <Flame className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Daily Activity Streak</span>
              <span className="text-sm text-accent-foreground">
                {stats.dailyStreak} days
              </span>
            </div>
            <Progress
              value={(stats.dailyStreak / 30) * 100}
              className="h-1 bg-accent/20 [&>div]:bg-accent"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <div className="p-2 rounded-full bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Level {stats.level}</span>
              <span className="text-sm text-primary">{stats.levelProgress}%</span>
            </div>
            <Progress value={stats.levelProgress} className="h-1" />
          </div>
        </motion.div>
      </div>
    </Card>
  );
};