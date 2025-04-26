
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParticipantList } from "@/components/property/participants/ParticipantList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ParticipantsTabProps {
  propertyId: string;
  propertyTitle: string;
}

export function ParticipantsTab({ propertyId, propertyTitle }: ParticipantsTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Property Participants</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Participants for {propertyTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sellers" className="w-full">
            <TabsList className="grid w-[400px] grid-cols-2 mb-8">
              <TabsTrigger value="sellers">Sellers</TabsTrigger>
              <TabsTrigger value="buyers">Buyers</TabsTrigger>
            </TabsList>
            <TabsContent value="sellers">
              <ParticipantList
                propertyId={propertyId}
                title="Sellers"
                role="seller"
              />
            </TabsContent>
            <TabsContent value="buyers">
              <ParticipantList
                propertyId={propertyId}
                title="Buyers"
                role="buyer"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
