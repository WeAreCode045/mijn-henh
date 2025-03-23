
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Filter } from "lucide-react";

export interface CategoryFiltersProps {
  filterType: "all" | "visible" | "hidden";
  setFilterType: (type: "all" | "visible" | "hidden") => void;
  isReadOnly?: boolean;
}

export function CategoryFilters({ 
  filterType, 
  setFilterType,
  isReadOnly = false
}: CategoryFiltersProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={filterType === "all" ? "default" : "outline"}
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setFilterType("all")}
        disabled={isReadOnly}
      >
        <Filter className="h-4 w-4" />
        All
      </Button>
      <Button
        variant={filterType === "visible" ? "default" : "outline"}
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setFilterType("visible")}
        disabled={isReadOnly}
      >
        <Eye className="h-4 w-4" />
        Visible
      </Button>
      <Button
        variant={filterType === "hidden" ? "default" : "outline"}
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setFilterType("hidden")}
        disabled={isReadOnly}
      >
        <EyeOff className="h-4 w-4" />
        Hidden
      </Button>
    </div>
  );
}
