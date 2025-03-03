
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Code } from "@/components/ui/code";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface PropertyDetailsCardProps {
  id: string;
  objectId?: string;
  createdAt?: string;
  updatedAt?: string;
  apiEndpoint: string;
  onSaveObjectId: (objectId: string) => void;
  isUpdating: boolean;
}

export function PropertyDetailsCard({
  id,
  objectId,
  createdAt,
  updatedAt,
  apiEndpoint,
  onSaveObjectId,
  isUpdating
}: PropertyDetailsCardProps) {
  const [currentObjectId, setCurrentObjectId] = useState(objectId || "");

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
            <p className="text-sm">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
          </div>
        )}
        
        {updatedAt && (
          <div>
            <span className="text-sm font-medium">Last Modified:</span>
            <p className="text-sm">{formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
