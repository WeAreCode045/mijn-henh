
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";

interface SubmissionsCardProps {
  propertyId: string;
}

export function SubmissionsCard({ propertyId }: SubmissionsCardProps) {
  // Only render if propertyId is a valid UUID string
  if (!propertyId || propertyId.trim() === '' || propertyId === '1') {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Valid property ID is required to display submissions.
          </div>
        </CardContent>
      </Card>
    );
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
