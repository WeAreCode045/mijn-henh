
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircleIcon } from "lucide-react";

export function EmptyState() {
  return (
    <Card>
      <CardContent className="py-10">
        <div className="text-center">
          <MessageCircleIcon className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-1">No contact submissions yet</h3>
          <p className="text-muted-foreground">
            When potential clients submit inquiries about this property, they'll appear here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
