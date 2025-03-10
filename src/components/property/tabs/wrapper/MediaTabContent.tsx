import React from "react";
import { PropertyData, PropertyImage } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon, StarIcon, UploadIcon } from "lucide-react";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { usePropertyMainImages } from "@/hooks/images/usePropertyMainImages";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FloorplansTab } from "./tabs/FloorplansTab";
import { VirtualToursTab } from "./tabs/VirtualToursTab";
import { useState } from "react";

interface MediaTabContentProps {
  property: PropertyData;
}

export function MediaTabContent({ property }: MediaTabContentProps) {
  const [activeTab, setActiveTab] = useState("images");
  const [formData, setFormData] = useState<PropertyData>(property);
  
  const { 
    handleImageUpload, 
    handleRemoveImage, 
    images,
    isUploading 
  } = usePropertyImages(formData, setFormData);
  
  const {
    handleSetFeaturedImage,
    handleToggleFeaturedImage,
    isUpdating
  } = usePropertyMainImages(formData, setFormData);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Media</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="floorplans">Floorplans</TabsTrigger>
          <TabsTrigger value="virtual-tours">Virtual Tours</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Property Images</span>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  <Button variant="outline" size="sm" disabled={isUploading}>
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload Images
                  </Button>
                </label>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(!images || images.length === 0) ? (
                <div className="text-center py-12 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground mb-4">No images uploaded yet</p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                    <Button variant="secondary" disabled={isUploading}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Upload Images
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => {
                    const imageUrl = typeof image === 'string' ? image : image.url;
                    const isMain = formData.featuredImage === imageUrl;
                    const isFeatured = formData.featuredImages?.includes(imageUrl) || false;
                    
                    return (
                      <div 
                        key={index} 
                        className={`relative group border rounded-md overflow-hidden ${
                          isMain ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <img 
                          src={imageUrl} 
                          alt={`Property ${index + 1}`} 
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex flex-col space-y-2">
                            <Button
                              variant={isMain ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleSetFeaturedImage(isMain ? null : imageUrl)}
                              className="bg-white text-black hover:bg-gray-100"
                              disabled={isUpdating}
                            >
                              <StarIcon className={`h-4 w-4 mr-1 ${isMain ? 'text-yellow-500' : ''}`} />
                              {isMain ? 'Main' : 'Set Main'}
                            </Button>
                            <Button
                              variant={isFeatured ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleToggleFeaturedImage(imageUrl)}
                              className="bg-white text-black hover:bg-gray-100"
                              disabled={isUpdating}
                            >
                              {isFeatured ? 'Featured' : 'Set Featured'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveImage(index)}
                              disabled={isUpdating}
                            >
                              <Trash2Icon className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        {isMain && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            Main
                          </div>
                        )}
                        {isFeatured && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Featured
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="floorplans" className="mt-6">
          <FloorplansTab property={formData} setProperty={setFormData} />
        </TabsContent>
        
        <TabsContent value="virtual-tours" className="mt-6">
          <VirtualToursTab property={formData} setProperty={setFormData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
