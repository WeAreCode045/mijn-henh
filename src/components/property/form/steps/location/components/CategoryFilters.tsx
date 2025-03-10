
import { Badge } from "@/components/ui/badge";

export interface Category {
  name: string;
  count: number;
}

export interface CategoryFiltersProps {
  categories: Category[];
  activeFilters: string[];
  onFilterChange: (category: string) => void;
}

export function CategoryFilters({ categories, activeFilters, onFilterChange }: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <Badge
          key={category.name}
          className={`cursor-pointer ${activeFilters.includes(category.name) ? 'bg-blue-500' : 'bg-gray-300'}`}
          onClick={() => onFilterChange(category.name)}
        >
          {category.name.charAt(0).toUpperCase() + category.name.slice(1)} ({category.count})
        </Badge>
      ))}
    </div>
  );
}
