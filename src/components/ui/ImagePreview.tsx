
import { X, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
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
            <Crown className={cn("h-4 w-4", isFeatured ? "fill-yellow-500" : "")} />
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
            <Star className={cn("h-4 w-4", isInFeatured ? "fill-blue-500" : "")} />
          </Button>
        )}
      </div>

      {/* Draggable indicator in the center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-80 transition-opacity">
        <div className="bg-white bg-opacity-90 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="12" r="1"/>
            <circle cx="9" cy="5" r="1"/>
            <circle cx="9" cy="19" r="1"/>
            <circle cx="15" cy="12" r="1"/>
            <circle cx="15" cy="5" r="1"/>
            <circle cx="15" cy="19" r="1"/>
          </svg>
        </div>
      </div>
      
      {/* Main image tag */}
      {isFeatured && (
        <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded">
          Main
        </div>
      )}
      
      {/* Featured image tag (previously Cover) */}
      {isInFeatured && !isFeatured && (
        <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
          Featured
        </div>
      )}
      
      {/* Show both tags if both are true, position the featured tag below the main tag */}
      {isInFeatured && isFeatured && (
        <div className="absolute top-6 left-1 bg-blue-500 text-white text-xs px-1 rounded">
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
