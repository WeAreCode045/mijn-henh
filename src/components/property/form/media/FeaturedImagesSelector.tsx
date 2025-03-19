
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/types/property";
import { ImagePreview } from "@/components/ImagePreview";
import { CheckCircle2, Star } from "lucide-react";

interface FeaturedImagesSelectorProps {
  images: PropertyImage[];
  featuredImage: string | null;
  featuredImages: string[];
  onFeatureImage: (url: string | null) => void;
  onToggleFeature: (url: string) => void;
}

export function FeaturedImagesSelector({
  images,
  featuredImage,
  featuredImages,
  onFeatureImage,
  onToggleFeature
}: FeaturedImagesSelectorProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Main Image</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select the main image that will be displayed as the property thumbnail
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((image, index) => (
              <Button
                key={image.id || `main-${index}`}
                variant="outline"
                className={`relative p-0 h-32 overflow-hidden border-2 ${
                  featuredImage === image.url ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => onFeatureImage(image.url)}
              >
                <ImagePreview
                  src={image.url}
                  alt={image.alt || `Property image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {featuredImage === image.url && (
                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Featured Images</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select up to 4 images to be highlighted on the property page
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((image, index) => (
              <Button
                key={image.id || `featured-${index}`}
                variant="outline"
                className={`relative p-0 h-32 overflow-hidden border-2 ${
                  featuredImages.includes(image.url) ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => onToggleFeature(image.url)}
              >
                <ImagePreview
                  src={image.url}
                  alt={image.alt || `Property image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {featuredImages.includes(image.url) && (
                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full">
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
