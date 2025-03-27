
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { useDebounce } from "@/hooks/useDebounce";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function PropertyQuickNav() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { properties, isLoading } = useProperties(debouncedSearchTerm, 5);

  const handlePropertySelect = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const handleViewAllProperties = () => {
    navigate('/properties');
  };

  return (
    <div className="relative">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search properties..."
              className="pl-8 pr-4 w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value && !isDropdownOpen) {
                  setIsDropdownOpen(true);
                }
              }}
              onFocus={() => {
                if (searchTerm) {
                  setIsDropdownOpen(true);
                }
              }}
            />
            <DropdownMenuTrigger asChild>
              <div className="sr-only">Open property search results</div>
            </DropdownMenuTrigger>
          </div>
          <Button 
            onClick={handleViewAllProperties} 
            variant="outline" 
            size="sm" 
            className="whitespace-nowrap"
          >
            <ListFilter className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
        <DropdownMenuContent 
          className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[240px]" 
          align="start"
          sideOffset={5}
        >
          {isLoading ? (
            <div className="p-2 text-sm text-muted-foreground">Loading properties...</div>
          ) : properties.length > 0 ? (
            properties.map((property) => (
              <DropdownMenuItem
                key={property.id}
                onClick={() => handlePropertySelect(property.id)}
                className="cursor-pointer"
              >
                {property.title || `Property ID: ${property.id.substring(0, 8)}`}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-2 text-sm text-muted-foreground">
              {searchTerm ? "No properties found" : "Start typing to search properties"}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
