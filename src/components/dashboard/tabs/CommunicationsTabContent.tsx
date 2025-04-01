
import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CommunicationsSection } from "../CommunicationsSection";
import { EmailsSection } from "../EmailsSection";
import { MessageCircle, Mail } from "lucide-react";

export function CommunicationsTabContent() {
  const [activeTab, setActiveTab] = useState<string>("inquiries");
  
  return (
    <CardContent className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full flex justify-start border-b px-4 pt-4">
          <TabsTrigger value="inquiries" className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            Property Inquiries
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            IMAP Emails
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inquiries">
          <CommunicationsSection />
        </TabsContent>
        
        <TabsContent value="emails">
          <EmailsSection />
        </TabsContent>
      </Tabs>
    </CardContent>
  );
}
