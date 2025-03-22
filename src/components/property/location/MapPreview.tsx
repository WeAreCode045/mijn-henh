
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, MapPin, Trash2 } from "lucide-react";
import Image from "next/image";

interface MapPreviewProps {
  map_image: string | null;
  onDelete?: () => void;
  onGenerate?: () => Promise<void>; // Added onGenerate prop
  isGenerating?: boolean;
  isDisabled?: boolean;
}

export function MapPreview({
  map_image,
  onDelete,
  onGenerate,
  isGenerating = false,
  isDisabled = false
}: MapPreviewProps) {
  if (!map_image) {
    return (
      <div className="bg-muted rounded-lg p-4 text-center">
        <p className="text-muted-foreground">Nog geen kaart beschikbaar</p>
        {onGenerate && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={onGenerate}
            disabled={isGenerating || isDisabled}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Genereren...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Kaart Genereren
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="aspect-video relative">
        <img 
          src={map_image} 
          alt="Property location map" 
          className="object-cover w-full h-full"
        />
      </div>
      {onDelete && !isDisabled && (
        <Button 
          variant="destructive" 
          size="icon" 
          className="absolute top-2 right-2" 
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      {onGenerate && !isDisabled && (
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute bottom-2 right-2" 
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Opnieuw Genereren...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              Kaart Opnieuw Genereren
            </>
          )}
        </Button>
      )}
    </Card>
  );
}
