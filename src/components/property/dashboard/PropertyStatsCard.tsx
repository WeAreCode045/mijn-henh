
import { PropertyData } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyStatsCardProps {
  property: PropertyData;
}

export function PropertyStatsCard({ property }: PropertyStatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Property Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Images</p>
            <p>{property.images ? property.images.length : 0}</p>
          </div>
          <div>
            <p className="font-medium">Floorplans</p>
            <p>{property.floorplans ? property.floorplans.length : 0}</p>
          </div>
          <div>
            <p className="font-medium">Areas</p>
            <p>{property.areas ? property.areas.length : 0}</p>
          </div>
          <div>
            <p className="font-medium">Features</p>
            <p>{property.features ? property.features.length : 0}</p>
          </div>
          <div>
            <p className="font-medium">Webview Opens</p>
            <p>{0}</p>
          </div>
          <div>
            <p className="font-medium">Submissions</p>
            <p>{0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
