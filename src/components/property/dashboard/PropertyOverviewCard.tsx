
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface PropertyOverviewCardProps {
  property: PropertyData;
}

export function PropertyOverviewCard({ property }: PropertyOverviewCardProps) {
  const mainImage = property.featuredImage || (property.images && property.images.length > 0 ? property.images[0].url : null);

  return (
    <Card className="md:col-span-3">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Property Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="font-semibold text-xl mb-2">{property.title}</h3>
            <p className="text-muted-foreground mb-4">{property.address}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Price</p>
                <p>{property.price || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">ID</p>
                <p className="text-sm truncate">{property.id}</p>
              </div>
              <div>
                <p className="font-semibold">Object ID</p>
                <p>{property.object_id || "Not set"}</p>
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
