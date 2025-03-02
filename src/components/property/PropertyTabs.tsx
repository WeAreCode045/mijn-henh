
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, FileTextIcon, MessageSquareIcon, GaugeIcon } from "lucide-react";

interface PropertyTabsProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
  handleTabChange?: (tab: string) => void;
  children: React.ReactNode;
}

export function PropertyTabs({ activeTab, handleTabChange, onTabChange, children }: PropertyTabsProps) {
  // Use onTabChange for backward compatibility
  const handleChange = handleTabChange || onTabChange;
  
  return (
    <Tabs
      value={activeTab}
      onValueChange={handleChange}
      className="w-full"
    >
      <TabsList className="mb-8">
        <TabsTrigger value="dashboard" className="flex gap-2">
          <GaugeIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </TabsTrigger>
        
        <TabsTrigger value="content" className="flex gap-2">
          <FileTextIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Content</span>
        </TabsTrigger>
        
        <TabsTrigger value="media" className="flex gap-2">
          <ImageIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Media</span>
        </TabsTrigger>
        
        <TabsTrigger value="communications" className="flex gap-2">
          <MessageSquareIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Communications</span>
        </TabsTrigger>
      </TabsList>
      
      {/* Render all tab content at once but only display the active one */}
      <TabsContent value={activeTab} forceMount>
        {children}
      </TabsContent>
    </Tabs>
  );
}
