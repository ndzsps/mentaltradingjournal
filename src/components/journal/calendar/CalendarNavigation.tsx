import { ChevronLeft, ChevronRight } from "lucide-react";

export const CalendarNavigation = () => {
  return {
    IconLeft: () => (
      <div className="bg-gradient-to-r from-primary-light to-accent bg-clip-text">
        <ChevronLeft className="h-6 w-6 stroke-primary-light dark:stroke-primary-light" />
      </div>
    ),
    IconRight: () => (
      <div className="bg-gradient-to-r from-primary-light to-accent bg-clip-text">
        <ChevronRight className="h-6 w-6 stroke-primary-light dark:stroke-primary-light" />
      </div>
    ),
  };
};