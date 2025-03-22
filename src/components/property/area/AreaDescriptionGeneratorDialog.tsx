
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AreaDescriptionGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  areaTitle: string;
  keywords: string;
  onKeywordsChange: (keywords: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function AreaDescriptionGeneratorDialog({
  open,
  onOpenChange,
  areaTitle,
  keywords,
  onKeywordsChange,
  onGenerate,
  isGenerating,
}: AreaDescriptionGeneratorDialogProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Description for {areaTitle || "Area"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Label htmlFor="area-keywords">Enter keywords (one per line)</Label>
          <Textarea
            id="area-keywords"
            placeholder="spacious
modern
bright
new appliances
hardwood floors"
            rows={6}
            value={keywords}
            onChange={(e) => onKeywordsChange(e.target.value)}
          />
          
          <div className="text-sm text-muted-foreground">
            <p>Enter each keyword or phrase on a new line. The AI will use these to generate a compelling description.</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            onClick={onGenerate}
            disabled={isGenerating || !keywords.trim()}
          >
            {isGenerating ? "Generating..." : "Generate Description"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
