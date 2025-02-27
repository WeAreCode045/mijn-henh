
import { AreasStep } from "./steps/AreasStep";
import { GeneralInfoStep } from "./steps/GeneralInfoStep";
import { FeaturesStep } from "./steps/FeaturesStep";
import { ImagesStep } from "./steps/ImagesStep";
import { LocationStep } from "./steps/LocationStep";
import { FloorplansStep } from "./steps/FloorplansStep";

export const steps = [
  {
    id: "general-info",
    title: "General Info",
    component: GeneralInfoStep,
  },
  {
    id: "images",
    title: "Images",
    component: ImagesStep,
  },
  {
    id: "floorplans",
    title: "Floorplans",
    component: FloorplansStep,
  },
  {
    id: "features",
    title: "Features",
    component: FeaturesStep,
  },
  {
    id: "areas",
    title: "Areas",
    component: AreasStep,
  },
  {
    id: "location",
    title: "Location",
    component: LocationStep,
  },
];
