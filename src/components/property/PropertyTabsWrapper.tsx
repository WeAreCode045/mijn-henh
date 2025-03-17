
import { PropertyTabs } from "./PropertyTabs";
import { PropertyTabContents } from "./tabs/wrapper/PropertyTabContents";
import { PropertyData, PropertyFormData } from "@/types/property";
import { usePropertyTabs } from "@/hooks/usePropertyTabs";
import { PropertyFormManager } from "./tabs/wrapper/PropertyFormManager";
import { PropertyTabActionsHandler } from "./tabs/wrapper/PropertyTabActionsHandler";
import { adaptPropertyDataToFormData } from "./tabs/wrapper/PropertyFormDataAdapter";
import { PropertyTabContentSetup } from "./tabs/wrapper/PropertyTabContentSetup";

interface PropertyTabsWrapperProps {
  property: PropertyData;
  settings: any;
  onDelete?: () => Promise<void>;
  agentInfo?: { id: string; name: string } | null;
  templateInfo?: { id: string; name: string } | null;
}

export function PropertyTabsWrapper({
  property,
  settings,
  onDelete,
  agentInfo,
  templateInfo
}: PropertyTabsWrapperProps) {
  const { activeTab, setActiveTab } = usePropertyTabs();
  console.log("PropertyTabsWrapper - Active tab:", activeTab);
  
  // Adapt the property data to ensure all required fields are present
  const propertyFormData = adaptPropertyDataToFormData(property);
  
  return (
    <div className="space-y-6">
      <PropertyTabActionsHandler propertyId={property.id}>
        {(webViewProps) => (
          <PropertyFormManager property={propertyFormData as PropertyData}>
            {(formHandlers) => (
              <PropertyTabContentSetup
                property={property}
                formState={formHandlers.formState}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                agentInfo={agentInfo}
                templateInfo={templateInfo}
                handleWebViewProps={webViewProps}
                formHandlers={formHandlers}
                onDelete={onDelete}
              />
            )}
          </PropertyFormManager>
        )}
      </PropertyTabActionsHandler>
    </div>
  );
}
