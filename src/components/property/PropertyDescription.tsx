
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PropertyDescriptionProps {
  description: string;
  location_description?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function PropertyDescription({
  description,
  location_description,
  onChange,
}: PropertyDescriptionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="description">Beschrijving woning</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={onChange}
          className="mt-1"
          placeholder="Voer hier een algemene beschrijving van de woning in..."
          required
        />
      </div>
      
      {location_description !== undefined && (
        <div>
          <Label htmlFor="location_description">Locatiebeschrijving</Label>
          <Textarea
            id="location_description"
            name="location_description"
            value={location_description}
            onChange={onChange}
            className="mt-1"
            placeholder="Beschrijving van de locatie..."
          />
        </div>
      )}
    </div>
  );
}
