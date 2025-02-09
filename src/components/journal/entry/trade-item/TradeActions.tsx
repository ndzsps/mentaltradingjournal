
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Trade } from "@/types/trade";

interface TradeActionsProps {
  trade: Trade;
  onEdit: (trade: Trade) => void;
  onDelete: (trade: Trade) => void;
}

export const TradeActions = ({ trade, onEdit, onDelete }: TradeActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(trade)}
        className="flex items-center gap-2"
      >
        <Pencil className="h-4 w-4" /> Edit Trade
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(trade)}
        className="flex items-center gap-2 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" /> Delete
      </Button>
    </div>
  );
};
