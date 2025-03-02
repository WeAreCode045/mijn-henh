
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropertyWebView } from "./PropertyWebView";
import { PropertyData } from "@/types/property";

interface PropertyWebViewDialogProps {
  property: PropertyData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertyWebViewDialog({ property, open, onOpenChange }: PropertyWebViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <PropertyWebView 
            property={property}
            open={open} 
            onOpenChange={onOpenChange} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
