
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface ExternalLinksCardProps {
  property: PropertyData;
}

export function ExternalLinksCard({ property }: ExternalLinksCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">External Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="font-medium">Virtual Tour</p>
            {property.virtualTourUrl ? (
              <a 
                href={property.virtualTourUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                Open Tour <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <span className="text-muted-foreground">Not available</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <p className="font-medium">YouTube Video</p>
            {property.youtubeUrl ? (
              <a 
                href={property.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                Watch Video <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <span className="text-muted-foreground">Not available</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
