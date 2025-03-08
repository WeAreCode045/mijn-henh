
import { Badge } from "@/components/ui/badge";

interface CategoryFiltersProps {
  showCategories: {[key: string]: boolean};
  toggleCategory: (e: React.MouseEvent, category: string) => void;
}

export function CategoryFilters({ showCategories, toggleCategory }: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge 
        className={`cursor-pointer ${showCategories.education ? 'bg-blue-500' : 'bg-gray-300'}`}
        onClick={(e) => toggleCategory(e, 'education')}
      >
        Education
      </Badge>
      <Badge 
        className={`cursor-pointer ${showCategories.sports ? 'bg-blue-500' : 'bg-gray-300'}`} 
        onClick={(e) => toggleCategory(e, 'sports')}
      >
        Sports
      </Badge>
      <Badge 
        className={`cursor-pointer ${showCategories.transportation ? 'bg-blue-500' : 'bg-gray-300'}`}
        onClick={(e) => toggleCategory(e, 'transportation')}
      >
        Transportation
      </Badge>
      <Badge 
        className={`cursor-pointer ${showCategories.shopping ? 'bg-blue-500' : 'bg-gray-300'}`}
        onClick={(e) => toggleCategory(e, 'shopping')}
      >
        Shopping
      </Badge>
      <Badge 
        className={`cursor-pointer ${showCategories.restaurant ? 'bg-blue-500' : 'bg-gray-300'}`}
        onClick={(e) => toggleCategory(e, 'restaurant')}
      >
        Restaurants
      </Badge>
      <Badge 
        className={`cursor-pointer ${showCategories.health ? 'bg-blue-500' : 'bg-gray-300'}`}
        onClick={(e) => toggleCategory(e, 'health')}
      >
        Health
      </Badge>
      <Badge 
        className={`cursor-pointer ${showCategories.other ? 'bg-blue-500' : 'bg-gray-300'}`}
        onClick={(e) => toggleCategory(e, 'other')}
      >
        Other
      </Badge>
    </div>
  );
}
