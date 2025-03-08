
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings } from "@/types/agency";
import { PropertyData } from "@/types/property";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
}

export async function submitContactForm(
  formData: ContactFormData,
  property: PropertyData,
  settings: AgencySettings
) {
  // Validate form data
  if (!formData.name || !formData.email || !formData.message || !formData.inquiry_type) {
    throw new Error("Vul alle verplichte velden in");
  }

  console.log("Submitting contact form with data:", formData);
  console.log("Property:", property.id);

  // Save the submission to the database
  const { data: submissionData, error: submissionError } = await supabase
    .from('property_contact_submissions')
    .insert({
      property_id: property.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      inquiry_type: formData.inquiry_type,
      agent_id: property.agent_id,
      is_read: false
    })
    .select()
    .single();

  if (submissionError) {
    console.error("Error saving submission:", submissionError);
    throw new Error("Er is een fout opgetreden bij het verzenden van het formulier");
  }

  console.log("Submission saved successfully:", submissionData);

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
      // Get the inquiry type label for the email
      const inquiryTypeLabels: Record<string, string> = {
        'offer': 'een bod doen',
        'viewing': 'een bezichtiging plannen',
        'information': 'meer informatie'
      };
      const inquiryTypeLabel = inquiryTypeLabels[formData.inquiry_type] || formData.inquiry_type;

      // Send email using SMTP settings
      await supabase.functions.invoke('send-email-with-smtp', {
        body: {
          to: settings.email,
          subject: `Nieuwe aanvraag voor ${property.title}`,
          text: `
            Naam: ${formData.name}
            E-mail: ${formData.email}
            Telefoon: ${formData.phone || 'Niet opgegeven'}
            Type aanvraag: ${inquiryTypeLabel}
            Bericht: ${formData.message}
          `,
          html: `
            <h2>Nieuwe aanvraag voor ${property.title}</h2>
            <p><strong>Naam:</strong> ${formData.name}</p>
            <p><strong>E-mail:</strong> ${formData.email}</p>
            <p><strong>Telefoon:</strong> ${formData.phone || 'Niet opgegeven'}</p>
            <p><strong>Type aanvraag:</strong> ${inquiryTypeLabel}</p>
            <p><strong>Bericht:</strong> ${formData.message}</p>
            <p>Log in om te reageren op deze aanvraag.</p>
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
      console.log("Sending agent notification with:", {
        property_id: property.id,
        property_title: property.title,
        submission_id: submissionData.id,
        agent_email: property.agent?.email || settings.email
      });
      
      await supabase.functions.invoke('send-agent-notification', {
        body: {
          property_id: property.id,
          property_title: property.title,
          submission_id: submissionData.id,
          agent_email: property.agent?.email || settings.email,
          agent_name: property.agent?.name || settings.name,
          inquiry_name: formData.name,
          inquiry_email: formData.email,
          inquiry_phone: formData.phone,
          inquiry_message: formData.message,
          inquiry_type: formData.inquiry_type
        }
      });
      
      console.log("Agent notification sent successfully");
    }
  } catch (emailError) {
    console.error("Error sending email notification:", emailError);
    // We don't want to block the form submission if email fails
  }

  return submissionData;
}
