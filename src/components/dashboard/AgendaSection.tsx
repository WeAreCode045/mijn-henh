
import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarX, PlusCircle } from "lucide-react";
import { AgendaDialog } from "./AgendaDialog";
import { AgendaCalendarView } from "./AgendaCalendarView";
import { AgendaListView } from "./AgendaListView";
import { useAgenda, AgendaItem } from "@/hooks/useAgenda";

export function AgendaSection() {
  const [activeTab, setActiveTab] = useState<string>("calendar");
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
  
  const EmptyAgendaNotification = () => (
    <div className="flex flex-col items-center justify-center py-6 px-4 bg-muted/20 rounded-lg border border-muted mt-4">
      <CalendarX className="h-12 w-12 text-muted-foreground mb-2" />
      <h3 className="text-lg font-medium">No Events Scheduled</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mt-1">
        Your agenda is currently empty. Click the "Add Event" button above to schedule your first event.
      </p>
      <Button onClick={handleAddClick} variant="outline" className="mt-4">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Your First Event
      </Button>
    </div>
  );
  
  return (
    <CardContent className="p-4 pt-0">
      <div className="flex justify-between items-center mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleAddClick} size="sm" className="h-8">
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </div>
      
      <TabsContent value="list" className="mt-0">
        {!isLoading && agendaItems.length === 0 ? (
          <EmptyAgendaNotification />
        ) : (
          <AgendaListView 
            agendaItems={agendaItems} 
            isLoading={isLoading} 
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            showEditRemoveButtons={true}
          />
        )}
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
            {!isLoading && agendaItems.length === 0 ? (
              <EmptyAgendaNotification />
            ) : (
              <AgendaListView 
                agendaItems={agendaItems} 
                isLoading={isLoading} 
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                showEditRemoveButtons={true}
                showDate={true}
              />
            )}
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
