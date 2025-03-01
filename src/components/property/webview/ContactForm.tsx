
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ContactFormProps {
  property: PropertyData;
  settings: AgencySettings;
}

export function ContactForm({ property, settings }: ContactFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.message) {
        toast({
          title: "Please fill in all required fields",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Save the submission to the database
      const { data: submissionData, error: submissionError } = await supabase
        .from('form_submissions')
        .insert({
          property_id: property.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          status: 'new'
        })
        .select()
        .single();

      if (submissionError) {
        throw submissionError;
      }

      // Try to send email notification
      try {
        // Check if we have SMTP settings to use
        const hasSMTPSettings = 
          settings.smtp_host && 
          settings.smtp_port && 
          settings.smtp_username && 
          settings.smtp_password && 
          settings.smtp_from_email;

        if (hasSMTPSettings) {
          // Send email using SMTP settings
          await supabase.functions.invoke('send-email-with-smtp', {
            body: {
              to: settings.email,
              subject: `New inquiry for ${property.title}`,
              text: `
                Name: ${formData.name}
                Email: ${formData.email}
                Phone: ${formData.phone || 'Not provided'}
                Message: ${formData.message}
              `,
              html: `
                <h2>New inquiry for ${property.title}</h2>
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
                <p><strong>Message:</strong> ${formData.message}</p>
                <p>Login to respond to this inquiry.</p>
              `,
              smtpSettings: {
                host: settings.smtp_host,
                port: Number(settings.smtp_port),
                username: settings.smtp_username,
                password: settings.smtp_password,
                fromEmail: settings.smtp_from_email,
                fromName: settings.smtp_from_name || settings.name,
                secure: settings.smtp_secure || false
              }
            }
          });
        } else {
          // Fallback to default notification method
          await supabase.functions.invoke('send-agent-notification', {
            body: {
              property_id: property.id,
              property_title: property.title,
              submission_id: submissionData.id,
              agent_email: property.agent_email || settings.email,
              agent_name: property.agent_name || settings.name,
              inquiry_name: formData.name,
              inquiry_email: formData.email,
              inquiry_phone: formData.phone,
              inquiry_message: formData.message
            }
          });
        }
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        // We don't want to block the form submission if email fails
      }

      // Success message
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });

      // Reset the form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error submitting form",
        description: "Please try again later.",
        variant: "destructive"
      });
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Your Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Input
          placeholder="Your Email *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Input
          placeholder="Your Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <Textarea
          placeholder="Your Message *"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
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
