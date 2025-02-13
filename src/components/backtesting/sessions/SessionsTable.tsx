
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink, Pencil } from "lucide-react";
import { Session } from "./types";
import { BacktestingStats } from "./BacktestingStats";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EditSessionDialog } from "./EditSessionDialog";

interface SessionsTableProps {
  sessions: Session[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  }).format(value);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit'
  }).format(date);
};

const renderUrlLink = (url: string | null, label: string) => {
  if (!url) return '-';
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0"
      onClick={() => window.open(url, '_blank')}
    >
      <ExternalLink className="h-4 w-4" />
      <span className="sr-only">View {label} chart</span>
    </Button>
  );
};

export const SessionsTable = ({ sessions }: SessionsTableProps) => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <BacktestingStats sessions={sessions} />
      <div className="rounded-md border">
        <div className="overflow-hidden">
          <div className="max-h-[640px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Entry Date</TableHead>
                  <TableHead>Exit Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Instrument</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead className="text-right">Entry Price</TableHead>
                  <TableHead className="text-right">Exit Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Stop Loss</TableHead>
                  <TableHead className="text-right">Take Profit</TableHead>
                  <TableHead className="text-right">Highest Price</TableHead>
                  <TableHead className="text-right">Lowest Price</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-center">Weekly</TableHead>
                  <TableHead className="text-center">Daily</TableHead>
                  <TableHead className="text-center">4H</TableHead>
                  <TableHead className="text-center">1H</TableHead>
                  <TableHead className="text-center">Entry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="w-[40px] px-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedSession(session);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit trade</span>
                      </Button>
                    </TableCell>
                    <TableCell>{formatDate(session.entryDate)}</TableCell>
                    <TableCell>{formatDate(session.exitDate)}</TableCell>
                    <TableCell>{session.duration || '-'}</TableCell>
                    <TableCell>{session.instrument || '-'}</TableCell>
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
                    <TableCell className="text-right">{formatNumber(session.entryPrice)}</TableCell>
                    <TableCell className="text-right">{formatNumber(session.exitPrice)}</TableCell>
                    <TableCell className="text-right">{session.quantity}</TableCell>
                    <TableCell className="text-right">{formatNumber(session.stopLoss)}</TableCell>
                    <TableCell className="text-right">{formatNumber(session.takeProfit)}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">{formatNumber(session.highestPrice)}</TableCell>
                    <TableCell className="text-right font-medium text-red-600">{formatNumber(session.lowestPrice)}</TableCell>
                    <TableCell className={`text-right font-medium ${
                      session.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(session.pnl)}
                    </TableCell>
                    <TableCell className="text-center">{renderUrlLink(session.weeklyUrl, 'Weekly')}</TableCell>
                    <TableCell className="text-center">{renderUrlLink(session.dailyUrl, 'Daily')}</TableCell>
                    <TableCell className="text-center">{renderUrlLink(session.fourHourUrl, '4H')}</TableCell>
                    <TableCell className="text-center">{renderUrlLink(session.oneHourUrl, '1H')}</TableCell>
                    <TableCell className="text-center">{renderUrlLink(session.refinedEntryUrl, 'Entry')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <EditSessionDialog
        session={selectedSession}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};
