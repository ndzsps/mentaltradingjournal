import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BlueprintCardProps {
  name: string;
  instrument: string;
  winRate?: number;
  id: string;
}

interface Session {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  symbol: string;
  market_type: string;
}

export function BlueprintCard({ name, instrument, winRate = 0, id }: BlueprintCardProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      fetchSessions();
    }
  }, [isExpanded]);

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from("backtesting_sessions")
      .select("*")
      .eq("playbook_id", id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSessions(data);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card 
      className="bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-primary/10">
            {instrument}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Win Rate: {winRate}%
          </span>
        </div>

        {isExpanded && sessions.length > 0 && (
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-4 pb-4">
              {sessions.map((session) => (
                <Card key={session.id} className="inline-block min-w-[300px]">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">{session.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Symbol:</span>
                        <span>{session.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Market:</span>
                        <span>{session.market_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Period:</span>
                        <span>{formatDate(session.start_date)} - {formatDate(session.end_date)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        {isExpanded && sessions.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No sessions found for this blueprint
          </p>
        )}
      </CardContent>
    </Card>
  );
}