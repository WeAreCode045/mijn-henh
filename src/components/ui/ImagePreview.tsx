
import { X, Star, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  url: string;
  onRemove: () => void;
  isFeatured?: boolean;
  onSetFeatured?: (e: React.MouseEvent) => void;
  isInFeatured?: boolean;
  onToggleFeatured?: (e: React.MouseEvent) => void;
  label?: string; // Added label prop
}

export function ImagePreview({
  url,
  onRemove,
  isFeatured,
  onSetFeatured,
  isInFeatured,
  onToggleFeatured,
  label
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
          onClick={(e) => {
            e.preventDefault(); // Prevent form submission
            onRemove();
          }} 
          className="h-8 w-8"
          type="button"
        >
          <X className="h-4 w-4" />
        </Button>
        
        {onSetFeatured && (
          <Button 
            size="icon" 
            variant={isFeatured ? "secondary" : "ghost"} 
            onClick={onSetFeatured} 
            className={`h-8 w-8 ${isFeatured ? "bg-yellow-100" : "hover:bg-yellow-50"}`}
            title={isFeatured ? "Main image" : "Set as main"}
            type="button"
          >
            <Star className={`h-4 w-4 ${isFeatured ? "fill-yellow-500" : ""}`} />
          </Button>
        )}
        
        {onToggleFeatured && (
          <Button 
            size="icon" 
            variant={isInFeatured ? "secondary" : "ghost"} 
            onClick={onToggleFeatured} 
            className={`h-8 w-8 ${isInFeatured ? "bg-blue-100" : "hover:bg-blue-50"}`}
            title={isInFeatured ? "Remove from featured" : "Add to featured"}
            type="button"
          >
            <Grid className={`h-4 w-4 ${isInFeatured ? "text-blue-500" : ""}`} />
          </Button>
        )}
      </div>
      
      {/* Main image tag */}
      {isFeatured && (
        <div className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-1 rounded">
          Main
        </div>
      )}
      
      {/* Featured image tag (previously Cover) */}
      {isInFeatured && !isFeatured && (
        <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">
          Featured
        </div>
      )}
      
      {/* Show both tags if both are true, position the featured tag below the main tag */}
      {isInFeatured && isFeatured && (
        <div className="absolute top-6 right-1 bg-blue-500 text-white text-xs px-1 rounded">
          Featured
        </div>
      )}
      
      {/* Display label if provided */}
      {label && (
        <div className="p-2 bg-white/90 text-center font-medium">
          {label}
        </div>
      )}
    </div>
  );
}
