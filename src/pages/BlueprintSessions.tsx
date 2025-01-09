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
  symbol: string;
  market_type: string;
  start_balance: number;
  leverage: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

export default function BlueprintSessions() {
  const { blueprintId } = useParams();
  const navigate = useNavigate();
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
      setSessions(data);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
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
                  <TableHead>Symbol</TableHead>
                  <TableHead>Market Type</TableHead>
                  <TableHead className="text-right">Start Balance</TableHead>
                  <TableHead className="text-right">Leverage</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.symbol}</TableCell>
                    <TableCell>{session.market_type}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(session.start_balance)}
                    </TableCell>
                    <TableCell className="text-right">{session.leverage}x</TableCell>
                    <TableCell>{new Date(session.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(session.end_date).toLocaleDateString()}</TableCell>
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