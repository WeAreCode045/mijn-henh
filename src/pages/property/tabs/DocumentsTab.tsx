
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentList } from "@/components/property/documents/DocumentList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";

interface DocumentsTabProps {
  propertyId: string;
  propertyTitle: string;
}

export function DocumentsTab({ propertyId, propertyTitle }: DocumentsTabProps) {
  const { isAdmin } = useAuth();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Property Documents</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Documents for {propertyTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="property" className="w-full">
            <TabsList className="grid w-[400px] grid-cols-2 mb-8">
              <TabsTrigger value="property">Property Documents</TabsTrigger>
              <TabsTrigger value="global">Global Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="property">
              <DocumentList
                propertyId={propertyId}
                canManage={true}
                showSignatureStatus={true}
              />
            </TabsContent>
            <TabsContent value="global">
              <DocumentList
                isGlobal={true}
                canManage={isAdmin}
                showSignatureStatus={false}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
