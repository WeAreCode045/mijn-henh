
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Trash2Icon, StarIcon, GripVertical } from "lucide-react";
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
  onSetMain?: () => void;
  onToggleFeatured?: () => void;
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
                  bg-white bg-opacity-60 rounded-full p-1"
      >
        <GripVertical className="h-6 w-6 text-gray-600" />
      </div>

      {/* Action buttons overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 
                    transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex flex-col space-y-2">
          {onSetMain && (
            <Button
              variant={isMain ? "default" : "outline"}
              size="sm"
              onClick={onSetMain}
              className="bg-white text-black hover:bg-gray-100"
              disabled={isUpdating}
            >
              <StarIcon className={`h-4 w-4 mr-1 ${isMain ? 'text-yellow-500' : ''}`} />
              {isMain ? 'Main' : 'Set Main'}
            </Button>
          )}
          
          {onToggleFeatured && (
            <Button
              variant={isFeatured ? "default" : "outline"}
              size="sm"
              onClick={onToggleFeatured}
              className="bg-white text-black hover:bg-gray-100"
              disabled={isUpdating}
            >
              {isFeatured ? 'Featured' : 'Set Featured'}
            </Button>
          )}
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemove}
            disabled={isUpdating}
          >
            <Trash2Icon className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
      
      {/* Status badges */}
      {isMain && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          Main
        </div>
      )}
      {isFeatured && (
        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          Featured
        </div>
      )}
    </div>
  );
}
