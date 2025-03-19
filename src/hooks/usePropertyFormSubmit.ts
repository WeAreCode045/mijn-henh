
import { usePropertyFormSubmitHandler } from "./property-form/usePropertyFormSubmitHandler";

export function usePropertyFormSubmit() {
  const { handleSubmit } = usePropertyFormSubmitHandler();
  
  return { handleSubmit };
}
