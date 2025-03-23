
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyArea } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { EditAreaButton } from './EditAreaButton';

interface AreaCardProps {
  area: PropertyArea;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

export function AreaCard({ area, onEdit, onRemove }: AreaCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium">
          {area.title || area.name || "Unnamed Area"}
        </CardTitle>
        <div className="flex items-center space-x-1">
          <EditAreaButton onClick={() => onEdit(area.id)} />
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              e.stopPropagation(); // Prevent event bubbling
              onRemove(area.id);
            }}
            type="button" // Explicitly set as button type
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {area.description ? (
            area.description.length > 100 
              ? area.description.substring(0, 100) + "..." 
              : area.description
          ) : (
            "No description"
          )}
        </p>
        
        <div className="text-sm text-muted-foreground mt-2">
          <span className="font-medium">Images:</span> {area.images?.length || 0}
        </div>
      </CardContent>
    </Card>
  );
}
