
import { TabsList as TabsListUI, TabsTrigger } from "@/components/ui/tabs";

interface TabsListProps {
  activeTab: string;
  propertyId?: string | null;
}

export function TabsList({ activeTab, propertyId }: TabsListProps) {
  return (
    <TabsListUI className="grid w-full grid-cols-8">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="properties">Properties</TabsTrigger>
      <TabsTrigger value="agenda">Agenda</TabsTrigger>
      <TabsTrigger value="todos">Todos</TabsTrigger>
      <TabsTrigger value="comms">Communications</TabsTrigger>
      <TabsTrigger value="analytics">Analytics</TabsTrigger>
      <TabsTrigger value="notifications">Notifications</TabsTrigger>
      {propertyId && (
        <TabsTrigger value="property">Property</TabsTrigger>
      )}
    </TabsListUI>
  );
}
