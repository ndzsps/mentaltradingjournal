import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Session {
  id: string;
  name: string;
  trades: number;
  net_pnl: number;
  win_rate: number;
  missed_trades: number;
  expectancy: number;
  average_loser: number;
  average_winner: number;
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
      // Transform the data to include calculated fields
      const transformedSessions = data.map(session => ({
        ...session,
        trades: Math.floor(Math.random() * 10), // Placeholder - replace with actual data
        net_pnl: Math.random() * 100000, // Placeholder - replace with actual data
        win_rate: Math.random() * 100, // Placeholder - replace with actual data
        missed_trades: Math.floor(Math.random() * 5), // Placeholder - replace with actual data
        expectancy: Math.random() * 50000, // Placeholder - replace with actual data
        average_loser: -(Math.random() * 10000), // Placeholder - replace with actual data
        average_winner: Math.random() * 20000, // Placeholder - replace with actual data
      }));
      setSessions(transformedSessions);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Trades</TableHead>
                  <TableHead className="text-right">Net P&L</TableHead>
                  <TableHead className="text-right">Win Rate</TableHead>
                  <TableHead className="text-right">Missed Trades</TableHead>
                  <TableHead className="text-right">Expectancy</TableHead>
                  <TableHead className="text-right">Average Loser</TableHead>
                  <TableHead className="text-right">Average Winner</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.name}</TableCell>
                    <TableCell className="text-right">{session.trades}</TableCell>
                    <TableCell className="text-right">{formatCurrency(session.net_pnl)}</TableCell>
                    <TableCell className="text-right">{formatPercentage(session.win_rate)}</TableCell>
                    <TableCell className="text-right">{session.missed_trades}</TableCell>
                    <TableCell className="text-right">{formatCurrency(session.expectancy)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(session.average_loser)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(session.average_winner)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Session</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete Session
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No sessions found for this blueprint
          </p>
        )}
      </div>
    </AppLayout>
  );
}