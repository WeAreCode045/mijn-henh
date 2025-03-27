
import { TabsList as ShadcnTabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsListProps {
  activeTab: string;
  propertyId: string | null;
}

export function TabsList({ activeTab, propertyId }: TabsListProps) {
  return (
    <ShadcnTabsList className="w-full flex justify-start border-b px-4 pt-4">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="properties">Properties</TabsTrigger>
      <TabsTrigger value="agenda">Agenda</TabsTrigger>
      <TabsTrigger value="todos">Todos</TabsTrigger>
      <TabsTrigger value="comms">Communications</TabsTrigger>
      <TabsTrigger value="analytics">Analytics</TabsTrigger>
      <TabsTrigger value="notifications">Notifications</TabsTrigger>
      {propertyId && <TabsTrigger value="property">Property Details</TabsTrigger>}
    </ShadcnTabsList>
  );
}
