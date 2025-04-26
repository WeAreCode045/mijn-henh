
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageList } from "@/components/property/messages/MessageList";

interface CommunicationsTabProps {
  propertyId: string;
  propertyTitle: string;
}

export function CommunicationsTab({ propertyId, propertyTitle }: CommunicationsTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Communications</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Messages for {propertyTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <MessageList propertyId={propertyId} />
        </CardContent>
      </Card>
    </div>
  );
}
