
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FloorplanEmbedProps {
  embedScript: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function FloorplanEmbed({ embedScript, onChange }: FloorplanEmbedProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="floorplan-embed">Floorplan Embed Script</Label>
      <Textarea
        id="floorplan-embed"
        placeholder="Paste your 3D/virtual floorplan embed script here..."
        className="min-h-[100px] font-mono text-xs"
        value={embedScript}
        onChange={onChange}
      />
      <p className="text-xs text-muted-foreground">
        Paste embed code from Matterport, iGuide, or other 3D tour providers
      </p>
    </div>
  );
}
