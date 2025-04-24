
import { PropertyData } from "@/types/property";
import { useState } from "react";

interface SideMenuProps {
  property: PropertyData;
  currentPage: number;
  onPageChange: (page: number) => void;
  settings?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export function SideMenu({ property, currentPage, onPageChange, settings }: SideMenuProps) {
  const primaryColor = settings?.primaryColor || '#1a365d';
  const secondaryColor = settings?.secondaryColor || '#3182ce';
  // Calculate menu items based on property data
  const menuItems = generateMenuItems(property);
  
  // Track which submenus are expanded
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({
    areas: true // Areas menu starts expanded
  });

  // Toggle submenu expanded state
  const toggleSubmenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };
  
  return (
    <div className="webview-menu rounded-lg p-4" style={{ backgroundColor: primaryColor }}>
      <h4 className="webview-text-sm font-medium text-white/70 mb-3 uppercase tracking-wide px-2">Navigation</h4>
      <ul className="space-y-0.5">
        {menuItems.map((item, index) => (
          <li key={index}>
            {item.type === 'parent' ? (
              <div className="space-y-0.5">
                <button
                  onClick={() => toggleSubmenu(item.key)}
                  className="webview-menu-item w-full text-left flex items-center justify-between group bg-white/0 hover:bg-white/10"
                >
                  <span className="text-white/90 group-hover:text-white">{item.label}</span>
                  <svg
                    className={`w-3.5 h-3.5 transform transition-transform`}
                    style={{ color: secondaryColor }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedMenus[item.key] && item.children && (
                  <ul className="ml-3 space-y-0.5">
                    {item.children.map((child, childIndex) => (
                      <li key={`${index}-${childIndex}`}>
                        <button
                          onClick={() => onPageChange(child.pageIndex)}
                          className={`webview-menu-item w-full text-left bg-white/0 hover:bg-white/10 ${
                            currentPage === child.pageIndex
                              ? 'active bg-white/10 text-white'
                              : 'text-white/75 hover:text-white'
                          }`}
                        >
                          {child.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <button
                onClick={() => onPageChange(item.pageIndex)}
                className={`webview-menu-item w-full text-left bg-white/0 hover:bg-white/10 ${
                  currentPage === item.pageIndex
                    ? 'active bg-white/10 text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Helper function to generate menu items based on property data
interface MenuItem {
  label: string;
  pageIndex: number;
  type?: 'parent' | 'child';
  key?: string;
  children?: MenuItem[];
}

function generateMenuItems(property: PropertyData): MenuItem[] {
  const menuItems: MenuItem[] = [
    { label: "Overview", pageIndex: 0 },
    { label: "Details", pageIndex: 1 }
  ];
  
  let currentIndex = 2;
  
  // Add areas as a parent menu item with children
  if (property.areas && property.areas.length > 0) {
    const areaChildren = property.areas.map((area, index) => ({
      label: area.title || `Area ${index + 1}`,
      pageIndex: currentIndex++,
      type: 'child' as const
    }));

    menuItems.push({
      label: "Areas",
      pageIndex: -1, // Parent items don't have a page index
      type: 'parent',
      key: 'areas',
      children: areaChildren
    });
  }
  
  // Add floorplan if available
  if ((property.floorplanEmbedScript && property.floorplanEmbedScript.trim() !== '') || 
      (property.floorplans && property.floorplans.length > 0)) {
    menuItems.push({
      label: "Floorplan",
      pageIndex: currentIndex++
    });
  }
  
  // Add neighborhood
  menuItems.push({
    label: "Neighborhood",
    pageIndex: currentIndex++
  });
  
  // Add Media menu item
  menuItems.push({
    label: "Media",
    pageIndex: currentIndex++
  });
  
  return menuItems;
}
