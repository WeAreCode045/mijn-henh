
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Info, 
  FileText, 
  ImageIcon,
  MessageSquare
} from "lucide-react";
import { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface PropertyTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: ReactNode;
}

export function PropertyTabs({ activeTab, onTabChange, children }: PropertyTabsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Handle tab change by navigating to the new route
  const handleTabChange = (value: string) => {
    console.log("PropertyTabs - Tab changing to:", value);
    if (id) {
      navigate(`/property/${id}/${value}`, { replace: true });
    }
    onTabChange(value);
  };

  return (
    <TabsList className="grid grid-cols-4 mb-6">
      <TabsTrigger 
        value="dashboard" 
        className="flex items-center gap-2"
        data-active={activeTab === 'dashboard'}
        onClick={() => handleTabChange('dashboard')}
      >
        <Info className="h-4 w-4" />
        <span className="hidden sm:inline">Property Info</span>
      </TabsTrigger>
      <TabsTrigger 
        value="content" 
        className="flex items-center gap-2"
        data-active={activeTab === 'content'}
        onClick={() => handleTabChange('content')}
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Property Data</span>
      </TabsTrigger>
      <TabsTrigger 
        value="media" 
        className="flex items-center gap-2"
        data-active={activeTab === 'media'}
        onClick={() => handleTabChange('media')}
      >
        <ImageIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Media</span>
      </TabsTrigger>
      <TabsTrigger 
        value="communications" 
        className="flex items-center gap-2"
        data-active={activeTab === 'communications'}
        onClick={() => handleTabChange('communications')}
      >
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Communications</span>
      </TabsTrigger>
      
      {/* Render any children passed to this component */}
      {children}
    </TabsList>
  );
}
