
import { CardContent } from "@/components/ui/card";
import { HardHat } from "lucide-react";

interface UnderConstructionViewProps {
  title: string;
}

export function UnderConstructionView({ title }: UnderConstructionViewProps) {
  return (
    <CardContent>
      <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
        <HardHat className="h-16 w-16 mb-4 text-amber-500" />
        <h3 className="text-xl font-medium mb-2">{title} Coming Soon</h3>
        <p className="text-center max-w-md">
          This section is currently under construction. Check back later for updates!
        </p>
      </div>
    </CardContent>
  );
}
