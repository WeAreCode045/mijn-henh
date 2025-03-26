import { StatusSelector } from "./components/StatusSelector";
import { supabase } from "@/integrations/supabase/client";

const handleStatusChange = async (status: string): Promise<void> => {
  if (!propertyId) return;
  
  const { error } = await supabase
    .from('properties')
    .update({ status })
    .eq('id', propertyId);
    
  if (error) {
    throw error;
  }
};

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
            
            {!isEditing && (
              <AgentDisplay agentName={agentName} />
            )}
            
            {isEditing && handleSaveAgent && (
              <div className="mb-6">
                <AgentSelector 
                  initialAgentId={property.agent_id} 
                  onAgentChange={handleSaveAgent}
                />
              </div>
            )}

            {isEditing && (
              <SaveButton 
                handleSaveAllFields={handleSaveAllFields}
                isSaving={isSaving}
              />
            )}
          </div>
          <div className="w-full md:w-40 flex flex-col gap-4">
            <PropertyImage property={property} />
            
            {property.id && (
              <StatusSelector 
                propertyId={property.id} 
                initialStatus={property.metadata?.status || property.status || "Draft"}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
