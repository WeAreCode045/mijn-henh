
import { WebViewSectionProps } from "../types";
import { ContactForm } from "../ContactForm";

export function ContactSection({ property, settings }: WebViewSectionProps) {
  // Prepare agent data
  const agentName = property.agent?.name || "Agent information not available";
  const agentImage = property.agent?.photoUrl || "";
  const agentPhone = property.agent?.phone || "";
  const agentEmail = property.agent?.email || "";

  return (
    <div className="space-y-4 pb-24">
      <div className="bg-white/90 p-4 rounded-lg shadow-sm mx-6">
        <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Agent Information */}
          <div className="space-y-4">
            <div className="flex items-center">
              {agentImage ? (
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <img 
                    src={agentImage} 
                    alt={agentName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-gray-500 text-xl">
                    {agentName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h4 className="font-semibold">{agentName}</h4>
                <p className="text-sm text-gray-500">Property Agent</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {agentPhone && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{agentPhone}</span>
                </div>
              )}
              
              {agentEmail && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{agentEmail}</span>
                </div>
              )}
              
              {property.agent?.address && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{property.agent.address}</span>
                </div>
              )}
            </div>
            
            {/* Agency Information */}
            {settings?.name && (
              <div className="pt-4 border-t mt-4">
                <h4 className="font-semibold mb-2">{settings.name}</h4>
                <div className="space-y-2 text-sm">
                  {settings.address && (
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{settings.address}</span>
                    </div>
                  )}
                  
                  {settings.phone && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{settings.phone}</span>
                    </div>
                  )}
                  
                  {settings.email && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{settings.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Contact Form */}
          <div>
            <ContactForm 
              property={property}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
