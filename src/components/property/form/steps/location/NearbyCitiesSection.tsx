
import { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface NearbyCitiesSectionProps {
  formData: PropertyFormData;
}

export function NearbyCitiesSection({
  formData
}: NearbyCitiesSectionProps) {
  const nearbyCities = formData.nearby_cities || [];
  
  if (nearbyCities.length === 0) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label>Nearby Cities</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {nearbyCities.map((city, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div>
                  <div className="font-medium">{city.name}</div>
                  <div className="text-sm text-gray-500">{city.distance} km</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
