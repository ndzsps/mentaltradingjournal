
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Session } from "./types";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditSessionDialogProps {
  session: Session | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditSessionDialog = ({ session, open, onOpenChange }: EditSessionDialogProps) => {
  const [formData, setFormData] = useState<Partial<Session>>(session || {});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("backtesting_sessions")
        .update({
          entry_price: formData.entryPrice,
          exit_price: formData.exitPrice,
          quantity: formData.quantity,
          stop_loss: formData.stopLoss,
          take_profit: formData.takeProfit,
          highest_price: formData.highestPrice,
          lowest_price: formData.lowestPrice,
          pnl: formData.pnl,
        })
        .eq("id", session.id);

      if (error) throw error;

      toast.success("Trade updated successfully");
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update trade");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!session?.id) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("backtesting_sessions")
        .delete()
        .eq("id", session.id);

      if (error) throw error;

      toast.success("Trade deleted successfully");
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete trade");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Trade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.00001"
                value={formData.entryPrice || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: parseFloat(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exitPrice">Exit Price</Label>
              <Input
                id="exitPrice"
                type="number"
                step="0.00001"
                value={formData.exitPrice || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, exitPrice: parseFloat(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.quantity || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss</Label>
              <Input
                id="stopLoss"
                type="number"
                step="0.00001"
                value={formData.stopLoss || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, stopLoss: parseFloat(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit</Label>
              <Input
                id="takeProfit"
                type="number"
                step="0.00001"
                value={formData.takeProfit || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, takeProfit: parseFloat(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pnl">P&L</Label>
              <Input
                id="pnl"
                type="number"
                step="0.01"
                value={formData.pnl || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, pnl: parseFloat(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="highestPrice">Highest Price</Label>
              <Input
                id="highestPrice"
                type="number"
                step="0.00001"
                value={formData.highestPrice || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, highestPrice: parseFloat(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowestPrice">Lowest Price</Label>
              <Input
                id="lowestPrice"
                type="number"
                step="0.00001"
                value={formData.lowestPrice || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, lowestPrice: parseFloat(e.target.value) }))}
              />
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete Trade"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this trade and remove it from your statistics.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
