
import { getEnergyLabelImagePath } from "../utils/propertyDetailsUtils";

interface EnergyLabelDisplayProps {
  energyLabel?: string;
}

export function EnergyLabelDisplay({ energyLabel }: EnergyLabelDisplayProps) {
  if (!energyLabel) return null;
  
  const energyLabelImagePath = getEnergyLabelImagePath(energyLabel);
  
  return (
    <div className="md:w-1/4 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <p className="text-sm font-medium mb-2">Energy Class</p>
        <img 
          src={energyLabelImagePath || ""} 
          alt={`Energy Class ${energyLabel.toUpperCase()}`} 
          className="w-full max-w-[150px] h-auto"
        />
      </div>
    </div>
  );
}
