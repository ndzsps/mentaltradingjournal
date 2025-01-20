import { Separator } from "@/components/ui/separator";
import { TradesList } from "./TradesList";
import { TradingRules } from "./TradingRules";
import { Trade } from "@/types/trade";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface EntryContentProps {
  id?: string;
  marketConditions?: string;
  notes?: string;
  followedRules?: string[];
  trades?: Trade[];
  postSubmissionNotes?: string;
  preTradingActivities?: string[];
}

const capitalizeWords = (str: string) => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const EntryContent = ({ 
  id,
  marketConditions, 
  notes, 
  followedRules, 
  trades,
  postSubmissionNotes: initialPostSubmissionNotes,
  preTradingActivities
}: EntryContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [postSubmissionNotes, setPostSubmissionNotes] = useState(initialPostSubmissionNotes || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotes = async () => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('journal_entries')
        .update({ post_submission_notes: postSubmissionNotes })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Notes saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error("Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {preTradingActivities && preTradingActivities.length > 0 && (
        <Card className="p-4 bg-background/50 border border-primary/10">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Pre-Trading Activities</h4>
          <div className="grid grid-cols-2 gap-2">
            {preTradingActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>{activity}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {marketConditions && (
        <p className="text-sm text-muted-foreground">
          Market Conditions: {capitalizeWords(marketConditions)}
        </p>
      )}
      
      {notes && (
        <p className="text-sm text-foreground/90">
          {notes}
        </p>
      )}

      {followedRules && <TradingRules rules={followedRules} />}

      {Array.isArray(trades) && trades.length > 0 && (
        <div>
          <Separator className="mb-6" />
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Trades</h4>
            <TradesList trades={trades} />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">Additional Notes</h4>
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Add Notes
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={postSubmissionNotes}
              onChange={(e) => setPostSubmissionNotes(e.target.value)}
              placeholder="Add your notes here..."
              className="min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setPostSubmissionNotes(initialPostSubmissionNotes || "");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveNotes}
                disabled={isSaving}
              >
                Save Notes
              </Button>
            </div>
          </div>
        ) : (
          postSubmissionNotes && (
            <p className="text-sm text-foreground/90 p-4 bg-muted/50 rounded-lg">
              {postSubmissionNotes}
            </p>
          )
        )}
      </div>
    </div>
  );
};