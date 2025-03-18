
import React from "react";
import { PropertyFormData } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContentTabContentProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (id: string) => void;
  onUpdateFeature: (id: string, description: string) => void;
  onAddArea: () => void;
  onRemoveArea: (id: string) => void;
  onUpdateArea: (id: string, field: any, value: any) => void;
  onAreaImageRemove: (areaId: string, imageId: string) => void;
  onAreaImagesSelect: (areaId: string, imageIds: string[]) => void;
  handleAreaImageUpload: (areaId: string, files: FileList) => Promise<void>;
  currentStep: number;
  handleStepClick: (step: number) => void;
  handleNext?: () => void;
  handlePrevious?: () => void;
  onFetchLocationData?: () => Promise<void>;
  onFetchCategoryPlaces?: (category: string) => Promise<any>;
  onFetchNearbyCities?: () => Promise<any>;
  onGenerateLocationDescription?: () => Promise<void>;
  onGenerateMap?: () => Promise<void>;
  onRemoveNearbyPlace?: (index: number) => void;
  isLoadingLocationData?: boolean;
  isGeneratingMap?: boolean;
  setPendingChanges?: (pending: boolean) => void;
  isUploading: boolean;
  onSubmit: () => void;
  isSaving?: boolean;
}

export function ContentTabContent({ 
  formData,
}: ContentTabContentProps) {
  const [activeTab, setActiveTab] = React.useState("general");

  // Check if we have formData, otherwise show a loading state
  if (!formData) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Loading property data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Property Content</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="areas">Areas</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Basic Details</h3>
                  <div className="space-y-1">
                    <p><span className="font-medium">Title:</span> {formData.title}</p>
                    <p><span className="font-medium">Price:</span> €{formData.price}</p>
                    <p><span className="font-medium">Address:</span> {formData.address}</p>
                    <p><span className="font-medium">Property Type:</span> {formData.propertyType || "Not specified"}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Property Specifications</h3>
                  <div className="space-y-1">
                    <p><span className="font-medium">Bedrooms:</span> {formData.bedrooms}</p>
                    <p><span className="font-medium">Bathrooms:</span> {formData.bathrooms}</p>
                    <p><span className="font-medium">Size:</span> {formData.sqft} m²</p>
                    <p><span className="font-medium">Living Area:</span> {formData.livingArea} m²</p>
                    <p><span className="font-medium">Build Year:</span> {formData.buildYear}</p>
                    <p><span className="font-medium">Energy Label:</span> {formData.energyLabel}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Description</h3>
                <div className="bg-muted p-4 rounded-md whitespace-pre-line">
                  {formData.description || "No description provided."}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button>Edit General Information</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.features && formData.features.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {formData.features.map((feature) => (
                    <li key={feature.id}>{feature.description}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No features added yet.</p>
              )}

              <div className="mt-6 flex justify-end">
                <Button>Edit Features</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Areas</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.areas && formData.areas.length > 0 ? (
                <div className="space-y-6">
                  {formData.areas.map((area) => (
                    <div key={area.id} className="border rounded-md p-4">
                      <h3 className="font-medium text-lg">{area.title}</h3>
                      <p className="mt-2 whitespace-pre-line">{area.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No areas defined yet.</p>
              )}

              <div className="mt-6 flex justify-end">
                <Button>Edit Areas</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Location Description</h3>
                  <div className="bg-muted p-4 rounded-md whitespace-pre-line">
                    {formData.location_description || "No location description provided."}
                  </div>
                </div>

                {formData.latitude && formData.longitude && (
                  <div>
                    <h3 className="font-medium mb-2">Map Location</h3>
                    <div className="aspect-video bg-muted rounded-md overflow-hidden">
                      {formData.map_image ? (
                        <img src={formData.map_image} alt="Property location" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">Map not available</p>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Coordinates: {formData.latitude}, {formData.longitude}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button>Edit Location</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
