
import { useState, useEffect } from "react";
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
  // Local state to maintain cursor position
  const [localValues, setLocalValues] = useState({
    title,
    price,
    address,
    buildYear,
    sqft,
    livingArea,
    bedrooms,
    bathrooms,
    garages,
    energyLabel
  });
  
  // Sync with props when they change externally
  useEffect(() => {
    const newValues = {
      title,
      price,
      address,
      buildYear,
      sqft,
      livingArea,
      bedrooms,
      bathrooms,
      garages,
      energyLabel
    };
    
    // Only update if props have changed
    if (JSON.stringify(newValues) !== JSON.stringify(localValues)) {
      setLocalValues(newValues);
    }
  }, [title, price, address, buildYear, sqft, livingArea, bedrooms, bathrooms, garages, energyLabel]);
  
  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update local state immediately
    setLocalValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Pass the change up to parent
    onChange(e);
  };

  const handleGardenChange = (checked: boolean) => {
    const event = {
      target: {
        name: 'hasGarden',
        value: checked,
        type: 'checkbox',
        checked: checked,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onChange(event);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Titel Woning</Label>
        <Input
          id="title"
          name="title"
          value={localValues.title}
          onChange={handleLocalChange}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Prijs</Label>
          <Input
            id="price"
            name="price"
            type="text"
            value={localValues.price}
            onChange={handleLocalChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="buildYear">Bouwjaar</Label>
          <Input
            id="buildYear"
            name="buildYear"
            type="number"
            value={localValues.buildYear}
            onChange={handleLocalChange}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Adres</Label>
        <Input
          id="address"
          name="address"
          value={localValues.address}
          onChange={handleLocalChange}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sqft">Perceeloppervlakte (m²)</Label>
          <Input
            id="sqft"
            name="sqft"
            type="number"
            value={localValues.sqft}
            onChange={handleLocalChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="livingArea">Woonoppervlak (m²)</Label>
          <Input
            id="livingArea"
            name="livingArea"
            type="number"
            value={localValues.livingArea}
            onChange={handleLocalChange}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="bedrooms">Slaapkamers</Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            type="number"
            value={localValues.bedrooms}
            onChange={handleLocalChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="bathrooms">Badkamers</Label>
          <Input
            id="bathrooms"
            name="bathrooms"
            type="number"
            value={localValues.bathrooms}
            onChange={handleLocalChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="garages">Garages</Label>
          <Input
            id="garages"
            name="garages"
            type="number"
            value={localValues.garages}
            onChange={handleLocalChange}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
          <Label htmlFor="energyLabel">Energielabel</Label>
          <select
            id="energyLabel"
            name="energyLabel"
            value={localValues.energyLabel}
            onChange={handleLocalChange}
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
            id="hasGarden"
            checked={hasGarden}
            onCheckedChange={handleGardenChange}
          />
          <Label htmlFor="hasGarden">Tuin</Label>
        </div>
      </div>
    </div>
  );
}
