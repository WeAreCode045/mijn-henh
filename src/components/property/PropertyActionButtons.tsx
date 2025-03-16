
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, FileDown, Globe, Trash2, Save } from "lucide-react";

interface PropertyActionButtonsProps {
  onSave: () => void;
  onDelete: () => void;
  onGeneratePDF: () => void;
  onWebView: () => void;
  propertyId: string;
}

export function PropertyActionButtons({
  onSave,
  onDelete,
  onGeneratePDF,
  onWebView,
  propertyId,
}: PropertyActionButtonsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={onSave}
            type="button"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onWebView}
            type="button"
          >
            <Globe className="mr-2 h-4 w-4" />
            Web View
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onGeneratePDF}
            type="button"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Generate PDF
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            asChild
          >
            <a href={`/share/${propertyId}`} target="_blank" rel="noopener noreferrer">
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </a>
          </Button>

          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={onDelete}
            type="button"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Property
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
