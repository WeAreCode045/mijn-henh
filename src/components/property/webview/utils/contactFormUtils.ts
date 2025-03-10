
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings } from "@/types/agency";
import { PropertyData } from "@/types/property";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function submitContactForm(
  formData: ContactFormData,
  property: PropertyData,
  settings: AgencySettings
) {
  // Validate form data
  if (!formData.name || !formData.email || !formData.message) {
    throw new Error("Please fill in all required fields");
  }

  // Save the submission to the database
  const { data: submissionData, error: submissionError } = await supabase
    .from('property_contact_submissions')
    .insert({
      property_id: property.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      inquiry_type: 'information',
      agent_id: property.agent_id,
      is_read: false,
      created_at: new Date().toISOString()
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
          agent_email: property.agent?.email || settings.email,
          agent_name: property.agent?.name || settings.name,
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

  return submissionData;
}
