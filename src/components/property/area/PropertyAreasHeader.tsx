
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface PropertyAreasHeaderProps {
  onAdd: () => void;
}

export function PropertyAreasHeader({ onAdd }: PropertyAreasHeaderProps) {
  const handleAddArea = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAdd();
  };

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-estate-800">Property Areas</h2>
      <Button 
        onClick={handleAddArea} 
        size="sm" 
        className="flex items-center" 
        type="button"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Area
      </Button>
    </div>
  );
}
