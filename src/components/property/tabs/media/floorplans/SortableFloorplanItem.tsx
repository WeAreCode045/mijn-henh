
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImagePreview } from "@/components/ui/ImagePreview";

interface SortableFloorplanItemProps {
  id: string;
  url: string;
  label: string;
  onRemove: () => void;
  sort_order?: number; // Add sort_order prop to the interface
}

export function SortableFloorplanItem({ 
  id, 
  url, 
  label, 
  onRemove,
  sort_order // Add sort_order to the props destructuring
}: SortableFloorplanItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <ImagePreview
        url={url}
        onRemove={onRemove}
        label={label}
      />
    </div>
  );
}
