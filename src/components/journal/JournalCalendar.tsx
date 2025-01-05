import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { DayProps } from "react-day-picker";

interface JournalCalendarProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  entries: Array<{
    date: Date;
    emotion: string;
  }>;
}

export const JournalCalendar = ({ date, onDateSelect, entries }: JournalCalendarProps) => {
  // Get dates that have entries matching the current filters
  const datesWithMatchingEntries = entries.map(entry => entry.date);

  // Create a modifier styles object for different emotion states
  const getEmotionStyle = (date: Date) => {
    const entry = entries.find(e => 
      e.date.toDateString() === date.toDateString()
    );
    
    if (!entry) return null;

    return {
      emotion: entry.emotion === "Positive" ? "bg-[#F2FCE2]" : "bg-[#FEF7CD]"
    };
  };

  return (
    <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/10 shadow-2xl">
      <Calendar
        mode="single"
        selected={date}
        onSelect={onDateSelect}
        className="w-full"
        classNames={{
          months: "w-full",
          month: "w-full",
          table: "w-full",
          head_row: "w-full",
          row: "w-full",
          cell: "w-[14.28%] h-14 lg:h-16 p-0 relative",
          day: "w-full h-full rounded-md hover:bg-primary/20",
          day_today: "bg-accent text-accent-foreground",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        }}
        components={{
          Day: ({ date: dayDate, ...props }: DayProps) => {
            const emotionStyle = getEmotionStyle(dayDate);
            return (
              <div className="relative w-full h-full">
                <button {...props} className={`w-full h-full ${props.className || ''}`}>
                  {dayDate.getDate()}
                </button>
                {emotionStyle && (
                  <div 
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${emotionStyle.emotion}`}
                  />
                )}
              </div>
            );
          }
        }}
      />
    </Card>
  );
};