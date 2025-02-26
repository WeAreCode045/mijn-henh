
import { useState } from "react";

export const useLogoUpload = () => {
  const [logoPreview, setLogoPreview] = useState<string>("");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return { logoPreview, setLogoPreview, handleLogoUpload };
};
