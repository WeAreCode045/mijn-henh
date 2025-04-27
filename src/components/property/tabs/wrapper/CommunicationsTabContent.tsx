
import React, { useState } from "react";
import { PropertyData } from "@/types/property";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageList } from "../../messages/MessageList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyContactSubmissions } from "../../submissions/PropertyContactSubmissions";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const [activeTab, setActiveTab] = useState<string>("messages");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Property Communications</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="submissions">Webview Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Property Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <MessageList propertyId={property.id} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Webview Contact Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyContactSubmissions propertyId={property.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
