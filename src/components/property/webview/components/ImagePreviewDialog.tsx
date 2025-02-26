
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ImagePreviewDialogProps {
  selectedImage: string | null;
  onClose: () => void;
}

export function ImagePreviewDialog({ selectedImage, onClose }: ImagePreviewDialogProps) {
  if (!selectedImage) return null;

  return (
    <Dialog open={!!selectedImage} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh]">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        <img
          src={selectedImage}
          alt="Large view"
          className="w-full h-full object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
