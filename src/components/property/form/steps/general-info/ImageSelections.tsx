
import { PropertyImage } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";

interface ImageSelectionsProps {
  images: PropertyImage[];
  featuredImage: string | null;
  featuredImages: string[];
  onFeaturedImageSelect: (url: string | null) => void;
  onFeaturedImageToggle: (url: string) => void;
  maxFeaturedImages?: number;
  isReadOnly?: boolean;
}

export function ImageSelections({ 
  images, 
  featuredImage,
  featuredImages,
  onFeaturedImageSelect,
  onFeaturedImageToggle,
  maxFeaturedImages = 4,
  isReadOnly = false
}: ImageSelectionsProps) {
  const handleSetMainImage = (url: string) => {
    if (isReadOnly) return;
    onFeaturedImageSelect(url);
  };
  
  const handleToggleFeaturedImage = (url: string) => {
    if (isReadOnly) return;
    onFeaturedImageToggle(url);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Image Selections</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-base font-medium mb-2">Featured Image</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {featuredImage ? (
              <div className="relative aspect-video w-full max-w-lg mx-auto border rounded-md overflow-hidden">
                <img 
                  src={featuredImage} 
                  alt="Main Property" 
                  className="object-cover w-full h-full"
                />
                {!isReadOnly && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => onFeaturedImageSelect(null)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ) : (
              <div className="aspect-video w-full max-w-lg mx-auto border rounded-md overflow-hidden bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No featured image selected</p>
              </div>
            )}
          </div>
          
          <h3 className="text-base font-medium mb-2">Grid Images</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select up to {maxFeaturedImages} images for the property grid.
          </p>
          
          <ScrollArea className="h-[300px] w-full rounded-md border">
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div 
                    key={image.id} 
                    className="relative overflow-hidden rounded-md border"
                    style={{ aspectRatio: '1 / 1' }}
                  >
                    <img 
                      src={image.url} 
                      alt={image.alt || 'Property'} 
                      className="object-cover w-full h-full"
                    />
                    {!isReadOnly && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col gap-2 items-center justify-center">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleSetMainImage(image.url)}
                        >
                          Set as Featured
                        </Button>
                        <Button 
                          variant={featuredImages.includes(image.url) ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => handleToggleFeaturedImage(image.url)}
                          className="flex items-center gap-1"
                        >
                          {featuredImages.includes(image.url) ? (
                            <>
                              <Check className="h-4 w-4" /> 
                              Selected for Grid
                            </>
                          ) : (
                            'Add to Grid'
                          )}
                        </Button>
                      </div>
                    )}
                    {featuredImages.includes(image.url) && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
