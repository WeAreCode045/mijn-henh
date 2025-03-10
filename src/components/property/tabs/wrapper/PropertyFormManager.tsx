
import { usePropertyFormManager } from "@/hooks/usePropertyFormManager";
import { PropertyFormManagerProps } from "./types/PropertyFormManagerTypes";

export function PropertyFormManager({ property, children }: PropertyFormManagerProps) {
  // Use the custom hook that combines all form-related functionality
  const formManagerProps = usePropertyFormManager(property);
  
  // Pass all the props to the children render function
  return children(formManagerProps);
}
