
import { ParticipantFormData } from "@/types/participant";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IdentificationSectionProps {
  formData: ParticipantFormData;
  setFormData: React.Dispatch<React.SetStateAction<ParticipantFormData>>;
}

export function IdentificationSection({ formData, setFormData }: IdentificationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="identificationType">Document Type</Label>
          <Select
            value={formData.identification?.type || ""}
            onValueChange={(value: "passport" | "IDcard") => 
              setFormData(prev => ({ 
                ...prev, 
                identification: { ...prev.identification, type: value }
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="IDcard">ID Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="socialNumber">Social Security Number</Label>
            <Input
              id="socialNumber"
              value={formData.identification?.social_number || ""}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                identification: { ...prev.identification, social_number: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="documentNumber">Document Number</Label>
            <Input
              id="documentNumber"
              value={formData.identification?.document_number || ""}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                identification: { ...prev.identification, document_number: e.target.value }
              }))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
