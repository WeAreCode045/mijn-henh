
import React from "react";
import { PropertyArea } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { AreaEditor } from "./AreaEditor";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface AreasListProps {
  areas: PropertyArea[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onAreaImageRemove?: (areaId: string, imageId: string) => void;
  onAreaImageUpload?: (areaId: string, files: FileList) => Promise<void>;
  isUploading?: boolean;
}

export function AreasList({
  areas,
  onRemove,
  onUpdate,
  onAreaImageRemove,
  onAreaImageUpload,
  isUploading = false
}: AreasListProps) {
  if (!areas.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No areas have been added. Click the "Add Area" button to create one.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {areas.map((area) => (
        <Card key={area.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between bg-muted p-4">
              <h3 className="font-medium text-lg">
                {area.name || "Unnamed Area"}
              </h3>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Area</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this area? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onRemove(area.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <AreaEditor
              area={area}
              onUpdate={(field, value) => onUpdate(area.id, field, value)}
              onAreaImageRemove={onAreaImageRemove ? (imageId) => onAreaImageRemove(area.id, imageId) : undefined}
              onAreaImageUpload={onAreaImageUpload ? (files) => onAreaImageUpload(area.id, files) : undefined}
              isUploading={isUploading}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
