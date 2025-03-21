
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImportFieldMapping } from "@/components/import/ImportFieldMapping";
import { UploadTabContent } from "@/components/import/tabs/UploadTabContent";
import { useXmlFileUpload } from "@/hooks/import/useXmlFileUpload";

export default function Import() {
  const {
    xmlData,
    isUploading,
    handleFileUpload
  } = useXmlFileUpload();

  const handleContinueToMapping = () => {
    // Find the tab trigger for mapping and click it
    const mapTabTrigger = document.querySelector('[data-value="map"]') as HTMLElement;
    if (mapTabTrigger) {
      mapTabTrigger.click();
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Import Properties</h1>
      </div>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upload">Upload XML</TabsTrigger>
          <TabsTrigger value="map" disabled={!xmlData}>Map Fields</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <UploadTabContent 
            xmlData={xmlData}
            isUploading={isUploading}
            onFileUpload={handleFileUpload}
            onContinueToMapping={handleContinueToMapping}
          />
        </TabsContent>
        
        <TabsContent value="map" className="mt-6">
          {xmlData && <ImportFieldMapping xmlData={xmlData} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
