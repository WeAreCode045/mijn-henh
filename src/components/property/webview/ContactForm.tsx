
import { Button } from "@/components/ui/button";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { useContactForm } from "./hooks/useContactForm";
import { FormInput } from "./components/FormInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ContactFormProps {
  property: PropertyData;
  settings: AgencySettings;
}

export function ContactForm({ property, settings }: ContactFormProps) {
  const { formData, handleChange, handleSelectChange, handleSubmit, isSubmitting } = useContactForm(property, settings);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <FormInput
              type="text"
              placeholder="Uw naam *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <FormInput
              type="tel"
              placeholder="Uw telefoonnummer *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <FormInput
              type="email"
              placeholder="Uw e-mailadres *"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        {/* Right column */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="inquiry_type" className="block text-sm mb-2">Ik wil graag:</Label>
            <Select 
              name="inquiry_type" 
              value={formData.inquiry_type || "information"} 
              onValueChange={(value) => handleSelectChange("inquiry_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een optie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="offer">een bod doen</SelectItem>
                <SelectItem value="viewing">een bezichtiging plannen</SelectItem>
                <SelectItem value="information">meer informatie</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <FormInput
              type="textarea"
              placeholder="Uw bericht *"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
            />
          </div>
        </div>
      </div>
      
      {/* Full-width button at the bottom */}
      <div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Verzenden..." : "Verstuur bericht"}
        </Button>
      </div>
    </form>
  );
}
