
import { Card, CardContent } from "@/components/ui/card";

export function EmptyAreaMessage() {
  return (
    <Card>
      <CardContent className="py-10 text-center text-gray-500">
        No areas have been added yet. Click "Add Area" to create a new section.
      </CardContent>
    </Card>
  );
}
