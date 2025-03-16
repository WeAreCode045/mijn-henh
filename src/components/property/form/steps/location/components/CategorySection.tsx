
import React from "react";
import { Button } from "@/components/ui/button";
import { PropertyPlaceType } from "@/types/property";
import { LucideIcon } from "lucide-react";

export interface CategorySectionProps {
  title: string;
  icon: string | React.ReactNode;
  onClick: () => Promise<void>;
  isLoading: boolean;
}

export function CategorySection({ title, icon, onClick, isLoading }: CategorySectionProps) {
  return (
    <div className="border rounded-md p-4">
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={onClick}
        disabled={isLoading}
      >
        {typeof icon === "string" ? (
          <span className="text-lg">{icon}</span>
        ) : (
          icon
        )}
        <span>{title}</span>
        {isLoading && (
          <span className="ml-auto">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          </span>
        )}
      </Button>
    </div>
  );
}
