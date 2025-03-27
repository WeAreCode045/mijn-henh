
import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AgendaDialog } from "./AgendaDialog";
import { AgendaCalendarView } from "./AgendaCalendarView";
import { AgendaListView } from "./AgendaListView";
import { useAgenda, AgendaItem } from "@/hooks/useAgenda";

export function AgendaSection() {
  const [activeTab, setActiveTab] = useState<string>("list");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AgendaItem | null>(null);
  
  const { agendaItems, isLoading, addAgendaItem, updateAgendaItem, deleteAgendaItem } = useAgenda();
  
  const handleAddClick = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };
  
  const handleSave = async (data: Omit<AgendaItem, "id" | "created_at" | "updated_at">) => {
    if (selectedItem) {
      await updateAgendaItem(
        selectedItem.id,
        data.title,
        data.description || null,
        data.event_date,
        data.event_time,
        data.property_id
      );
    } else {
      await addAgendaItem(
        data.title,
        data.description || null,
        data.event_date,
        data.event_time,
        data.property_id
      );
    }
  };
  
  const handleEditItem = (item: AgendaItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };
  
  const handleDeleteItem = async (id: string) => {
    await deleteAgendaItem(id);
  };
  
  return (
    <CardContent className="p-4 pt-0">
      <div className="flex justify-between items-center mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleAddClick} size="sm" className="h-8">
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </div>
      
      <TabsContent value="list" className="mt-0">
        <AgendaListView 
          agendaItems={agendaItems} 
          isLoading={isLoading} 
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          showEditRemoveButtons={true}
        />
      </TabsContent>
      
      <TabsContent value="calendar" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <AgendaCalendarView 
              agendaItems={agendaItems} 
              isLoading={isLoading}
              onDayClick={(date) => console.log(date)}
              className="w-full"
              compactMode={true}
            />
          </div>
          <div className="md:col-span-3">
            <AgendaListView 
              agendaItems={agendaItems} 
              isLoading={isLoading} 
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              showEditRemoveButtons={true}
              showDate={true}
            />
          </div>
        </div>
      </TabsContent>
      
      <AgendaDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        item={selectedItem}
        mode={selectedItem ? "edit" : "add"}
      />
    </CardContent>
  );
}
