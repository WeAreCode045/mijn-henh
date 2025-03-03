
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropertyWebView } from "../../PropertyWebView";
import { PropertyData } from "@/types/property";

interface PropertyWebViewDialogProps {
  propertyData: PropertyData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertyWebViewDialog({ 
  propertyData, 
  isOpen, 
  onOpenChange 
}: PropertyWebViewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <PropertyWebView 
            property={propertyData}
            open={isOpen} 
            onOpenChange={onOpenChange} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
