import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressItemProps {
  icon: LucideIcon;
  title: string;
  value: number;
  maxValue: number;
  color: "primary" | "secondary" | "accent";
  unit?: string;
}

export const ProgressItem = ({
  icon: Icon,
  title,
  value,
  maxValue,
  color,
  unit = "entries",
}: ProgressItemProps) => {
  const progressValue = (value / maxValue) * 100;
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    accent: "text-accent bg-accent/10",
  };

  const progressClasses = {
    primary: "bg-primary/20 [&>div]:bg-primary",
    secondary: "bg-secondary/20 [&>div]:bg-secondary",
    accent: "bg-accent/20 [&>div]:bg-accent",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4"
    >
      <div className={`p-2 rounded-full ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">{title}</span>
          <span className={`text-sm ${`text-${color}`}`}>
            {value} {unit}
          </span>
        </div>
        <Progress
          value={progressValue}
          className={`h-1 ${progressClasses[color]}`}
        />
      </div>
    </motion.div>
  );
};