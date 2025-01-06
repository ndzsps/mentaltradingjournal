import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface LevelProgressProps {
  level: number;
  levelProgress: number;
}

export const LevelProgress = ({ level, levelProgress }: LevelProgressProps) => {
  const getLevelColor = (level: number) => {
    if (level === 1) return "bg-secondary/10";
    return "bg-primary/10";
  };

  const getLevelTextColor = (level: number) => {
    if (level === 1) return "text-secondary";
    return "text-primary";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="flex items-center gap-4"
    >
      <div className={`p-2 rounded-full ${getLevelColor(level)}`}>
        <TrendingUp className={`w-5 h-5 ${getLevelTextColor(level)}`} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Level {level}</span>
          <span className={`text-sm ${getLevelTextColor(level)}`}>{levelProgress}%</span>
        </div>
        <Progress 
          value={levelProgress} 
          className={`h-1 ${level === 1 ? "[--progress:theme(colors.secondary.DEFAULT)]" : ""}`} 
        />
      </div>
    </motion.div>
  );
};