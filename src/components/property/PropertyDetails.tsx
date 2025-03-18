
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PropertyNearbyPlaces } from "./PropertyNearbyPlaces";
import { PropertyPlaceType } from "@/types/property";

interface PropertyDetailsProps {
  id?: string;
  title: string;
  price: string;
  address: string;
  buildYear: string;
  sqft: string;
  livingArea: string;
  bedrooms: string;
  bathrooms: string;
  garages: string;
  energyLabel: string;
  hasGarden: boolean;
  nearby_places?: PropertyPlaceType[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function PropertyDetails({
  id,
  title,
  price,
  address,
  buildYear,
  sqft,
  livingArea,
  bedrooms,
  bathrooms,
  garages,
  energyLabel,
  hasGarden,
  onChange,
}: PropertyDetailsProps) {
  const handleGardenChange = (checked: boolean) => {
    const event = new Event('change', { bubbles: true }) as unknown as React.ChangeEvent<HTMLInputElement>;
    Object.defineProperty(event, 'target', {
      writable: false,
      value: {
        name: 'hasGarden',
        value: checked,
        type: 'checkbox',
        checked: checked,
      },
    });
    onChange(event);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="property-title">Titel Woning</Label>
        <Input
          id="property-title"
          name="title"
          value={title}
          onChange={onChange}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="property-price">Prijs</Label>
          <Input
            id="property-price"
            name="price"
            type="text"
            value={price}
            onChange={onChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="property-buildYear">Bouwjaar</Label>
          <Input
            id="property-buildYear"
            name="buildYear"
            type="number"
            value={buildYear}
            onChange={onChange}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="property-address">Adres</Label>
        <Input
          id="property-address"
          name="address"
          value={address}
          onChange={onChange}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="property-sqft">Perceeloppervlakte (m²)</Label>
          <Input
            id="property-sqft"
            name="sqft"
            type="number"
            value={sqft}
            onChange={onChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="property-livingArea">Woonoppervlak (m²)</Label>
          <Input
            id="property-livingArea"
            name="livingArea"
            type="number"
            value={livingArea}
            onChange={onChange}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="property-bedrooms">Slaapkamers</Label>
          <Input
            id="property-bedrooms"
            name="bedrooms"
            type="number"
            value={bedrooms}
            onChange={onChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="property-bathrooms">Badkamers</Label>
          <Input
            id="property-bathrooms"
            name="bathrooms"
            type="number"
            value={bathrooms}
            onChange={onChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="property-garages">Garages</Label>
          <Input
            id="property-garages"
            name="garages"
            type="number"
            value={garages}
            onChange={onChange}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
          <Label htmlFor="property-energyLabel">Energielabel</Label>
          <select
            id="property-energyLabel"
            name="energyLabel"
            value={energyLabel}
            onChange={onChange}
            className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">Selecteer label</option>
            <option value="A+++">A+++</option>
            <option value="A++">A++</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="property-hasGarden"
            checked={hasGarden}
            onCheckedChange={handleGardenChange}
          />
          <Label htmlFor="property-hasGarden">Tuin</Label>
        </div>
      </div>
    </div>
  );
}
