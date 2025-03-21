
import { PropertyData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { StatusSelector } from "./components/StatusSelector";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { PropertyImage } from "./components/PropertyImage";
import { PropertyTitleSection } from "./components/PropertyTitleSection";
import { PropertyDetailsSection } from "./components/PropertyDetailsSection";
import { AgentDisplay } from "./components/AgentDisplay";
import { AgentSelector } from "./components/AgentSelector";
import { SaveButton } from "./components/SaveButton";
import { usePropertyOverviewEdit } from "./hooks/usePropertyOverviewEdit";

interface PropertyOverviewCardProps {
  property: PropertyData;
  handleSaveAgent?: (agentId: string) => Promise<void>;
}

export function PropertyOverviewCard({ property, handleSaveAgent }: PropertyOverviewCardProps) {
  const { settings } = useAgencySettings();
  
  const {
    title,
    setTitle,
    address,
    setAddress,
    price,
    setPrice,
    objectId,
    setObjectId,
    isSaving,
    agentName,
    isEditing,
    addressInputRef,
    handleSaveAllFields,
    toggleEditMode
  } = usePropertyOverviewEdit({ property, settings });

  return (
    <Card className="md:col-span-2">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <PropertyTitleSection 
              title={title}
              address={address}
              isEditing={isEditing}
              setTitle={setTitle}
              setAddress={setAddress}
              toggleEditMode={toggleEditMode}
              addressInputRef={addressInputRef}
            />
            
            <PropertyDetailsSection 
              price={price}
              objectId={objectId}
              isEditing={isEditing}
              setPrice={setPrice}
              setObjectId={setObjectId}
            />
            
            {/* Display the agent when not in edit mode */}
            {!isEditing && (
              <AgentDisplay agentName={agentName} />
            )}
            
            {/* Agent Selector - Only visible in edit mode */}
            {isEditing && handleSaveAgent && (
              <div className="mb-6">
                <AgentSelector 
                  initialAgentId={property.agent_id} 
                  onAgentChange={handleSaveAgent}
                />
              </div>
            )}

            {/* Save button - Below agent selector when in edit mode */}
            {isEditing && (
              <SaveButton 
                handleSaveAllFields={handleSaveAllFields}
                isSaving={isSaving}
              />
            )}
          </div>
          <div className="w-full md:w-40 flex flex-col gap-4">
            <PropertyImage property={property} />
            
            {/* Status Selector below the thumbnail */}
            {property.id && (
              <StatusSelector 
                propertyId={property.id} 
                initialStatus={property.metadata?.status || property.status || "Draft"}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
