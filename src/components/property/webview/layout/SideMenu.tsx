
import { PropertyData } from "@/types/property";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { useMemo } from "react";

interface SideMenuProps {
  property: PropertyData;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function SideMenu({ property, currentPage, onPageChange }: SideMenuProps) {
  // Calculate section indices based on property structure
  const sectionIndices = useMemo(() => {
    let indices = {
      overview: 0,
      details: 1,
      areasStart: 2,
      areasEnd: property.areas?.length ? 1 + property.areas.length : 1,
      floorplan: property.areas?.length ? 2 + property.areas.length : 2,
      location: property.areas?.length ? 3 + property.areas.length : 3,
      media: property.areas?.length ? 4 + property.areas.length : 4,
    };
    
    // Adjust if no floorplan
    if (!property.floorplanEmbedScript && (!property.floorplans || property.floorplans.length === 0)) {
      indices.location--;
      indices.media--;
    }
    
    console.log('Menu section indices:', indices);
    return indices;
  }, [property]);
  
  return (
    <nav className="sticky top-24">
      <ul className="space-y-2">
        <MenuItem 
          title="Home" 
          isActive={currentPage === sectionIndices.overview}
          onClick={() => onPageChange(sectionIndices.overview)}
        />
        <MenuItem 
          title="Introduction" 
          isActive={currentPage === sectionIndices.details}
          onClick={() => onPageChange(sectionIndices.details)}
        />
        
        {/* Areas Submenu */}
        {property.areas && property.areas.length > 0 && (
          <div className="pl-4 py-2">
            <h3 className="font-semibold mb-2">Areas</h3>
            <ul className="space-y-1">
              {property.areas?.map((area, index) => (
                <MenuItem
                  key={area.id}
                  title={area.title || area.name || `Area ${index + 1}`}
                  isActive={currentPage === sectionIndices.areasStart + index}
                  onClick={() => onPageChange(sectionIndices.areasStart + index)}
                  isSubmenu
                />
              ))}
            </ul>
          </div>
        )}

        {/* Show Floorplans menu item only if floorplan exists */}
        {(property.floorplanEmbedScript || (property.floorplans && property.floorplans.length > 0)) && (
          <MenuItem 
            title="Floorplans" 
            isActive={currentPage === sectionIndices.floorplan}
            onClick={() => onPageChange(sectionIndices.floorplan)}
          />
        )}
        
        <MenuItem 
          title="Location" 
          isActive={currentPage === sectionIndices.location}
          onClick={() => onPageChange(sectionIndices.location)}
        />
        
        {/* Show Media menu item only if virtual tour or youtube exists */}
        {((property.virtualTourUrl && property.virtualTourUrl.trim() !== '') || 
          (property.youtubeUrl && property.youtubeUrl.trim() !== '')) && (
          <MenuItem 
            title="Media" 
            isActive={currentPage === sectionIndices.media}
            onClick={() => onPageChange(sectionIndices.media)}
          />
        )}
      </ul>
    </nav>
  );
}

function MenuItem({ 
  title, 
  isActive, 
  onClick, 
  isSubmenu = false 
}: { 
  title: string; 
  isActive: boolean; 
  onClick: () => void;
  isSubmenu?: boolean;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full text-left px-4 py-2 rounded-lg transition-colors
          ${isActive 
            ? 'bg-slate-800 text-white' 
            : 'hover:bg-slate-100 text-slate-700'}
          ${isSubmenu ? 'text-sm' : 'font-medium'}
        `}
      >
        {title}
      </button>
    </li>
  );
}
