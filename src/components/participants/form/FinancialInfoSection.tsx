
import { ParticipantFormData } from "@/types/participant";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinancialInfoSectionProps {
  formData: ParticipantFormData;
  setFormData: React.Dispatch<React.SetStateAction<ParticipantFormData>>;
}

export function FinancialInfoSection({ formData, setFormData }: FinancialInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="iban">IBAN</Label>
          <Input
            id="iban"
            value={formData.iban}
            onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
            placeholder="Enter IBAN number"
          />
        </div>
      </CardContent>
    </Card>
  );
}
