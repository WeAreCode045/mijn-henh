
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Quick Property Navigation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search properties..."
                className="pl-8"
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
                  className="absolute right-0 top-0 h-10 w-10"
                >
                  <ChevronDown className="h-4 w-4" />
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
      </CardContent>
    </Card>
  );
}
