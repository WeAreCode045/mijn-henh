
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PropertyMediaLibraryProps {
  images: string[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export function PropertyMediaLibrary({
  images,
  onImageUpload,
  onRemoveImage,
}: PropertyMediaLibraryProps) {
  return (
    <Card className="p-4 sticky top-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Property Photos</Label>
          <Input
            type="file"
            onChange={onImageUpload}
            accept="image/*"
            multiple
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {images.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Property photo ${index + 1}`}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5"
                onClick={() => onRemoveImage(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
