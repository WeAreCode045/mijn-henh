
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { ReactNode } from "react";

interface AreaCardHeaderProps {
  title: string;
  areaId: string;
  onTitleChange: (value: string) => void;
  onRemove: () => void;
  children?: ReactNode;
}

export function AreaCardHeader({ 
  title, 
  areaId, 
  onTitleChange, 
  onRemove,
  children
}: AreaCardHeaderProps) {
  return (
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <CardTitle>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Area Title"
            className="text-xl font-bold"
          />
        </CardTitle>
        <div className="flex items-center gap-2">
          {children}
          <Button
            variant="outline"
            size="icon"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}
