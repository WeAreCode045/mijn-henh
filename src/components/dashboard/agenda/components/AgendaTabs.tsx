
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgendaTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function AgendaTabs({ activeTab, onTabChange }: AgendaTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-[400px]">
      <TabsList>
        <TabsTrigger value="weekly">Weekly View</TabsTrigger>
        <TabsTrigger value="month">Monthly View</TabsTrigger>
        <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        <TabsTrigger value="list">List View</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
