
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { Session } from "./types";
import { BacktestingStats } from "./BacktestingStats";
import { Button } from "@/components/ui/button";

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

const formatQuantity = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
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
  return (
    <div className="space-y-6">
      <BacktestingStats sessions={sessions} />
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Entry Date</TableHead>
                <TableHead className="whitespace-nowrap">Instrument</TableHead>
                <TableHead className="whitespace-nowrap">Direction</TableHead>
                <TableHead className="text-right whitespace-nowrap">Entry Price</TableHead>
                <TableHead className="text-right whitespace-nowrap">Exit Price</TableHead>
                <TableHead className="text-right whitespace-nowrap">Qty</TableHead>
                <TableHead className="text-right whitespace-nowrap">SL</TableHead>
                <TableHead className="text-right whitespace-nowrap">TP</TableHead>
                <TableHead className="text-right whitespace-nowrap">High</TableHead>
                <TableHead className="text-right whitespace-nowrap">Low</TableHead>
                <TableHead className="text-right whitespace-nowrap">P&L</TableHead>
                <TableHead className="text-center whitespace-nowrap w-[40px]">W</TableHead>
                <TableHead className="text-center whitespace-nowrap w-[40px]">D</TableHead>
                <TableHead className="text-center whitespace-nowrap w-[40px]">4H</TableHead>
                <TableHead className="text-center whitespace-nowrap w-[40px]">1H</TableHead>
                <TableHead className="text-center whitespace-nowrap w-[40px]">E</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="whitespace-nowrap">{session.entryDate ? new Date(session.entryDate).toLocaleDateString() : '-'}</TableCell>
                  <TableCell className="whitespace-nowrap">{session.instrument || '-'}</TableCell>
                  <TableCell className="whitespace-nowrap">
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
                  <TableCell className="text-right whitespace-nowrap">{formatNumber(session.entryPrice)}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{formatNumber(session.exitPrice)}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{formatQuantity(session.quantity)}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{formatNumber(session.stopLoss)}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{formatNumber(session.takeProfit)}</TableCell>
                  <TableCell className="text-right whitespace-nowrap font-medium text-green-600">{formatNumber(session.highestPrice)}</TableCell>
                  <TableCell className="text-right whitespace-nowrap font-medium text-red-600">{formatNumber(session.lowestPrice)}</TableCell>
                  <TableCell className={`text-right whitespace-nowrap font-medium ${
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
  );
};
