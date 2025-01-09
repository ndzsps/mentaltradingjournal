import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PlaybookSection() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Playbook</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Select or create a playbook to view trading rules and strategies for your backtesting session.
        </p>
      </CardContent>
    </Card>
  );
}