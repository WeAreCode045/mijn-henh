
import React from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnvelopeOpenIcon, MessageSquareText, PhoneCall } from "lucide-react";

interface CommunicationsTabContentProps {
  property: PropertyData;
}

export function CommunicationsTabContent({ property }: CommunicationsTabContentProps) {
  const [activeTab, setActiveTab] = React.useState("messages");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4" />
            <span>Messages</span>
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <EnvelopeOpenIcon className="h-4 w-4" />
            <span>Emails</span>
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4" />
            <span>Calls</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No messages found for this property. Messages from potential buyers or tenants will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="emails" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No email communications found for this property. Emails related to this property will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No call records found for this property. Phone calls related to this property will be logged here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
