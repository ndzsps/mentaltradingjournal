import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Flame, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

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
              <span className="text-sm font-medium">Pre-Session Streak</span>
              <span className="text-sm text-primary">{preSessionStreak} days</span>
            </div>
            <Progress value={(preSessionStreak / 30) * 100} className="h-1" />
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
              <span className="text-sm font-medium">Post-Session Streak</span>
              <span className="text-sm text-secondary">
                {postSessionStreak} days
              </span>
            </div>
            <Progress
              value={(postSessionStreak / 30) * 100}
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
              <span className="text-sm font-medium">Daily Streak</span>
              <span className="text-sm text-accent-foreground">
                {dailyStreak} days
              </span>
            </div>
            <Progress
              value={(dailyStreak / 30) * 100}
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
              <span className="text-sm font-medium">Level {level}</span>
              <span className="text-sm text-primary">{levelProgress}%</span>
            </div>
            <Progress value={levelProgress} className="h-1" />
          </div>
        </motion.div>
      </div>
    </Card>
  );
};