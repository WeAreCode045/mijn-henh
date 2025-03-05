
import { AreasStep } from "./steps/AreasStep";
import { GeneralInfoStep } from "./steps/GeneralInfoStep";
import { FeaturesStep } from "./steps/FeaturesStep";
import { ImagesStep } from "./steps/ImagesStep";
import { LocationStep } from "./steps/LocationStep";
import { Info, MapPin, List, Grid, Image } from "lucide-react";

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
    title: "Images",
    component: ImagesStep,
    icon: <Image className="h-4 w-4" />,
  },
  {
    id: 4,
    title: "Areas",
    component: AreasStep,
    icon: <Grid className="h-4 w-4" />,
  },
  {
    id: 5,
    title: "Location",
    component: LocationStep,
    icon: <MapPin className="h-4 w-4" />,
  },
];
