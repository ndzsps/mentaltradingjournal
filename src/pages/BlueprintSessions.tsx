import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Session {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  symbol: string;
  market_type: string;
}

interface Blueprint {
  id: string;
  name: string;
  rules: string[];
}

export default function BlueprintSessions() {
  const { blueprintId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);

  useEffect(() => {
    if (blueprintId) {
      fetchBlueprint();
      fetchSessions();
    }
  }, [blueprintId]);

  const fetchBlueprint = async () => {
    const { data, error } = await supabase
      .from("trading_blueprints")
      .select("*")
      .eq("id", blueprintId)
      .single();

    if (!error && data) {
      setBlueprint(data);
    }
  };

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from("backtesting_sessions")
      .select("*")
      .eq("playbook_id", blueprintId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSessions(data);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/backtesting")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">
            {blueprint?.name || "Blueprint"} Sessions
          </h1>
        </div>

        {sessions.length > 0 ? (
          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-4">
              {sessions.map((session) => (
                <Card key={session.id} className="min-w-[300px]">
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
                        <span>
                          {formatDate(session.start_date)} - {formatDate(session.end_date)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <p className="text-center text-muted-foreground">
            No sessions found for this blueprint
          </p>
        )}
      </div>
    </AppLayout>
  );
}