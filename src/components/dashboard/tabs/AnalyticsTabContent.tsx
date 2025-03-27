
import { CardContent } from "@/components/ui/card";
import { AnalyticsOverview } from "../AnalyticsOverview";

export function AnalyticsTabContent() {
  return (
    <CardContent className="p-6">
      <AnalyticsOverview />
    </CardContent>
  );
}
