import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AddBlueprintForm } from "./AddBlueprintForm";

interface PlaybookSectionProps {
  onBlueprintAdded?: () => void;
}

export function PlaybookSection({ onBlueprintAdded }: PlaybookSectionProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onBlueprintAdded) {
      onBlueprintAdded();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Playbook</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">+ Add Blueprint</Button>
          </DialogTrigger>
          <DialogContent>
            <AddBlueprintForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}