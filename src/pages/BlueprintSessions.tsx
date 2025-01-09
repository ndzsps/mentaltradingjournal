import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, ExternalLink } from "lucide-react";
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
  entryDate: string;
  instrument: string;
  setup: string;
  direction: 'buy' | 'sell' | null;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  pnl: number;
  fees: number;
  weeklyUrl: string | null;
  dailyUrl: string | null;
  fourHourUrl: string | null;
  oneHourUrl: string | null;
  refinedEntryUrl: string | null;
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
        fees: session.fees || 0,
        weeklyUrl: session.weekly_url,
        dailyUrl: session.daily_url,
        fourHourUrl: session.four_hour_url,
        oneHourUrl: session.one_hour_url,
        refinedEntryUrl: session.refined_entry_url,
      }));
      setSessions(mappedSessions);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const renderUrlLink = (url: string | null, label: string) => {
    return url ? (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
      >
        <ExternalLink className="h-4 w-4" />
      </a>
    ) : '-';
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
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entry Date</TableHead>
                  <TableHead>Instrument</TableHead>
                  <TableHead>Setup</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead className="text-right">Entry Price</TableHead>
                  <TableHead className="text-right">Exit Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Stop Loss</TableHead>
                  <TableHead className="text-right">Take Profit</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-right">Fees</TableHead>
                  <TableHead className="text-center">Weekly</TableHead>
                  <TableHead className="text-center">Daily</TableHead>
                  <TableHead className="text-center">4H</TableHead>
                  <TableHead className="text-center">1H</TableHead>
                  <TableHead className="text-center">Entry</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.entryDate ? new Date(session.entryDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{session.instrument || '-'}</TableCell>
                    <TableCell>{session.setup || '-'}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        session.direction === 'buy' 
                          ? 'text-green-600' 
                          : session.direction === 'sell'
                            ? 'text-red-600'
                            : ''
                      }`}>
                        {session.direction ? session.direction.toUpperCase() : '-'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(session.entryPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(session.exitPrice)}</TableCell>
                    <TableCell className="text-right">{session.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(session.stopLoss)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(session.takeProfit)}</TableCell>
                    <TableCell className={`text-right font-medium ${
                      session.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(session.pnl)}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(session.fees)}</TableCell>
                    <TableCell className="text-center">{renderUrlLink(session.weeklyUrl, 'Weekly')}</TableCell>
                    <TableCell className="text-center">{renderUrlLink(session.dailyUrl, 'Daily')}</TableCell>
                    <TableCell className="text-center">{renderUrlLink(session.fourHourUrl, '4H')}</TableCell>
                    <TableCell className="text-center">{renderUrlLink(session.oneHourUrl, '1H')}</TableCell>
                    <TableCell className="text-center">{renderUrlLink(session.refinedEntryUrl, 'Entry')}</TableCell>
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