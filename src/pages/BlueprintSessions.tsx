import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { SessionsTable } from "@/components/backtesting/sessions/SessionsTable";
import { SessionHeader } from "@/components/backtesting/sessions/SessionHeader";
import { Session } from "@/components/backtesting/sessions/types";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";

export default function BlueprintSessions() {
  const { blueprintId } = useParams();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [blueprint, setBlueprint] = useState<{ id: string; name: string; } | null>(null);

  useEffect(() => {
    if (blueprintId) {
      fetchBlueprint();
      fetchSessions();
    }
  }, [blueprintId]);

  const fetchBlueprint = async () => {
    const { data, error } = await supabase
      .from("trading_blueprints")
      .select("id, name")
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
      const mappedSessions = data.map(session => ({
        id: session.id,
        entryDate: session.entry_date || '',
        instrument: session.instrument || '',
        setup: session.setup || '',
        direction: session.direction as 'buy' | 'sell' | null,
        entryPrice: session.entry_price || 0,
        exitPrice: session.exit_price || 0,
        quantity: session.quantity || 0,
        stopLoss: session.stop_loss || 0,
        takeProfit: session.take_profit || 0,
        pnl: session.pnl || 0,
        weeklyUrl: session.weekly_url,
        dailyUrl: session.daily_url,
        fourHourUrl: session.four_hour_url,
        oneHourUrl: session.one_hour_url,
        refinedEntryUrl: session.refined_entry_url,
      }));
      setSessions(mappedSessions);
    }
  };

  return (
    <AppLayout>
      <SubscriptionGate>
        <div className="container mx-auto px-4 py-8">
          <SessionHeader blueprintName={blueprint?.name || ""} />
          {sessions.length > 0 ? (
            <SessionsTable sessions={sessions} />
          ) : (
            <p className="text-center text-muted-foreground">
              No sessions found for this blueprint
            </p>
          )}
        </div>
      </SubscriptionGate>
    </AppLayout>
  );
}