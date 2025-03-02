
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PropertyFormData } from "@/types/property";

interface GridImagesSectionProps {
  formData: PropertyFormData;
  onFieldChange: (field: keyof PropertyFormData, value: any) => void;
}

export function GridImagesSection({ 
  formData, 
  onFieldChange 
}: GridImagesSectionProps) {
  return (
    <div>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Media Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm p-4 text-center">
            The grid images functionality has been removed.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
