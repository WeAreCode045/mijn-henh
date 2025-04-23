
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { ContactForm } from "../ContactForm";

interface ContactSidebarProps {
  property: PropertyData;
  settings: AgencySettings;
}

export function ContactSidebar({ property, settings }: ContactSidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Agent Info */}
      {property.agent && (
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Your Agent</h3>
          <div className="flex items-center gap-4">
            {property.agent.photoUrl ? (
              <img 
                src={property.agent.photoUrl} 
                alt={property.agent.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-2xl text-slate-600">
                  {property.agent.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium">{property.agent.name}</p>
              {property.agent.phone && (
                <p className="text-sm text-gray-600">{property.agent.phone}</p>
              )}
              {property.agent.email && (
                <p className="text-sm text-gray-600">{property.agent.email}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Agency Info */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Agency Information</h3>
        <div className="space-y-2">
          <p className="font-medium">{settings.name}</p>
          {settings.address && (
            <p className="text-sm text-gray-600">{settings.address}</p>
          )}
          {settings.phone && (
            <p className="text-sm text-gray-600">{settings.phone}</p>
          )}
          {settings.email && (
            <p className="text-sm text-gray-600">{settings.email}</p>
          )}
        </div>
      </div>

      {/* Contact Form */}
      <div>
        <h3 className="font-semibold mb-4">Contact Us</h3>
        <ContactForm 
          property={property}
          settings={settings}
        />
      </div>
    </div>
  );
}
