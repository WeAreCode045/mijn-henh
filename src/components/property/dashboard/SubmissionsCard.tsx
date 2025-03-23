
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";

interface SubmissionsCardProps {
  propertyId: string;
}

export function SubmissionsCard({ propertyId }: SubmissionsCardProps) {
  // Only render the component if we have a valid propertyId
  if (!propertyId || propertyId.trim() === '') {
    return null;
  }
  
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
