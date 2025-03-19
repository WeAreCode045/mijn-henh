
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, Globe, Pencil, Save, Trash } from "lucide-react";
import { useState } from "react";

interface PropertyDetailsCardProps {
  id: string;
  objectId?: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  apiEndpoint: string;
  onSaveObjectId?: (objectId: string) => void;
  isUpdating?: boolean;
  onGeneratePDF?: () => void;
  onWebView?: (e?: React.MouseEvent) => void;
  onSave?: () => void;
  onDelete?: () => Promise<void>;
}

export function PropertyDetailsCard({
  id,
  objectId,
  title,
  createdAt,
  updatedAt,
  apiEndpoint,
  onSaveObjectId,
  isUpdating = false,
  onGeneratePDF,
  onWebView,
  onSave,
  onDelete
}: PropertyDetailsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localObjectId, setLocalObjectId] = useState(objectId || "");
  
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };
  
  const handleSave = () => {
    if (onSaveObjectId) {
      onSaveObjectId(localObjectId);
    }
    setIsEditing(false);
  };
  
  const handleDelete = async () => {
    if (onDelete) {
      if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
        await onDelete();
      }
    }
  };
  
  // Format dates for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Property Details</span>
          <div className="flex gap-2">
            {onDelete && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">{title}</h3>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Property ID</span>
            <span className="text-sm font-medium">{id}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Object ID</span>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={localObjectId}
                  onChange={(e) => setLocalObjectId(e.target.value)}
                  placeholder="Enter object ID"
                  className="h-8"
                />
                <Button size="sm" onClick={handleSave} disabled={isUpdating}>
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{objectId || "Not set"}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleToggleEdit}
                  className="h-6 w-6 p-0"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm">{formatDate(createdAt)}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Last Updated</span>
            <span className="text-sm">{formatDate(updatedAt)}</span>
          </div>
          
          <div className="flex flex-col space-y-1 mt-4">
            <span className="text-sm text-muted-foreground">Actions</span>
            <div className="flex gap-2">
              {onWebView && (
                <Button variant="outline" size="sm" onClick={onWebView}>
                  <Globe className="h-4 w-4 mr-2" />
                  Web View
                </Button>
              )}
              {onGeneratePDF && (
                <Button variant="outline" size="sm" onClick={onGeneratePDF}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
