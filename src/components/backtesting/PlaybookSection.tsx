import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddBlueprintForm } from "./AddBlueprintForm";

export function PlaybookSection() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Playbook</CardTitle>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Blueprint
          </Button>
        </DialogTrigger>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Select or create a playbook to view trading rules and strategies for your backtesting session.
        </p>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Trading Blueprint</DialogTitle>
            </DialogHeader>
            <AddBlueprintForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}