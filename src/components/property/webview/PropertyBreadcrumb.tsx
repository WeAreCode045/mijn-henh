
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyBreadcrumbProps {
  title: string;
  onBack: () => void;
}

export function PropertyBreadcrumb({ title, onBack }: PropertyBreadcrumbProps) {
  return (
    <div className="py-3 flex items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mr-2"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Properties
      </Button>
      
      <span className="text-sm text-gray-600 truncate">
        {title}
      </span>
    </div>
  );
}
