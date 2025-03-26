
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckSquare, MessageSquare, Users, FileText } from "lucide-react";
import { AgendaSection } from "@/components/dashboard/AgendaSection";
import { TodoSection } from "@/components/dashboard/TodoSection";
import { CommunicationsSection } from "@/components/dashboard/CommunicationsSection";
import { UnderConstructionView } from "@/components/dashboard/UnderConstructionView";

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("agenda");
  
  return (
    <Card className="h-full">
      <Tabs defaultValue="agenda" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-6">
          <TabsList className="grid grid-cols-5 h-12">
            <TabsTrigger value="agenda" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Agenda</span>
            </TabsTrigger>
            <TabsTrigger value="todo" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span>Todo</span>
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Communications</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="agenda" className="m-0">
          <AgendaSection />
        </TabsContent>
        
        <TabsContent value="todo" className="m-0">
          <TodoSection />
        </TabsContent>
        
        <TabsContent value="communications" className="m-0">
          <CommunicationsSection />
        </TabsContent>
        
        <TabsContent value="contacts" className="m-0">
          <UnderConstructionView title="Contacts" />
        </TabsContent>
        
        <TabsContent value="documents" className="m-0">
          <UnderConstructionView title="Documents" />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
