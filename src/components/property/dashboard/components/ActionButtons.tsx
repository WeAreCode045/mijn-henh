
import { Button } from "@/components/ui/button";
import { TrashIcon, EyeIcon, FileTextIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActionButtonsProps {
  propertyId: string;
  onDelete: () => Promise<void>;
  onWebView: (e: React.MouseEvent) => void;
  onGeneratePDF: () => void;
  isCompact?: boolean;
}

export function ActionButtons({ 
  propertyId, 
  onDelete, 
  onWebView, 
  onGeneratePDF,
  isCompact = false
}: ActionButtonsProps) {
  const isMobile = useIsMobile();
  const useCompact = isCompact || isMobile;

  return (
    <>
      {useCompact ? (
        <>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={onWebView}
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            Web View
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onGeneratePDF();
            }}
          >
            <FileTextIcon className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            className="w-full col-span-2 mt-2"
            onClick={onDelete}
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </>
      ) : (
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onWebView}
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Web View
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onGeneratePDF();
            }}
          >
            <FileTextIcon className="h-4 w-4 mr-2" />
            Generate PDF
          </Button>
          <Button 
            variant="destructive" 
            className="w-full mt-1"
            onClick={onDelete}
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete Property
          </Button>
        </div>
      )}
    </>
  );
}
