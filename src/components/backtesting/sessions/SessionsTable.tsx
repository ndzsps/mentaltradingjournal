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

interface SessionsTableProps {
  sessions: Session[];
}

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

export const SessionsTable = ({ sessions }: SessionsTableProps) => {
  return (
    <div className="rounded-md border">
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
  );
};