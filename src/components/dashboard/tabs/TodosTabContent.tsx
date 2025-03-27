
import { CardContent } from "@/components/ui/card";
import { TodoSection } from "../TodoSection";

export function TodosTabContent() {
  return (
    <CardContent className="p-6">
      <TodoSection fullWidth={true} />
    </CardContent>
  );
}
