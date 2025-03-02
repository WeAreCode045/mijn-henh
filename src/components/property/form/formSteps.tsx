
import { AreasStep } from "./steps/AreasStep";
import { GeneralInfoStep } from "./steps/GeneralInfoStep";
import { FeaturesStep } from "./steps/FeaturesStep";
import { TechnicalDataStep } from "./steps/TechnicalDataStep";
import { LocationStep } from "./steps/LocationStep";
import { FloorplansStep } from "./steps/FloorplansStep";
import { Info, MapPin, List, Grid, Ruler, FileImage } from "lucide-react";

export interface FormStep {
  id: number;
  title: string;
  component: React.ComponentType<any>;
  icon: React.ReactNode;
}

export const steps: FormStep[] = [
  {
    id: 1,
    title: "General Info",
    component: GeneralInfoStep,
    icon: <Info className="h-4 w-4" />,
  },
  {
    id: 2,
    title: "Features",
    component: FeaturesStep,
    icon: <List className="h-4 w-4" />,
  },
  {
    id: 3,
    title: "Technical Data",
    component: TechnicalDataStep,
    icon: <Ruler className="h-4 w-4" />,
  },
  {
    id: 4,
    title: "Areas",
    component: AreasStep,
    icon: <Grid className="h-4 w-4" />,
  },
  {
    id: 5,
    title: "Floorplans",
    component: FloorplansStep,
    icon: <FileImage className="h-4 w-4" />,
  },
  {
    id: 6,
    title: "Location",
    component: LocationStep,
    icon: <MapPin className="h-4 w-4" />,
  },
];
