import { AgencySettings } from "@/types/agency";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendFormSubmission(
  formData: FormData,
  propertyTitle: string,
  agencySettings: AgencySettings | null
): Promise<boolean> {
  const smtpConfig = getSMTPConfig(agencySettings);
  
  if (!smtpConfig) {
    console.warn("SMTP settings are not properly configured. Please check your agency settings.");
    return false;
  }
  
  const { name, email, phone, message } = formData;
  const subject = `New Inquiry for ${propertyTitle}`;
  const body = `
    New Inquiry Details:
    Property: ${propertyTitle}
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Message: ${message}
  `;
  
  try {
    const res = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...smtpConfig,
        subject: subject,
        body: body,
      }),
    });
    
    if (!res.ok) {
      console.error('Failed to send email:', res.statusText);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Prepare SMTP configuration from settings
function getSMTPConfig(settings: AgencySettings) {
  if (!settings) return null;
  
  const config = {
    host: settings.smtpHost || '',
    port: settings.smtpPort ? parseInt(settings.smtpPort) : 587,
    user: settings.smtpUsername || '',
    pass: settings.smtpPassword || '',
    from: settings.smtpFromEmail || '',
    secure: settings.smtpSecure || false
  };
  
  // Only return the config if the minimum required settings are present
  if (config.host && config.user && config.pass && config.from) {
    return config;
  }
  
  return null;
}
