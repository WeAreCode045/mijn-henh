
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LogoUploadProps {
  logoPreview: string;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LogoUpload = ({ logoPreview, onLogoUpload }: LogoUploadProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="logo">Agency Logo</Label>
      <Input
        id="logo"
        name="logo"
        type="file"
        onChange={onLogoUpload}
        accept="image/*"
      />
      {logoPreview && (
        <div className="mt-2">
          <img
            src={logoPreview}
            alt="Agency Logo"
            className="h-16 object-contain"
          />
        </div>
      )}
    </div>
  );
};
