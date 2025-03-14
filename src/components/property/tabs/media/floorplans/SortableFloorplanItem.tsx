
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Trash2Icon, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyImage } from "@/types/property";

interface SortableFloorplanItemProps {
  id: string;
  floorplan: PropertyImage | string;
  index: number;
  onRemove: () => void;
  isActive: boolean;
  isUpdating?: boolean;
}

export function SortableFloorplanItem({
  id,
  floorplan,
  index,
  onRemove,
  isActive,
  isUpdating = false
}: SortableFloorplanItemProps) {
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

  const floorplanUrl = typeof floorplan === 'string' ? floorplan : floorplan.url;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group border rounded-md overflow-hidden",
        isActive ? 'z-10' : ''
      )}
    >
      <img 
        src={floorplanUrl} 
        alt={`Floorplan ${index + 1}`} 
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
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              e.stopPropagation(); // Prevent event bubbling
              onRemove();
            }}
            disabled={isUpdating}
          >
            <Trash2Icon className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
