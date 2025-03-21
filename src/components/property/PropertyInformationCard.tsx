
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code } from "@/components/ui/code";

interface PropertyInformationCardProps {
  id: string;
  objectId?: string;
}

export function PropertyInformationCard({ id, objectId }: PropertyInformationCardProps) {
  const apiEndpoint = `${window.location.origin}/api/properties/${id}`;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Property Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription className="font-mono">
            <div className="space-y-2">
              <div>
                <span className="font-semibold">ID:</span> {id}
              </div>
              <div>
                <span className="font-semibold">Object ID:</span> {objectId || ''}
              </div>
              <div>
                <span className="font-semibold">API Endpoint:</span>
                <Code className="ml-2">{apiEndpoint}</Code>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
