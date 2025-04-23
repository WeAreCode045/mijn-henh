
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/agency";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Navigation } from "./Navigation";
import { ShareButton } from "./ShareButton";
import { SideMenu } from "./SideMenu";
import { ContactSidebar } from "./ContactSidebar";

interface WebViewLayoutProps {
  property: PropertyData;
  settings: AgencySettings;
  currentPage: number;
  onPageChange: (page: number) => void;
  children: React.ReactNode;
}

export function WebViewLayout({
  property,
  settings,
  currentPage,
  onPageChange,
  children
}: WebViewLayoutProps) {
  const { primaryColor, secondaryColor } = useThemeColors(settings);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="w-40">
            {settings.logoUrl && (
              <img 
                src={settings.logoUrl} 
                alt={settings.name || 'Agency logo'} 
                className="h-12 object-contain"
              />
            )}
          </div>
          
          {/* Title and Price */}
          <div className="text-center">
            <h1 className="text-xl font-semibold" style={{ color: primaryColor }}>
              {property.title}
            </h1>
            <p className="text-lg" style={{ color: secondaryColor }}>
              € {property.price}
            </p>
          </div>
          
          {/* Share Button */}
          <div className="w-40 flex justify-end">
            <ShareButton propertyId={property.id} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <aside className="w-64 shrink-0">
            <SideMenu 
              property={property}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 max-w-[60%]">
            {children}
            
            {/* Navigation */}
            <Navigation
              currentPage={currentPage}
              totalPages={property.areas?.length ? 6 + property.areas.length : 6}
              onPrevious={() => onPageChange(currentPage - 1)}
              onNext={() => onPageChange(currentPage + 1)}
            />
          </div>

          {/* Right Sidebar */}
          <aside className="w-80 shrink-0">
            <div className="sticky top-24">
              <ContactSidebar 
                property={property}
                settings={settings}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
