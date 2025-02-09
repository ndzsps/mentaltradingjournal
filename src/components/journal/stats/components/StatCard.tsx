
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  prefix?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  valueColor = "text-foreground",
  prefix
}: StatCardProps) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className={`text-2xl font-bold ${valueColor}`}>
        {prefix}{value}
      </div>
      <div className="text-sm text-muted-foreground">
        {subtitle}
      </div>
    </Card>
  );
};
