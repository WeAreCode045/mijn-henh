
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useProperties } from "@/hooks/useProperties";
import { useDebounce } from "@/hooks/useDebounce";

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
    <Card className="h-full bg-transparent border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Quick Property Navigation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search properties..."
                className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/60"
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
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10 bg-white/10 border-white/20 hover:bg-white/20"
                >
                  <ChevronDown className="h-4 w-4 text-white" />
                </Button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent 
              className="w-full min-w-[240px] bg-background" 
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
        
        <Button 
          onClick={handleViewAllProperties} 
          variant="outline" 
          size="sm" 
          className="w-full mt-3 text-white border-white/20 bg-white/10 hover:bg-white/20"
        >
          <ListFilter className="h-4 w-4 mr-2" />
          View All Properties
        </Button>
      </CardContent>
    </Card>
  );
}
