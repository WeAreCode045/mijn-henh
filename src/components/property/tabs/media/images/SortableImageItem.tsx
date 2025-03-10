
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImagePreview } from "@/components/ui/ImagePreview";

interface SortableImageItemProps {
  id: string;
  url: string;
  onRemove: () => void;
  isFeatured?: boolean;
  onSetFeatured?: (e: React.MouseEvent) => void;
  isInFeatured?: boolean;
  onToggleFeatured?: (e: React.MouseEvent) => void;
  sort_order?: number;
}

export function SortableImageItem({ 
  id, 
  url, 
  onRemove,
  isFeatured,
  onSetFeatured,
  isInFeatured,
  onToggleFeatured,
  sort_order
}: SortableImageItemProps) {
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
        isFeatured={isFeatured}
        onSetFeatured={onSetFeatured}
        isInFeatured={isInFeatured}
        onToggleFeatured={onToggleFeatured}
      />
    </div>
  );
}
