
import { Button } from "@/components/ui/button";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { useContactForm } from "./hooks/useContactForm";
import { FormInput } from "./components/FormInput";

interface ContactFormProps {
  property: PropertyData;
  settings: AgencySettings;
}

export function ContactForm({ property, settings }: ContactFormProps) {
  const { formData, handleChange, handleSubmit, isSubmitting } = useContactForm(property, settings);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <FormInput
          type="text"
          placeholder="Your Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <FormInput
          type="email"
          placeholder="Your Email *"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <FormInput
          type="tel"
          placeholder="Your Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <FormInput
          type="textarea"
          placeholder="Your Message *"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
