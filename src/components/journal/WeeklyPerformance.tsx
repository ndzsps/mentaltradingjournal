import { useWeeklyStats } from "@/hooks/useWeeklyStats";
import { WeekCard } from "./weekly/WeekCard";
import { LoadingSkeleton } from "./weekly/LoadingSkeleton";

export const WeeklyPerformance = () => {
  const { data: weeklyStats, isLoading } = useWeeklyStats();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-20rem)] pt-[150px]">
      {weeklyStats?.map((week) => (
        <WeekCard
          key={week.weekNumber}
          weekNumber={week.weekNumber}
          totalPnL={week.totalPnL}
        />
      ))}
    </div>
  );
};