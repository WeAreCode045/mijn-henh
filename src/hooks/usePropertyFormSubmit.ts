
import { PropertyFormData } from "@/types/property";

export function usePropertyFormSubmit() {
  // This is a stub function that doesn't actually save anything
  const handleSubmit = async () => {
    console.log("Submit functionality has been disabled");
    return true;
  };

  return { handleSubmit };
}
