
import { X, Star, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  url: string;
  onRemove: () => void;
  isFeatured?: boolean;
  onSetFeatured?: () => void;
  isInGrid?: boolean;
  onToggleGrid?: () => void;
}

export function ImagePreview({
  url,
  onRemove,
  isFeatured,
  onSetFeatured,
  isInGrid,
  onToggleGrid
}: ImagePreviewProps) {
  return (
    <div className="relative group border border-gray-200 rounded-md overflow-hidden">
      <img 
        src={url} 
        alt="Property preview" 
        className="w-full h-32 object-cover"
      />
      
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
        <Button 
          size="icon" 
          variant="destructive" 
          onClick={onRemove} 
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
        
        {onSetFeatured && (
          <Button 
            size="icon" 
            variant={isFeatured ? "secondary" : "ghost"} 
            onClick={onSetFeatured} 
            className="h-8 w-8"
            title={isFeatured ? "Featured image" : "Set as featured"}
          >
            <Star className={`h-4 w-4 ${isFeatured ? "fill-yellow-500" : ""}`} />
          </Button>
        )}
        
        {onToggleGrid && (
          <Button 
            size="icon" 
            variant={isInGrid ? "secondary" : "ghost"} 
            onClick={onToggleGrid} 
            className="h-8 w-8"
            title={isInGrid ? "Remove from grid" : "Add to grid"}
          >
            <Grid className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {isFeatured && (
        <div className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-1 rounded">
          Featured
        </div>
      )}
    </div>
  );
}
