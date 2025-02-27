
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/types/property";
import { Trash, Star, Grid } from "lucide-react";

interface ImagesStepProps {
  images: PropertyImage[];
  featuredImage: string | null;
  gridImages: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSetFeaturedImage: (url: string) => void;
  onToggleGridImage: (url: string) => void;
}

export function ImagesStep({
  images,
  featuredImage,
  gridImages,
  onImageUpload,
  onRemoveImage,
  onSetFeaturedImage,
  onToggleGridImage,
}: ImagesStepProps) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImageUpload(e);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-estate-800">Property Images</h2>
        <p className="text-sm text-estate-600">
          Upload images of your property. These will be used on the listing and in the web view.
        </p>
      </div>

      <div className="border p-4 rounded-md bg-slate-50">
        <Label htmlFor="property-images" className="block mb-2">
          Upload Images
        </Label>
        <Input
          type="file"
          id="property-images"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="mb-4"
        />
        <p className="text-xs text-muted-foreground">
          Supported formats: JPG, PNG, WebP. Maximum size: 10MB per file.
        </p>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Uploaded Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative group border rounded-md overflow-hidden">
                <img
                  src={image.url}
                  alt={`Property ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200"></div>
                <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onRemoveImage(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={featuredImage === image.url ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => onSetFeaturedImage(image.url)}
                  >
                    <Star className="h-4 w-4" fill={featuredImage === image.url ? "white" : "none"} />
                  </Button>
                  <Button
                    variant={gridImages.includes(image.url) ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onToggleGridImage(image.url)}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
                {featuredImage === image.url && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    Featured
                  </div>
                )}
                {gridImages.includes(image.url) && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Grid
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
