import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PreTradingActivitiesProps {
  activities: string[];
  selectedActivities: string[];
  onActivityChange: (activities: string[]) => void;
}

export const PreTradingActivities = ({
  activities,
  selectedActivities,
  onActivityChange,
}: PreTradingActivitiesProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium">Pre-Trading Activities</Label>
      <div className="grid grid-cols-2 gap-4">
        {activities.map((activity) => (
          <div key={activity} className="flex items-center space-x-2">
            <Checkbox
              id={activity}
              checked={selectedActivities.includes(activity)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onActivityChange([...selectedActivities, activity]);
                } else {
                  onActivityChange(selectedActivities.filter(a => a !== activity));
                }
              }}
            />
            <Label htmlFor={activity}>{activity}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};