
import { PropertyData } from "@/types/property";
import { NavigationMenu } from "@/components/ui/navigation-menu";

interface SideMenuProps {
  property: PropertyData;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function SideMenu({ property, currentPage, onPageChange }: SideMenuProps) {
  return (
    <nav className="sticky top-24">
      <ul className="space-y-2">
        <MenuItem 
          title="Home" 
          isActive={currentPage === 0}
          onClick={() => onPageChange(0)}
        />
        <MenuItem 
          title="Introduction" 
          isActive={currentPage === 1}
          onClick={() => onPageChange(1)}
        />
        
        {/* Areas Submenu */}
        <div className="pl-4 py-2">
          <h3 className="font-semibold mb-2">Areas</h3>
          <ul className="space-y-1">
            {property.areas?.map((area, index) => (
              <MenuItem
                key={area.id}
                title={area.name}
                isActive={currentPage === index + 2}
                onClick={() => onPageChange(index + 2)}
                isSubmenu
              />
            ))}
          </ul>
        </div>

        <MenuItem 
          title="Floorplans" 
          isActive={currentPage === (property.areas?.length || 0) + 2}
          onClick={() => onPageChange((property.areas?.length || 0) + 2)}
        />
        <MenuItem 
          title="Location" 
          isActive={currentPage === (property.areas?.length || 0) + 3}
          onClick={() => onPageChange((property.areas?.length || 0) + 3)}
        />
        <MenuItem 
          title="Media" 
          isActive={currentPage === (property.areas?.length || 0) + 4}
          onClick={() => onPageChange((property.areas?.length || 0) + 4)}
        />
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
