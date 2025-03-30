
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgendaTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function AgendaTabs({ activeTab, onTabChange }: AgendaTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-[400px]">
      <TabsList>
        <TabsTrigger value="day">Day View</TabsTrigger>
        <TabsTrigger value="weekly">Week View</TabsTrigger>
        <TabsTrigger value="monthly">Month View</TabsTrigger>
        <TabsTrigger value="list">List View</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
