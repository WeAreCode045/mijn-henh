
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";

interface SubmissionsCardProps {
  propertyId: string;
}

export function SubmissionsCard({ propertyId }: SubmissionsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Recent Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <RecentSubmissions propertyId={propertyId} />
      </CardContent>
    </Card>
  );
}
