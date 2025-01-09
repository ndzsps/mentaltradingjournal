import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaybookSectionProps {
  selectedPlaybook?: {
    name: string;
    description: string;
    rules: string[];
    setup_criteria: string[];
    entry_rules: string[];
    exit_rules: string[];
    risk_management: string[];
  };
}

export function PlaybookSection({ selectedPlaybook }: PlaybookSectionProps) {
  if (!selectedPlaybook) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Playbook</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select a playbook to view trading rules and strategies for your backtesting session.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{selectedPlaybook.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedPlaybook.description && (
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{selectedPlaybook.description}</p>
          </div>
        )}

        {selectedPlaybook.rules.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">General Rules</h3>
            <ul className="list-disc pl-5 space-y-1">
              {selectedPlaybook.rules.map((rule, index) => (
                <li key={index} className="text-muted-foreground">{rule}</li>
              ))}
            </ul>
          </div>
        )}

        {selectedPlaybook.setup_criteria.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Setup Criteria</h3>
            <ul className="list-disc pl-5 space-y-1">
              {selectedPlaybook.setup_criteria.map((criteria, index) => (
                <li key={index} className="text-muted-foreground">{criteria}</li>
              ))}
            </ul>
          </div>
        )}

        {selectedPlaybook.entry_rules.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Entry Rules</h3>
            <ul className="list-disc pl-5 space-y-1">
              {selectedPlaybook.entry_rules.map((rule, index) => (
                <li key={index} className="text-muted-foreground">{rule}</li>
              ))}
            </ul>
          </div>
        )}

        {selectedPlaybook.exit_rules.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Exit Rules</h3>
            <ul className="list-disc pl-5 space-y-1">
              {selectedPlaybook.exit_rules.map((rule, index) => (
                <li key={index} className="text-muted-foreground">{rule}</li>
              ))}
            </ul>
          </div>
        )}

        {selectedPlaybook.risk_management.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Risk Management</h3>
            <ul className="list-disc pl-5 space-y-1">
              {selectedPlaybook.risk_management.map((rule, index) => (
                <li key={index} className="text-muted-foreground">{rule}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}