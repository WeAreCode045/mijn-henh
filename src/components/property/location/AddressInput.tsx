
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin } from "lucide-react";

interface AddressInputProps {
  address: string;
  isLoading: boolean;
  disabled: boolean;
  hasNearbyPlaces: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationFetch: () => Promise<void>;
  onGenerateDescription: () => Promise<void>;
}

export function AddressInput({
  address,
  isLoading,
  disabled,
  hasNearbyPlaces,
  onChange,
  onLocationFetch,
  onGenerateDescription,
}: AddressInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="address">Adres</Label>
      <div className="flex gap-2">
        <Input
          id="address"
          name="address"
          value={address}
          onChange={onChange}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={onLocationFetch}
          disabled={isLoading || disabled}
          className="whitespace-nowrap"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4 mr-2" />
          )}
          Locatie Ophalen
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onGenerateDescription}
          disabled={!address || !hasNearbyPlaces}
        >
          Beschrijving Genereren
        </Button>
      </div>
    </div>
  );
}
