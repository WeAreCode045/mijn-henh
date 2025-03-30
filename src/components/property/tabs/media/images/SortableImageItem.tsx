
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Trash2, Star, GripVertical, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyImage } from "@/types/property";

interface SortableImageItemProps {
  id: string;
  image: PropertyImage | string;
  index: number;
  onRemove: () => void;
  isActive: boolean;
  isMain?: boolean;
  isFeatured?: boolean;
  onSetMain?: (e: React.MouseEvent) => void;
  onToggleFeatured?: (e: React.MouseEvent) => void;
  isUpdating?: boolean;
}

export function SortableImageItem({
  id,
  image,
  index,
  onRemove,
  isActive,
  isMain = false,
  isFeatured = false,
  onSetMain,
  onToggleFeatured,
  isUpdating = false
}: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isActive ? 10 : 1
  };

  const imageUrl = typeof image === 'string' ? image : image.url;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group border rounded-md overflow-hidden",
        isMain ? 'ring-2 ring-blue-500' : '',
        isActive ? 'z-10' : ''
      )}
    >
      <img 
        src={imageUrl} 
        alt={`Property ${index + 1}`} 
        className="w-full h-40 object-cover"
      />
      
      {/* Drag handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing
                  bg-white bg-opacity-60 rounded-full p-1 transition-opacity"
      >
        <GripVertical className="h-6 w-6 text-gray-600" />
      </div>

      {/* Action buttons in the top right corner */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {onSetMain && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onSetMain}
            className={cn(
              "h-8 w-8 bg-white/90 hover:bg-white backdrop-blur-sm",
              isMain ? "text-yellow-500 border-yellow-500" : "text-gray-700"
            )}
            disabled={isUpdating}
            title={isMain ? "Main image" : "Set as main"}
          >
            <Crown className={cn("h-4 w-4", isMain ? "fill-yellow-500" : "")} />
          </Button>
        )}
        
        {onToggleFeatured && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggleFeatured}
            className={cn(
              "h-8 w-8 bg-white/90 hover:bg-white backdrop-blur-sm",
              isFeatured ? "text-blue-500 border-blue-500" : "text-gray-700"
            )}
            disabled={isUpdating}
            title={isFeatured ? "Remove from featured" : "Add to featured"}
          >
            <Star className={cn("h-4 w-4", isFeatured ? "fill-blue-500" : "")} />
          </Button>
        )}
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 bg-white/90 hover:bg-white backdrop-blur-sm text-red-500 hover:bg-red-50 hover:border-red-500"
          disabled={isUpdating}
          title="Remove image"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Status badges */}
      {isMain && (
        <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
          Main
        </div>
      )}
      {isFeatured && (
        <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          Featured
        </div>
      )}
    </div>
  );
}
