
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Info, 
  FileText, 
  ImageIcon
} from "lucide-react";
import { ReactNode } from "react";

interface PropertyTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: ReactNode;
}

export function PropertyTabs({ activeTab, onTabChange, children }: PropertyTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">Property Info</span>
        </TabsTrigger>
        <TabsTrigger value="content" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Property Data</span>
        </TabsTrigger>
        <TabsTrigger value="media" className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Media</span>
        </TabsTrigger>
      </TabsList>
      
      {/* Pass the children directly to make sure TabsContent components render properly */}
      {children}
    </Tabs>
  );
}
