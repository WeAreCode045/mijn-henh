
import { useState } from "react";
import { PropertyData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Save, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PropertyOverviewCardProps {
  property: PropertyData;
}

export function PropertyOverviewCard({ property }: PropertyOverviewCardProps) {
  const mainImage = property.featuredImage || (property.images && property.images.length > 0 ? property.images[0].url : null);
  const { toast } = useToast();
  
  const [title, setTitle] = useState(property.title || '');
  const [address, setAddress] = useState(property.address || '');
  const [price, setPrice] = useState(property.price || '');
  const [objectId, setObjectId] = useState(property.object_id || '');
  const [isSaving, setIsSaving] = useState(false);
  
  // Track edit states
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [editingObjectId, setEditingObjectId] = useState(false);
  
  const handleSaveField = async (field: string, value: string) => {
    if (!property.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .update({ [field]: value })
        .eq('id', property.id);
        
      if (error) throw error;
      
      toast({
        title: "Updated",
        description: `${field} updated successfully`,
      });
      
      // Close edit mode after saving
      switch (field) {
        case 'title': setEditingTitle(false); break;
        case 'address': setEditingAddress(false); break;
        case 'price': setEditingPrice(false); break;
        case 'object_id': setEditingObjectId(false); break;
      }
    } catch (error) {
      console.error("Error updating field:", error);
      toast({
        title: "Error",
        description: "Could not update the field",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="md:col-span-2">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                {editingTitle ? (
                  <>
                    <Input 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Property Title"
                      className="text-xl font-semibold"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleSaveField('title', title)}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="w-full flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{title || "Untitled Property"}</h3>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setEditingTitle(true)}
                      title="Edit Title"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                {editingAddress ? (
                  <>
                    <Input 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Property Address"
                      className="text-muted-foreground"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleSaveField('address', address)}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="w-full flex justify-between items-center">
                    <p className="text-muted-foreground">{address || "No address specified"}</p>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setEditingAddress(true)}
                      title="Edit Address"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-1">Price</p>
                {editingPrice ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Set price"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleSaveField('price', price)}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p>{price || "Not specified"}</p>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setEditingPrice(true)}
                      title="Edit Price"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold mb-1">Object ID</p>
                {editingObjectId ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={objectId}
                      onChange={(e) => setObjectId(e.target.value)}
                      placeholder="Set object ID"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleSaveField('object_id', objectId)}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="truncate">{objectId || "Not specified"}</p>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setEditingObjectId(true)}
                      title="Edit Object ID"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <p className="font-semibold">External Links</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Virtual Tour</p>
                  {property.virtualTourUrl ? (
                    <a 
                      href={property.virtualTourUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      Open Tour <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">Not available</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">YouTube Video</p>
                  {property.youtubeUrl ? (
                    <a 
                      href={property.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      Watch Video <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">Not available</span>
                  )}
                </div>
              </div>
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
