
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Code } from "@/components/ui/code";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface PropertyDetailsCardProps {
  id: string;
  objectId?: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
  apiEndpoint: string;
  onSaveObjectId: (objectId: string) => void;
  isUpdating: boolean;
  onGeneratePDF?: () => void;
  onWebView?: () => void;
  onSave?: () => void;
  onDelete?: () => Promise<void>;
  formattedCreateDate?: string;
  formattedUpdateDate?: string;
}

export function PropertyDetailsCard({
  id,
  objectId,
  title,
  createdAt,
  updatedAt,
  apiEndpoint,
  onSaveObjectId,
  isUpdating,
  onGeneratePDF,
  onWebView,
  onSave,
  onDelete,
  formattedCreateDate,
  formattedUpdateDate
}: PropertyDetailsCardProps) {
  const [currentObjectId, setCurrentObjectId] = useState(objectId || "");
  
  // Format dates properly
  const [formattedCreate, setFormattedCreate] = useState<string | undefined>(formattedCreateDate);
  const [formattedUpdate, setFormattedUpdate] = useState<string | undefined>(formattedUpdateDate);
  
  useEffect(() => {
    // Format dates whenever they change
    if (createdAt) {
      try {
        setFormattedCreate(format(new Date(createdAt), 'MMM d, yyyy h:mm a'));
      } catch (e) {
        setFormattedCreate(createdAt);
      }
    }
    
    if (updatedAt) {
      try {
        setFormattedUpdate(format(new Date(updatedAt), 'MMM d, yyyy h:mm a'));
      } catch (e) {
        setFormattedUpdate(updatedAt);
      }
    }
  }, [createdAt, updatedAt]);

  const handleSaveObjectId = (e: React.MouseEvent) => {
    e.preventDefault();
    onSaveObjectId(currentObjectId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-sm font-medium">ID:</span>
          <p className="text-sm font-mono">{id}</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="object-id">Object ID</Label>
          <div className="flex gap-2">
            <Input
              id="object-id"
              value={currentObjectId}
              onChange={(e) => setCurrentObjectId(e.target.value)}
              placeholder="Enter object ID"
            />
            <Button onClick={handleSaveObjectId} disabled={isUpdating} size="sm">
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        
        <div>
          <span className="text-sm font-medium">API Endpoint:</span>
          <Code className="text-xs mt-1">{apiEndpoint}</Code>
        </div>
        
        {createdAt && (
          <div>
            <span className="text-sm font-medium">Created:</span>
            <p className="text-sm">{formattedCreate || "N/A"}</p>
          </div>
        )}
        
        {updatedAt && (
          <div>
            <span className="text-sm font-medium">Last Modified:</span>
            <p className="text-sm">{formattedUpdate || "N/A"}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
