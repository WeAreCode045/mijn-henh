
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500 italic">
          No recent activity to display.
        </div>
      </CardContent>
    </Card>
  );
}
