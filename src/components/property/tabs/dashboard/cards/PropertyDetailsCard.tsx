
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code } from "@/components/ui/code";
import { Save } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PropertyDetailsCardProps {
  id: string;
  objectId?: string;
  title: string;
  apiEndpoint: string;
  createdAt?: string;
  updatedAt?: string;
  onSaveObjectId: (objectId: string) => Promise<void>;
  isUpdating: boolean;
  onGeneratePDF: () => void;
  onWebView: (e: React.MouseEvent) => void;
  onSave: () => void;
  onDelete: () => Promise<void>;
  formattedCreateDate: string;
  formattedUpdateDate: string;
}

export function PropertyDetailsCard({
  id,
  objectId,
  title,
  apiEndpoint,
  createdAt,
  updatedAt,
  onSaveObjectId,
  isUpdating,
  formattedCreateDate,
  formattedUpdateDate
}: PropertyDetailsCardProps) {
  const [currentObjectId, setCurrentObjectId] = React.useState(objectId || "");
  const isMobile = useIsMobile();
  
  const handleSaveObjectIdClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSaveObjectId(currentObjectId);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-sm font-medium">ID:</span>
          <p className="text-sm font-mono break-all">{id}</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="object-id">Object ID</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="object-id"
              value={currentObjectId}
              onChange={(e) => setCurrentObjectId(e.target.value)}
              placeholder="Enter object ID"
              className="sm:flex-1"
            />
            <Button onClick={handleSaveObjectIdClick} disabled={isUpdating} size={isMobile ? "sm" : "default"}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        
        <div>
          <span className="text-sm font-medium">API Endpoint:</span>
          <Code className="text-xs mt-1 overflow-x-auto w-full block">{apiEndpoint}</Code>
        </div>
        
        {createdAt && (
          <div>
            <span className="text-sm font-medium">Created:</span>
            <p className="text-sm">{formattedCreateDate}</p>
          </div>
        )}
        
        {updatedAt && (
          <div>
            <span className="text-sm font-medium">Last Modified:</span>
            <p className="text-sm">{formattedUpdateDate}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
