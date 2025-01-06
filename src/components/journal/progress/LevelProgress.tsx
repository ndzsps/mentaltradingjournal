import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface LevelProgressProps {
  level: number;
  levelProgress: number;
}

export const LevelProgress = ({ level, levelProgress }: LevelProgressProps) => {
  return (
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
  );
};