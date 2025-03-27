
import { CardContent } from "@/components/ui/card";
import { RecentProperties } from "../RecentProperties";
import { TodoSection } from "../TodoSection";
import { RecentSubmissions } from "../RecentSubmissions";

export function OverviewTabContent() {
  return (
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <RecentProperties />
      <div className="space-y-6">
        <TodoSection />
        <RecentSubmissions />
      </div>
    </CardContent>
  );
}
