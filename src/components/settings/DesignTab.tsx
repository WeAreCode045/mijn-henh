
import { AgencySettings } from "@/types/agency";
import { ElementsSettings } from "./ElementsSettings";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DesignTabProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onPdfBackgroundUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onWebviewBackgroundUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DesignTab({ 
  settings, 
  onChange, 
  onSelectChange,
  onPdfBackgroundUpload,
  onWebviewBackgroundUpload
}: DesignTabProps) {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="global">Global Settings</TabsTrigger>
          <TabsTrigger value="pdf">PDF Brochure</TabsTrigger>
          <TabsTrigger value="webview">Webview</TabsTrigger>
        </TabsList>
        
        {/* Global Design Settings */}
        <TabsContent value="global" className="space-y-6 pt-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Global Design Elements</h3>
            <p className="text-sm text-gray-500 mb-4">These colors will be used throughout the application, PDF brochures, and webview.</p>
            <ElementsSettings
              settings={settings}
              onChange={onChange}
            />
          </div>
        </TabsContent>
        
        {/* PDF Brochure Design Settings */}
        <TabsContent value="pdf" className="space-y-6 pt-4">
          <div>
            <h3 className="text-lg font-medium mb-2">PDF Brochure Design</h3>
            <p className="text-sm text-gray-500 mb-4">These settings apply to the PDF brochures only.</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdfBackground">PDF Background Image</Label>
                <Input
                  id="pdfBackground"
                  name="pdfBackground"
                  type="file"
                  onChange={onPdfBackgroundUpload}
                  accept="image/*"
                />
                {settings.pdfBackgroundUrl && (
                  <div className="mt-2">
                    <img
                      src={settings.pdfBackgroundUrl}
                      alt="PDF Background"
                      className="h-32 w-full object-cover rounded-lg"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">This image will be used as a background for all PDF brochure pages</p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Property Details Icons</h4>
                  <p className="text-xs text-gray-500">These icons are used in the property details section of the PDF brochure.</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Build Year: Calendar icon</li>
                    <li>• Bedrooms: Bed icon</li>
                    <li>• Bathrooms: Bath icon</li>
                    <li>• Garages: Car icon</li>
                    <li>• Energy Class: Lightning bolt icon</li>
                    <li>• Plot Size: Ruler icon</li>
                    <li>• Living Space: Home icon</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Webview Design Settings */}
        <TabsContent value="webview" className="space-y-6 pt-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Webview Design</h3>
            <p className="text-sm text-gray-500 mb-4">These settings apply to the webview presentation only.</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webviewBackground">Webview Background Image</Label>
                <Input
                  id="webviewBackground"
                  name="webviewBackground"
                  type="file"
                  onChange={onWebviewBackgroundUpload}
                  accept="image/*"
                />
                {settings.webviewBackgroundUrl && (
                  <div className="mt-2">
                    <img
                      src={settings.webviewBackgroundUrl}
                      alt="Webview Background"
                      className="h-32 w-full object-cover rounded-lg"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">This image will be used as a background for all webview pages</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
