
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, CalendarDays, ListFilter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgendaCalendarView } from "./AgendaCalendarView";
import { AgendaListView } from "./AgendaListView";
import { AgendaDialog } from "./AgendaDialog";
import { useAgenda, AgendaItem } from "@/hooks/useAgenda";

export function AgendaSection() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedAgendaItem, setSelectedAgendaItem] = useState<AgendaItem | undefined>(undefined);
  const { agendaItems, isLoading, addAgendaItem, deleteAgendaItem, updateAgendaItem } = useAgenda();

  const handleAddClick = () => {
    setDialogMode("add");
    setSelectedAgendaItem(undefined);
    setDialogOpen(true);
  };
  
  const handleEditItem = (item: AgendaItem) => {
    setDialogMode("edit");
    setSelectedAgendaItem(item);
    setDialogOpen(true);
  };
  
  const handleSaveAgendaItem = async (
    title: string,
    description: string | null,
    date: string,
    time: string,
    propertyId?: string | null
  ) => {
    if (dialogMode === "add") {
      await addAgendaItem(title, description, date, time, propertyId);
    } else {
      if (selectedAgendaItem) {
        await updateAgendaItem(
          selectedAgendaItem.id,
          title,
          description,
          date,
          time,
          propertyId
        );
      }
    }
  };

  return (
    <Card className="col-span-full h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Agenda</CardTitle>
        <div className="flex items-center gap-2">
          <Tabs defaultValue={view} onValueChange={(v) => setView(v as "calendar" | "list")}>
            <TabsList>
              <TabsTrigger value="calendar" className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <ListFilter className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleAddClick} size="sm" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add Item</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div>
            {view === "calendar" ? (
              <AgendaCalendarView agendaItems={agendaItems} />
            ) : (
              <AgendaListView 
                agendaItems={agendaItems} 
                onDelete={deleteAgendaItem}
                onEdit={handleEditItem}
              />
            )}
          </div>
        )}
      </CardContent>

      <AgendaDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveAgendaItem}
        item={selectedAgendaItem}
        mode={dialogMode}
      />
    </Card>
  );
}
