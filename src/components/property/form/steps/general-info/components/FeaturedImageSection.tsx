
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PropertyFormData } from "@/types/property";

interface FeaturedImageSectionProps {
  formData: PropertyFormData;
}

export function FeaturedImageSection({ 
  formData 
}: FeaturedImageSectionProps) {
  return (
    <div>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Featured Image Functionality Removed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm p-4 text-center">
            The featured image functionality has been removed.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
