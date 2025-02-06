import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { JournalCalendar } from "@/components/journal/JournalCalendar";
import { JournalFilters } from "@/components/journal/JournalFilters";
import { WeeklyPerformance } from "@/components/journal/WeeklyPerformance";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Journal = () => {
  const navigate = useNavigate();

  const handleSessionClick = (sessionType: "pre" | "post") => {
    navigate("/journal-entry", { state: { initialSessionType: sessionType } });
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Trading Journal</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Track your trading journey and emotional patterns
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => handleSessionClick("pre")}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Pre-Session
            </Button>
            <Button
              className="flex-1 sm:flex-none"
              onClick={() => handleSessionClick("post")}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Post-Session
            </Button>
          </div>
        </div>

        <JournalFilters />
        
        <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
          <JournalCalendar />
          <WeeklyPerformance />
        </div>
      </div>
    </AppLayout>
  );
};

export default Journal;