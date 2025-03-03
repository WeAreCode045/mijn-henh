
import { AgencySettings } from "@/types/agency";
import { SmtpSettings } from "./SmtpSettings";
import { XmlImportSettings } from "./XmlImportSettings";
import { AppwriteSettings } from "./AppwriteSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdvancedTabProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}

export function AdvancedTab({ 
  settings, 
  onChange, 
  onSwitchChange 
}: AdvancedTabProps) {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="smtp" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="smtp">Email Settings</TabsTrigger>
          <TabsTrigger value="xml">XML Import</TabsTrigger>
          <TabsTrigger value="appwrite">Appwrite</TabsTrigger>
        </TabsList>
        
        <TabsContent value="smtp" className="space-y-6 pt-4">
          <SmtpSettings 
            settings={settings} 
            onChange={onChange} 
            onSwitchChange={onSwitchChange} 
          />
        </TabsContent>
        
        <TabsContent value="xml" className="space-y-6 pt-4">
          <XmlImportSettings 
            settings={settings} 
            onChange={onChange} 
          />
        </TabsContent>
        
        <TabsContent value="appwrite" className="space-y-6 pt-4">
          <AppwriteSettings 
            settings={settings} 
            onChange={onChange} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
