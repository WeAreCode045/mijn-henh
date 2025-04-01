
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function LoadingState() {
  return (
    <Card>
      <CardContent className="py-10">
        <p className="text-center text-muted-foreground">Loading contact submissions...</p>
      </CardContent>
    </Card>
  );
}
