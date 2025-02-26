
import { Home, List, Grid, FileText, MapPin } from "lucide-react";

export type FormStep = {
  id: number;
  title: string;
  icon: React.ReactNode;
};

export const steps: FormStep[] = [
  { id: 1, title: "General Info", icon: <Home className="w-4 h-4" /> },
  { id: 2, title: "Features", icon: <List className="w-4 h-4" /> },
  { id: 3, title: "Areas", icon: <Grid className="w-4 h-4" /> },
  { id: 4, title: "Floorplans", icon: <FileText className="w-4 h-4" /> },
  { id: 5, title: "Location", icon: <MapPin className="w-4 h-4" /> },
];
