
import { useState } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StatusSelector } from "./components/StatusSelector";
import { AgentSelector } from "./components/AgentSelector";

interface PropertyOverviewCardProps {
  property: PropertyData;
  handleSaveAgent?: (agentId: string) => Promise<void>;
}

export function PropertyOverviewCard({ property, handleSaveAgent }: PropertyOverviewCardProps) {
  const mainImage = property.featuredImage || (property.images && property.images.length > 0 ? property.images[0].url : null);
  const { toast } = useToast();
  
  const [title, setTitle] = useState(property.title || '');
  const [address, setAddress] = useState(property.address || '');
  const [price, setPrice] = useState(property.price || '');
  const [objectId, setObjectId] = useState(property.object_id || '');
  const [isSaving, setIsSaving] = useState(false);
  
  // Single editing state for all fields
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSaveAllFields = async () => {
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          title: title,
          address: address,
          price: price,
          object_id: objectId
        })
        .eq('id', property.id);
        
      if (error) throw error;
      
      toast({
        title: "Updated",
        description: "Property information updated successfully",
      });
      
      // Exit edit mode after saving
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating fields:", error);
      toast({
        title: "Error",
        description: "Could not update property information",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle edit mode for all fields
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Card className="md:col-span-2">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                {isEditing ? (
                  <div className="w-full">
                    <label className="text-sm font-medium mb-1 block">Title</label>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Property Title"
                        className="text-xl font-semibold"
                      />
                    </div>
                  </div>
                ) : (
                  <h3 className="text-xl font-semibold">{title || "Untitled Property"}</h3>
                )}
                
                {!isEditing && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={toggleEditMode}
                    title="Edit Property Information"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Address</label>
                    <Input 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Property Address"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground mb-4">{address || "No address specified"}</p>
              )}
            </div>
            
            {isEditing ? (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Price</label>
                  <Input 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Set price"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Object ID</label>
                  <Input 
                    value={objectId}
                    onChange={(e) => setObjectId(e.target.value)}
                    placeholder="Set object ID"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-semibold mb-1">Price</p>
                  <p>{price || "Not specified"}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Object ID</p>
                  <p className="truncate">{objectId || "Not specified"}</p>
                </div>
              </div>
            )}
            
            {isEditing && (
              <div className="flex justify-end mb-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleSaveAllFields}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {property.id && (
                <StatusSelector 
                  propertyId={property.id} 
                  initialStatus={property.metadata?.status || property.status || "Draft"}
                />
              )}
              
              {handleSaveAgent && (
                <AgentSelector 
                  initialAgentId={property.agent_id} 
                  onAgentChange={handleSaveAgent}
                />
              )}
            </div>
          </div>
          <div className="w-full md:w-40 h-40 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
            {mainImage ? (
              <img 
                src={mainImage} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
