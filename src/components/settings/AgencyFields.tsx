
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AgencySettings } from "@/types/agency";

interface AgencyFieldsProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AgencyFields = ({ settings, onChange }: AgencyFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Agency Name</Label>
        <Input
          id="name"
          name="name"
          value={settings.name}
          onChange={onChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={settings.email}
          onChange={onChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={settings.phone}
          onChange={onChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={settings.address}
          onChange={onChange}
        />
      </div>

      <div className="space-y-4 mt-8">
        <h3 className="font-semibold">Social Media</h3>
        <div className="space-y-2">
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input
            id="instagramUrl"
            name="instagramUrl"
            type="url"
            value={settings.instagramUrl}
            onChange={onChange}
            placeholder="https://instagram.com/youragency"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="youtubeUrl">YouTube URL</Label>
          <Input
            id="youtubeUrl"
            name="youtubeUrl"
            type="url"
            value={settings.youtubeUrl}
            onChange={onChange}
            placeholder="https://youtube.com/@youragency"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="facebookUrl">Facebook URL</Label>
          <Input
            id="facebookUrl"
            name="facebookUrl"
            type="url"
            value={settings.facebookUrl}
            onChange={onChange}
            placeholder="https://facebook.com/youragency"
          />
        </div>
      </div>
    </>
  );
};
