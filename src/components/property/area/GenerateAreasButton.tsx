
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { PropertyFormData } from "@/types/property";
import { useAutoGenerateAreas } from "@/hooks/areas/useAutoGenerateAreas";

interface GenerateAreasButtonProps {
  propertyData: PropertyFormData;
  onAreasGenerated: (newAreas: any[]) => void;
}

export function GenerateAreasButton({ 
  propertyData, 
  onAreasGenerated 
}: GenerateAreasButtonProps) {
  const { generateAreasFromDescription, isGenerating } = useAutoGenerateAreas();

  const handleGenerateAreas = async () => {
    await generateAreasFromDescription(propertyData, onAreasGenerated);
  };

  return (
    <Button
      variant="outline"
      onClick={handleGenerateAreas}
      disabled={isGenerating || !propertyData.description}
      className="flex items-center gap-2"
    >
      <Wand2 className="h-4 w-4" />
      {isGenerating ? "Generating Areas..." : "Auto-Generate Areas"}
    </Button>
  );
}
